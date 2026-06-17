package service

/**
 * 公共配置服务
 * 封装公共配置的业务逻辑
 */

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server/internal/model"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server/internal/repository"
)

type ICommonConfigService interface {
	FindAll(ctx context.Context) ([]model.CommonConfig, error)
	FindOne(ctx context.Context, id int64) (*model.CommonConfig, error)
	FindByKey(ctx context.Context, key string) (*model.CommonConfig, error)
	Create(ctx context.Context, input CommonConfigCreateInput) (*model.CommonConfig, error)
	Update(ctx context.Context, id int64, input CommonConfigUpdateInput) (*model.CommonConfig, error)
	RefreshTokenByKey(ctx context.Context, key string) (*model.CommonConfig, error)
	Delete(ctx context.Context, id int64) error
}

type commonConfigService struct {
	repo repository.ICommonConfigRepository
}

func NewCommonConfigService(repo repository.ICommonConfigRepository) ICommonConfigService {
	return &commonConfigService{repo: repo}
}

// CommonConfigCreateInput 定义创建配置所需的字段（指针用于区分是否传值）
type CommonConfigCreateInput struct {
	ConfigKey   string // 必填
	ConfigValue *string
	ConfigExtra *string
	Description *string
	SortOrder   *int
	IsEnabled   *bool
}

// CommonConfigUpdateInput 定义更新配置所需的字段（全部可选）
type CommonConfigUpdateInput struct {
	ConfigKey   *string
	ConfigValue *string
	ConfigExtra *string
	Description *string
	SortOrder   *int
	IsEnabled   *bool
}

type commonConfigExtra struct {
	LoginAPIData string `json:"loginApiData"`
}

func (s *commonConfigService) FindAll(ctx context.Context) ([]model.CommonConfig, error) {
	return s.repo.FindAll(ctx)
}

func (s *commonConfigService) FindOne(ctx context.Context, id int64) (*model.CommonConfig, error) {
	cfg, err := s.repo.FindOne(ctx, id)
	if err != nil {
		return nil, err
	}
	if cfg == nil {
		return nil, errors.New("配置项不存在")
	}
	return cfg, nil
}

func (s *commonConfigService) FindByKey(ctx context.Context, key string) (*model.CommonConfig, error) {
	return s.repo.FindByKey(ctx, key)
}

func (s *commonConfigService) Create(ctx context.Context, input CommonConfigCreateInput) (*model.CommonConfig, error) {
	existing, err := s.repo.FindByKey(ctx, input.ConfigKey)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("配置键已存在")
	}
	sortOrder := 0
	if input.SortOrder != nil {
		sortOrder = *input.SortOrder
	}
	isEnabled := true
	if input.IsEnabled != nil {
		isEnabled = *input.IsEnabled
	}

	cfg := model.CommonConfig{
		ConfigKey:   input.ConfigKey,
		ConfigValue: input.ConfigValue,
		ConfigExtra: input.ConfigExtra,
		Description: input.Description,
		SortOrder:   sortOrder,
		IsEnabled:   isEnabled,
	}
	if err := s.repo.Create(ctx, &cfg); err != nil {
		return nil, err
	}
	return &cfg, nil
}

func (s *commonConfigService) Update(ctx context.Context, id int64, input CommonConfigUpdateInput) (*model.CommonConfig, error) {
	cfg, err := s.FindOne(ctx, id)
	if err != nil {
		return nil, err
	}
	if input.ConfigKey != nil && *input.ConfigKey != cfg.ConfigKey {
		existing, err := s.repo.FindByKey(ctx, *input.ConfigKey)
		if err != nil {
			return nil, err
		}
		if existing != nil {
			return nil, errors.New("配置键已存在")
		}
		cfg.ConfigKey = *input.ConfigKey
	}

	if input.ConfigValue != nil {
		cfg.ConfigValue = input.ConfigValue
	}
	if input.ConfigExtra != nil {
		cfg.ConfigExtra = input.ConfigExtra
	}
	if input.Description != nil {
		cfg.Description = input.Description
	}
	if input.SortOrder != nil {
		cfg.SortOrder = *input.SortOrder
	}
	if input.IsEnabled != nil {
		cfg.IsEnabled = *input.IsEnabled
	}

	if err := s.repo.Update(ctx, cfg); err != nil {
		return nil, err
	}
	return cfg, nil
}

func (s *commonConfigService) RefreshTokenByKey(ctx context.Context, key string) (*model.CommonConfig, error) {
	if key != "TuQiangToken" {
		return nil, errors.New("暂不支持刷新该配置")
	}

	cfg, err := s.findOneByKeyForRefresh(ctx, key)
	if err != nil {
		return nil, err
	}
	if !cfg.IsEnabled {
		return nil, errors.New("配置未启用")
	}
	if cfg.ConfigExtra == nil || strings.TrimSpace(*cfg.ConfigExtra) == "" {
		return nil, errors.New("配置扩展参数不存在")
	}

	var extra commonConfigExtra
	if err := json.Unmarshal([]byte(*cfg.ConfigExtra), &extra); err != nil {
		return nil, errors.New("配置扩展参数不是有效 JSON")
	}
	loginAPIData := strings.TrimSpace(extra.LoginAPIData)
	if loginAPIData == "" {
		return nil, errors.New("loginApiData 未配置")
	}

	token, err := requestTuQiangSessionID(ctx, loginAPIData)
	if err != nil {
		return nil, err
	}
	cfg.ConfigValue = &token
	if err := s.repo.Update(ctx, cfg); err != nil {
		return nil, err
	}
	return cfg, nil
}

func (s *commonConfigService) findOneByKeyForRefresh(ctx context.Context, key string) (*model.CommonConfig, error) {
	cfg, err := s.repo.FindByKey(ctx, key)
	if err != nil {
		return nil, err
	}
	if cfg == nil {
		return nil, errors.New("配置项不存在")
	}
	return cfg, nil
}

func requestTuQiangSessionID(ctx context.Context, loginAPIData string) (string, error) {
	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodPost,
		"http://tuqiang123.com/api/regdc",
		strings.NewReader(loginAPIData),
	)
	if err != nil {
		return "", err
	}

	req.Header.Set("Accept", "application/json, text/javascript, */*; q=0.01")
	req.Header.Set("Accept-Language", "zh-CN,zh;q=0.9")
	req.Header.Set("Cache-Control", "no-cache")
	req.Header.Set("Connection", "keep-alive")
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
	req.Header.Set("Origin", "http://tuqiang123.com")
	req.Header.Set("Pragma", "no-cache")
	req.Header.Set("Referer", "http://tuqiang123.com/index.jsp")
	req.Header.Set("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1")
	req.Header.Set("X-Requested-With", "XMLHttpRequest")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return "", fmt.Errorf("登录接口返回异常状态: %d", resp.StatusCode)
	}

	for _, cookie := range resp.Cookies() {
		if cookie.Name == "SHAREJSESSIONID" && cookie.Value != "" {
			return cookie.Value, nil
		}
	}
	if len(body) > 0 {
		return "", errors.New("登录成功但响应中没有 SHAREJSESSIONID")
	}
	return "", errors.New("登录响应中没有 SHAREJSESSIONID")
}

func (s *commonConfigService) Delete(ctx context.Context, id int64) error {
	cfg, err := s.FindOne(ctx, id)
	if err != nil {
		return err
	}
	return s.repo.Delete(ctx, cfg)
}
