package service

/**
 * 车辆轨迹服务
 * 封装车辆轨迹同步、查询和坐标转换业务逻辑
 */

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/dto"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/model"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/repository"
)

type IVehicleTrackService interface {
	SyncTrackData(ctx context.Context, req dto.SyncTrackRequest) (int, int, error)
	FindAll(ctx context.Context, req dto.QueryTrackRequest) ([]model.VehicleTrack, dto.Pagination, error)
	BatchConvertToGcj02(ctx context.Context, req dto.ConvertCoordinateRequest) (int, int, error)
}

type vehicleTrackService struct {
	tracks repository.IVehicleTrackRepository
	config repository.ICommonConfigRepository
}

func NewVehicleTrackService(
	tracks repository.IVehicleTrackRepository,
	config repository.ICommonConfigRepository,
) IVehicleTrackService {
	return &vehicleTrackService{
		tracks: tracks,
		config: config,
	}
}

// ExternalAPIError 用于标记外部 API 调用异常，方便在 Handler 中区分 502 和 500
type ExternalAPIError struct {
	Msg string
}

func (e *ExternalAPIError) Error() string {
	return e.Msg
}

func (s *vehicleTrackService) SyncTrackData(ctx context.Context, req dto.SyncTrackRequest) (int, int, error) {
	client, err := s.buildTuQiangClient(ctx)
	if err != nil {
		return 0, 0, err
	}

	form := url.Values{}
	form.Set("startTime", req.StartTime)
	form.Set("endTime", req.EndTime)
	form.Set("imei", "868120325700570")
	form.Set("selectMap", "baiduMap")
	form.Set("selectType", "gps,lbs,wifi,inertia")
	form.Set("filter", "false")

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, "http://tuqiang123.com/trackreplay/initPiont", strings.NewReader(form.Encode()))
	if err != nil {
		return 0, 0, err
	}
	// 复刻原 axios 客户端的请求头
	cfg, _ := s.config.FindByKey(ctx, "TuQiangToken")
	cookieValue := ""
	if cfg != nil && cfg.ConfigValue != nil {
		cookieValue = *cfg.ConfigValue
	}
	cookieHeader := fmt.Sprintf("checkChildAlarm=0; SHAREJSESSIONID=%s", cookieValue)

	httpReq.Header.Set("Accept", "application/json, text/javascript, */*; q=0.01")
	httpReq.Header.Set("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8")
	httpReq.Header.Set("Connection", "keep-alive")
	httpReq.Header.Set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
	httpReq.Header.Set("Origin", "http://tuqiang123.com")
	httpReq.Header.Set("Referer", "http://tuqiang123.com/trackreplay/locus?imei=868120325700570&hrefType=1")
	httpReq.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36")
	httpReq.Header.Set("X-Requested-With", "XMLHttpRequest")
	httpReq.Header.Set("Cookie", cookieHeader)

	resp, err := client.Do(httpReq)
	if err != nil {
		return 0, 0, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, 0, err
	}

	var parsed struct {
		Code int `json:"code"`
		Ok   bool `json:"ok"`
		Msg  string `json:"msg"`
		Data struct {
			Data []map[string]any `json:"data"`
		} `json:"data"`
	}
	if err := json.Unmarshal(body, &parsed); err != nil {
		return 0, 0, err
	}
	if parsed.Code != 0 || !parsed.Ok {
		return 0, 0, &ExternalAPIError{Msg: fmt.Sprintf("外部API返回错误: %s", parsed.Msg)}
	}

	success := 0
	failed := 0
	for _, item := range parsed.Data.Data {
		if err := s.saveTrackData(ctx, item); err != nil {
			failed++
		} else {
			success++
		}
	}
	return success, failed, nil
}

func (s *vehicleTrackService) FindAll(ctx context.Context, req dto.QueryTrackRequest) ([]model.VehicleTrack, dto.Pagination, error) {
	var startPtr, endPtr *int64
	if req.StartTime > 0 {
		v := req.StartTime
		startPtr = &v
	}
	if req.EndTime > 0 {
		v := req.EndTime
		endPtr = &v
	}

	list, total, err := s.tracks.FindPaged(ctx, req.Page, req.Limit, startPtr, endPtr, req.MissingGcj02)
	if err != nil {
		return nil, dto.Pagination{}, err
	}
	if req.Page <= 0 {
		req.Page = 1
	}
	if req.Limit <= 0 {
		req.Limit = 10
	}
	totalPages := int((total + int64(req.Limit) - 1) / int64(req.Limit))
	return list, dto.Pagination{
		Page:       req.Page,
		Limit:      req.Limit,
		Total:      total,
		TotalPages: totalPages,
	}, nil
}

func (s *vehicleTrackService) BatchConvertToGcj02(ctx context.Context, req dto.ConvertCoordinateRequest) (int, int, error) {
	var startPtr, endPtr *int64
	if req.StartTime != nil && *req.StartTime > 0 {
		startPtr = req.StartTime
	}
	if req.EndTime != nil && *req.EndTime > 0 {
		endPtr = req.EndTime
	}
	tracks, err := s.tracks.FindMissingGcj02(ctx, startPtr, endPtr)
	if err != nil {
		return 0, 0, err
	}
	if len(tracks) == 0 {
		return 0, 0, nil
	}

	success := 0
	failed := 0
	const batchSize = 100
	for i := 0; i < len(tracks); i += batchSize {
		end := i + batchSize
		if end > len(tracks) {
			end = len(tracks)
		}
		batch := tracks[i:end]

		coords := make([][2]float64, 0, len(batch))
		for _, t := range batch {
			coords = append(coords, [2]float64{t.Lat, t.Lng})
		}

		converted, err := s.convertBaiduToGcj02Batch(ctx, coords)
		if err != nil {
			failed += len(batch)
			continue
		}

		for idx, c := range converted {
			if c == nil {
				failed++
				continue
			}
			t := batch[idx]
			lat := c[0]
			lng := c[1]
			t.LatGCJ02 = &lat
			t.LngGCJ02 = &lng
			if err := s.tracks.Update(ctx, &t); err != nil {
				failed++
			} else {
				success++
			}
		}
	}
	return success, failed, nil
}

func (s *vehicleTrackService) buildTuQiangClient(ctx context.Context) (*http.Client, error) {
	cfg, err := s.config.FindByKey(ctx, "TuQiangToken")
	if err != nil {
		return nil, err
	}
	if cfg == nil {
		return nil, errors.New("途强 Token 配置不存在")
	}
	if !cfg.IsEnabled {
		return nil, errors.New("途强 Token 配置未启用")
	}

	return &http.Client{
		Timeout: 60 * time.Second,
	}, nil
}

func (s *vehicleTrackService) convertBaiduToGcj02Batch(
	ctx context.Context,
	coordinates [][2]float64,
) ([]*[2]float64, error) {
	if len(coordinates) == 0 {
		return []*[2]float64{}, nil
	}

	cfg, err := s.config.FindByKey(ctx, "BaiduMapApiKey")
	if err != nil {
		return nil, err
	}
	if cfg == nil || !cfg.IsEnabled || cfg.ConfigValue == nil || *cfg.ConfigValue == "" {
		return make([]*[2]float64, len(coordinates)), nil
	}

	coordsStr := ""
	for idx, c := range coordinates {
		if idx > 0 {
			coordsStr += ";"
		}
		coordsStr += fmt.Sprintf("%f,%f", c[1], c[0])
	}

	urlStr := fmt.Sprintf(
		"https://api.map.baidu.com/geoconv/v1/?coords=%s&from=5&to=3&ak=%s",
		url.QueryEscape(coordsStr),
		*cfg.ConfigValue,
	)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, urlStr, nil)
	if err != nil {
		return nil, err
	}

	client := &http.Client{Timeout: 60 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var parsed struct {
		Status int `json:"status"`
		Result []struct {
			X float64 `json:"x"`
			Y float64 `json:"y"`
		} `json:"result"`
		Message string `json:"message"`
	}
	if err := json.Unmarshal(body, &parsed); err != nil {
		return nil, err
	}
	if parsed.Status != 0 || len(parsed.Result) == 0 {
		return make([]*[2]float64, len(coordinates)), nil
	}

	out := make([]*[2]float64, len(coordinates))
	for i, r := range parsed.Result {
		v := [2]float64{r.Y, r.X}
		out[i] = &v
	}
	return out, nil
}

func (s *vehicleTrackService) saveTrackData(ctx context.Context, item map[string]any) error {
	gpsTimeValue, _ := item["gpsTime"].(string)
	gpsTimeStamp := parseTimestamp(gpsTimeValue)
	if gpsTimeStamp == 0 {
		return nil
	}

	existing, err := s.tracks.FindByImeiAndGPSTime(ctx, "868120325700570", gpsTimeStamp)
	if err != nil {
		return err
	}
	if existing != nil {
		return nil
	}

	latStr := toString(item["lat"])
	lngStr := toString(item["lng"])
	baiduLat := parseFloat(latStr)
	baiduLng := parseFloat(lngStr)

	track := model.VehicleTrack{
		Imei:      "868120325700570",
		Direction: parseInt(toString(item["direction"])),
		GateTime:  parseTimestamp(toString(firstNonEmpty(item["gate_time"], item["gateTime"]))),
		GPSMode:   parseInt(toString(item["gpsMode"])),
		GPSSpeed:  parseFloat(toString(item["gpsSpeed"])),
		GPSTime:   gpsTimeStamp,
		Lat:       baiduLat,
		Lng:       baiduLng,
		PosMethod: parseInt(toString(item["posMethod"])),
		PosMulFlag: parseInt(toString(item["posMulFlag"])),
		PosType:   parseInt(toString(item["posType"])),
		Precision: parseInt(toString(item["precision"])),
	}

	return s.tracks.Create(ctx, &track)
}

func parseFloat(v string) float64 {
	if v == "" {
		return 0
	}
	f, _ := strconv.ParseFloat(v, 64)
	return f
}

func parseInt(v string) int {
	if v == "" {
		return 0
	}
	i, _ := strconv.Atoi(v)
	return i
}

func parseTimestamp(v string) int64 {
	if v == "" {
		return 0
	}
	if num, err := strconv.ParseInt(v, 10, 64); err == nil {
		if len(v) == 10 {
			return num * 1000
		}
		return num
	}
	layout := "2006-01-02 15:04:05"
	if t, err := time.Parse(layout, v); err == nil {
		return t.UnixMilli()
	}
	return 0
}

func toString(v any) string {
	switch t := v.(type) {
	case string:
		return t
	case float64:
		return strconv.FormatFloat(t, 'f', -1, 64)
	case int:
		return strconv.Itoa(t)
	case int64:
		return strconv.FormatInt(t, 10)
	default:
		return ""
	}
}

func firstNonEmpty(values ...any) any {
	for _, v := range values {
		if v != nil {
			return v
		}
	}
	return nil
}

