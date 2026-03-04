package service

/**
 * 车辆行程服务
 * 封装车辆行程同步和查询业务逻辑
 */

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/dto"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/model"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/repository"
)

type IVehicleTripService interface {
	SyncTripData(ctx context.Context, req dto.SyncTripRequest) (int, int, error)
	FindAll(ctx context.Context, req dto.QueryTripRequest) ([]model.VehicleTrip, dto.Pagination, error)
}

type vehicleTripService struct {
	trips  repository.IVehicleTripRepository
	config repository.ICommonConfigRepository
}

func NewVehicleTripService(
	trips repository.IVehicleTripRepository,
	config repository.ICommonConfigRepository,
) IVehicleTripService {
	return &vehicleTripService{
		trips:  trips,
		config: config,
	}
}

func (s *vehicleTripService) SyncTripData(ctx context.Context, req dto.SyncTripRequest) (int, int, error) {
	client, headers, err := s.buildWanCheBaoClient(ctx)
	if err != nil {
		return 0, 0, err
	}

	month := req.Month
	if month == "" {
		return 0, 0, errors.New("时间不能为空")
	}
	startTime, endTime := parseMonthToTimestamp(month)

	u, err := url.Parse("https://online.wanchebao.com/v2/driveRecord/section")
	if err != nil {
		return 0, 0, err
	}
	q := u.Query()
	q.Set("vehicleId", "2032011")
	q.Set("page", "1")
	q.Set("limit", "1000")
	q.Set("startTime", strconv.FormatInt(startTime, 10))
	q.Set("endTime", strconv.FormatInt(endTime, 10))
	q.Set("lang", "CN")
	u.RawQuery = q.Encode()

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodGet, u.String(), nil)
	if err != nil {
		return 0, 0, err
	}
	for k, v := range headers {
		httpReq.Header.Set(k, v)
	}

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
		Code int             `json:"code"`
		Msg  string          `json:"msg"`
		Data []map[string]any `json:"data"`
	}
	if err := json.Unmarshal(body, &parsed); err != nil {
		return 0, 0, err
	}
	if parsed.Code != 0 {
		return 0, 0, &ExternalAPIError{Msg: fmt.Sprintf("外部API返回错误: %s", parsed.Msg)}
	}

	success := 0
	failed := 0
	for _, item := range parsed.Data {
		if err := s.saveTripData(ctx, item); err != nil {
			failed++
		} else {
			success++
		}
	}
	return success, failed, nil
}

func (s *vehicleTripService) FindAll(ctx context.Context, req dto.QueryTripRequest) ([]model.VehicleTrip, dto.Pagination, error) {
	var startPtr, endPtr *int64
	if req.StartTime > 0 {
		v := req.StartTime
		startPtr = &v
	}
	if req.EndTime > 0 {
		v := req.EndTime
		endPtr = &v
	}

	list, total, err := s.trips.FindPaged(ctx, req.Page, req.Limit, startPtr, endPtr)
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

func (s *vehicleTripService) buildWanCheBaoClient(ctx context.Context) (*http.Client, map[string]string, error) {
	cfg, err := s.config.FindByKey(ctx, "WanCheBaoToken")
	if err != nil {
		return nil, nil, err
	}
	if cfg == nil {
		return nil, nil, errors.New("万车宝 Token 配置不存在")
	}
	if !cfg.IsEnabled {
		return nil, nil, errors.New("万车宝 Token 配置未启用")
	}
	token := ""
	if cfg.ConfigValue != nil {
		token = *cfg.ConfigValue
	}

	headers := map[string]string{
		"Host":            "online.wanchebao.com",
		"Accept":          "*/*",
		"appName":         "",
		"appVer":          "3.0.5",
		"mobileModel":     "iPhone 13",
		"os":              "iOS",
		"mobileBrand":     "iPhone",
		"Accept-Language": "zh-Hans-CN;q=1, en-CN;q=0.9",
		"osVer":           "18.6.2",
		"token":           token,
		"User-Agent":      "Advancer AD10/3.0.5 (iPhone; iOS 18.6.2; Scale/3.00)",
		"lang":            "CN",
		"Content-Type":    "application/json",
		"Cookie":          "JSESSIONID=9BD5378F7D8AD5AC59E6A18ED16F7112",
	}

	client := &http.Client{
		Timeout: 60 * time.Second,
	}
	return client, headers, nil
}

func (s *vehicleTripService) saveTripData(ctx context.Context, item map[string]any) error {
	rawField, _ := item["raw"]
	rawData := map[string]any{}
	switch v := rawField.(type) {
	case string:
		_ = json.Unmarshal([]byte(v), &rawData)
	case map[string]any:
		rawData = v
	}

	idStr := toString(item["id"])
	externalId, _ := strconv.ParseInt(idStr, 10, 64)

	existing, err := s.trips.FindByExternalID(ctx, externalId)
	if err != nil {
		return err
	}

	tripData := model.VehicleTrip{
		ExternalID: externalId,
		VehicleID:  int(parseInt(toString(item["vehicleId"]))),
		ModelID:    int(parseInt(toString(item["modelId"]))),
		Model:      toString(item["model"]),
		BrandID:    int(parseInt(toString(item["brandId"]))),
		Brand:      toString(item["brand"]),
		SeriesID:   int(parseInt(toString(item["seriesId"]))),
		Series:     toString(item["series"]),
		DeviceID:   toString(item["deviceId"]),
		UnitID:     int(parseInt(toString(item["unitId"]))),
		Consumption: int(roundFloat(toFloat(toString(item["consumption"])))),
		Mileage:     int(roundFloat(toFloat(toString(item["mileage"])))),
		Velocity:    int(roundFloat(toFloat(toString(item["velocity"])))),
		MaxSpeed:    int(roundFloat(toFloat(toString(item["maxSpeed"])))),
		SharpAcceleration: int(parseInt(toString(item["sharpAcceleration"]))),
		SharpDeceleration: int(parseInt(toString(item["sharpDeceleration"]))),
		SharpTurn:         int(parseInt(toString(item["sharpTurn"]))),
		StartTime:         int64(parseInt(toString(item["startTime"]))),
		EndTime:           int64(parseInt(toString(item["endTime"]))),
		RawStartTime:      int64(parseInt(toString(rawData["start_time"]))),
		RawEndTime:        int64(parseInt(toString(rawData["end_time"]))),
		RawAvgOil:         int(parseInt(toString(rawData["te_record_trip_avg_oil"]))),
		RawAvgRPM:         int(parseInt(toString(rawData["te_record_trip_avg_rpm"]))),
		RawAvgSpeed:       int(parseInt(toString(rawData["te_record_trip_avg_speed"]))),
		RawMaxRPM:         int(parseInt(toString(rawData["te_record_trip_max_rpm"]))),
		RawMaxSpeed:       int(parseInt(toString(rawData["te_record_trip_max_speed"]))),
		RawMileage:        int(parseInt(toString(rawData["te_record_trip_mileage"]))),
		RawNo:             int(parseInt(toString(rawData["te_record_trip_no"]))),
		RawOil:            int(parseInt(toString(rawData["te_record_trip_oil"]))),
		RawRunTime:        int(parseInt(toString(rawData["te_record_trip_run_time"]))),
		RawStartTime2:     int64(parseInt(toString(rawData["te_record_trip_start_time"]))),
		RawType:           int(parseInt(toString(rawData["te_record_trip_type"]))),
		RawUrgentAcc:      int(parseInt(toString(rawData["te_record_trip_urgent_acc_cnt"]))),
		RawUrgentDec:      int(parseInt(toString(rawData["te_record_trip_urgent_dec_cnt"]))),
		RawUrgentTurn:     int(parseInt(toString(rawData["te_record_trip_urgent_turn_cnt"]))),
	}

	if existing != nil {
		tripData.ID = existing.ID
		return s.trips.Update(ctx, &tripData)
	}
	return s.trips.Create(ctx, &tripData)
}

func parseMonthToTimestamp(month string) (int64, int64) {
	parts := strings.Split(month, "-")
	if len(parts) != 2 {
		return 0, 0
	}
	year, _ := strconv.Atoi(parts[0])
	monthNum, _ := strconv.Atoi(parts[1])
	// 使用本地时区计算月份起止时间，与 NestJS 的 new Date(year, month-1, ...) 行为保持一致
	startDate := time.Date(year, time.Month(monthNum), 1, 0, 0, 0, 0, time.Local)
	endDate := startDate.AddDate(0, 1, 0).Add(-time.Millisecond)
	return startDate.UnixMilli(), endDate.UnixMilli()
}

func toFloat(v string) float64 {
	if v == "" {
		return 0
	}
	f, _ := strconv.ParseFloat(v, 64)
	return f
}

func roundFloat(f float64) float64 {
	if f >= 0 {
		return math.Floor(f + 0.5)
	}
	return math.Ceil(f - 0.5)
}

