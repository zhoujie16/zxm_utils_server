package repository

/**
 * VehicleTrack 仓储
 * 负责车辆轨迹数据的持久化访问
 */

import (
	"context"

	"gorm.io/gorm"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/model"
)

type IVehicleTrackRepository interface {
	FindByImeiAndGPSTime(ctx context.Context, imei string, gpsTime int64) (*model.VehicleTrack, error)
	Create(ctx context.Context, track *model.VehicleTrack) error
	Update(ctx context.Context, track *model.VehicleTrack) error
	FindPaged(ctx context.Context, page, limit int, startTime, endTime *int64, missingGcj02 bool) ([]model.VehicleTrack, int64, error)
	FindMissingGcj02(ctx context.Context, startTime, endTime *int64) ([]model.VehicleTrack, error)
}

type vehicleTrackRepository struct {
	db *gorm.DB
}

func NewVehicleTrackRepository(db *gorm.DB) IVehicleTrackRepository {
	return &vehicleTrackRepository{db: db}
}

func (r *vehicleTrackRepository) FindByImeiAndGPSTime(ctx context.Context, imei string, gpsTime int64) (*model.VehicleTrack, error) {
	var track model.VehicleTrack
	result := r.db.WithContext(ctx).
		Where("imei = ? AND gpsTime = ?", imei, gpsTime).
		Limit(1).
		Find(&track)
	if result.Error != nil {
		return nil, result.Error
	}
	if result.RowsAffected == 0 {
		return nil, nil
	}
	return &track, nil
}

func (r *vehicleTrackRepository) Create(ctx context.Context, track *model.VehicleTrack) error {
	return r.db.WithContext(ctx).Create(track).Error
}

func (r *vehicleTrackRepository) Update(ctx context.Context, track *model.VehicleTrack) error {
	return r.db.WithContext(ctx).Save(track).Error
}

func (r *vehicleTrackRepository) FindPaged(
	ctx context.Context,
	page, limit int,
	startTime, endTime *int64,
	missingGcj02 bool,
) ([]model.VehicleTrack, int64, error) {
	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}

	var (
		list  []model.VehicleTrack
		total int64
	)

	q := r.db.WithContext(ctx).Model(&model.VehicleTrack{})

	if startTime != nil {
		q = q.Where("gpsTime >= ?", *startTime)
	}
	if endTime != nil {
		q = q.Where("gpsTime <= ?", *endTime)
	}
	if missingGcj02 {
		q = q.Where("(lat_gcj02 IS NULL OR lng_gcj02 IS NULL)")
	}

	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := q.Order("gpsTime DESC").
		Limit(limit).
		Offset((page - 1) * limit).
		Find(&list).Error; err != nil {
		return nil, 0, err
	}

	return list, total, nil
}

func (r *vehicleTrackRepository) FindMissingGcj02(
	ctx context.Context,
	startTime, endTime *int64,
) ([]model.VehicleTrack, error) {
	var list []model.VehicleTrack
	q := r.db.WithContext(ctx).Model(&model.VehicleTrack{}).
		Where("lat IS NOT NULL").
		Where("lng IS NOT NULL").
		Where("(lat_gcj02 IS NULL OR lng_gcj02 IS NULL)")

	if startTime != nil {
		q = q.Where("gpsTime >= ?", *startTime)
	}
	if endTime != nil {
		q = q.Where("gpsTime <= ?", *endTime)
	}

	if err := q.Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}
