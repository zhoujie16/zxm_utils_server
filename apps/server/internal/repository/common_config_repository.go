package repository

/**
 * CommonConfig 仓储
 * 负责公共配置数据的持久化访问
 */

import (
	"context"

	"gorm.io/gorm"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server/internal/model"
)

type ICommonConfigRepository interface {
	FindAll(ctx context.Context) ([]model.CommonConfig, error)
	FindOne(ctx context.Context, id int64) (*model.CommonConfig, error)
	FindByKey(ctx context.Context, key string) (*model.CommonConfig, error)
	Create(ctx context.Context, cfg *model.CommonConfig) error
	Update(ctx context.Context, cfg *model.CommonConfig) error
	Delete(ctx context.Context, cfg *model.CommonConfig) error
}

type commonConfigRepository struct {
	db *gorm.DB
}

func NewCommonConfigRepository(db *gorm.DB) ICommonConfigRepository {
	return &commonConfigRepository{db: db}
}

func (r *commonConfigRepository) FindAll(ctx context.Context) ([]model.CommonConfig, error) {
	var list []model.CommonConfig
	if err := r.db.WithContext(ctx).
		Order("sortOrder ASC, id ASC").
		Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *commonConfigRepository) FindOne(ctx context.Context, id int64) (*model.CommonConfig, error) {
	var cfg model.CommonConfig
	if err := r.db.WithContext(ctx).
		First(&cfg, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &cfg, nil
}

func (r *commonConfigRepository) FindByKey(ctx context.Context, key string) (*model.CommonConfig, error) {
	var cfg model.CommonConfig
	if err := r.db.WithContext(ctx).
		Where("configKey = ?", key).
		First(&cfg).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &cfg, nil
}

func (r *commonConfigRepository) Create(ctx context.Context, cfg *model.CommonConfig) error {
	return r.db.WithContext(ctx).Create(cfg).Error
}

func (r *commonConfigRepository) Update(ctx context.Context, cfg *model.CommonConfig) error {
	return r.db.WithContext(ctx).Save(cfg).Error
}

func (r *commonConfigRepository) Delete(ctx context.Context, cfg *model.CommonConfig) error {
	return r.db.WithContext(ctx).Delete(cfg).Error
}
