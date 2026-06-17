package repository

/**
 * Demo 仓储
 * 负责 demo 表的数据访问
 */

import (
	"context"

	"gorm.io/gorm"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server/internal/model"
)

type IDemoRepository interface {
	Create(ctx context.Context, demo *model.Demo) error
	FindAll(ctx context.Context) ([]model.Demo, error)
	FindOne(ctx context.Context, id int64) (*model.Demo, error)
	Update(ctx context.Context, demo *model.Demo) error
	Delete(ctx context.Context, demo *model.Demo) error
}

type demoRepository struct {
	db *gorm.DB
}

func NewDemoRepository(db *gorm.DB) IDemoRepository {
	return &demoRepository{db: db}
}

func (r *demoRepository) Create(ctx context.Context, demo *model.Demo) error {
	return r.db.WithContext(ctx).Create(demo).Error
}

func (r *demoRepository) FindAll(ctx context.Context) ([]model.Demo, error) {
	var list []model.Demo
	if err := r.db.WithContext(ctx).Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *demoRepository) FindOne(ctx context.Context, id int64) (*model.Demo, error) {
	var demo model.Demo
	if err := r.db.WithContext(ctx).First(&demo, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &demo, nil
}

func (r *demoRepository) Update(ctx context.Context, demo *model.Demo) error {
	return r.db.WithContext(ctx).Save(demo).Error
}

func (r *demoRepository) Delete(ctx context.Context, demo *model.Demo) error {
	return r.db.WithContext(ctx).Delete(demo).Error
}
