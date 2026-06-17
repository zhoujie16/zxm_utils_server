package repository

/**
 * VehicleTrip 仓储
 * 负责车辆行程数据的持久化访问
 */

import (
	"context"

	"gorm.io/gorm"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/model"
)

type IVehicleTripRepository interface {
	FindByExternalID(ctx context.Context, externalID int64) (*model.VehicleTrip, error)
	Create(ctx context.Context, trip *model.VehicleTrip) error
	Update(ctx context.Context, trip *model.VehicleTrip) error
	FindPaged(ctx context.Context, page, limit int, startTime, endTime *int64) ([]model.VehicleTrip, int64, error)
}

type vehicleTripRepository struct {
	db *gorm.DB
}

func NewVehicleTripRepository(db *gorm.DB) IVehicleTripRepository {
	return &vehicleTripRepository{db: db}
}

func (r *vehicleTripRepository) FindByExternalID(ctx context.Context, externalID int64) (*model.VehicleTrip, error) {
	var trip model.VehicleTrip
	result := r.db.WithContext(ctx).
		Where("externalId = ?", externalID).
		Limit(1).
		Find(&trip)
	if result.Error != nil {
		return nil, result.Error
	}
	if result.RowsAffected == 0 {
		return nil, nil
	}
	return &trip, nil
}

func (r *vehicleTripRepository) Create(ctx context.Context, trip *model.VehicleTrip) error {
	return r.db.WithContext(ctx).Create(trip).Error
}

func (r *vehicleTripRepository) Update(ctx context.Context, trip *model.VehicleTrip) error {
	return r.db.WithContext(ctx).Save(trip).Error
}

func (r *vehicleTripRepository) FindPaged(
	ctx context.Context,
	page, limit int,
	startTime, endTime *int64,
) ([]model.VehicleTrip, int64, error) {
	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}

	var (
		list  []model.VehicleTrip
		total int64
	)

	q := r.db.WithContext(ctx).Model(&model.VehicleTrip{})

	if startTime != nil {
		q = q.Where("startTime >= ?", *startTime)
	}
	if endTime != nil {
		q = q.Where("startTime <= ?", *endTime)
	}

	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := q.Order("startTime DESC").
		Limit(limit).
		Offset((page - 1) * limit).
		Find(&list).Error; err != nil {
		return nil, 0, err
	}

	return list, total, nil
}
