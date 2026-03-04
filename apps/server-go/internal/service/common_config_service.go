package service

/**
 * 公共配置服务
 * 封装公共配置的业务逻辑
 */

import (
	"context"
	"errors"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/model"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/repository"
)

type ICommonConfigService interface {
	FindAll(ctx context.Context) ([]model.CommonConfig, error)
	FindOne(ctx context.Context, id int64) (*model.CommonConfig, error)
	FindByKey(ctx context.Context, key string) (*model.CommonConfig, error)
	Create(ctx context.Context, input CommonConfigCreateInput) (*model.CommonConfig, error)
	Update(ctx context.Context, id int64, input CommonConfigUpdateInput) (*model.CommonConfig, error)
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
	ConfigKey   string  // 必填
	ConfigValue *string
	Description *string
	SortOrder   *int
	IsEnabled   *bool
}

// CommonConfigUpdateInput 定义更新配置所需的字段（全部可选）
type CommonConfigUpdateInput struct {
	ConfigKey   *string
	ConfigValue *string
	Description *string
	SortOrder   *int
	IsEnabled   *bool
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

func (s *commonConfigService) Delete(ctx context.Context, id int64) error {
	cfg, err := s.FindOne(ctx, id)
	if err != nil {
		return err
	}
	return s.repo.Delete(ctx, cfg)
}

