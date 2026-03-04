package model

/**
 * VehicleTrack 实体模型
 * 对应数据库中的 vehicle_track 表
 */

import "time"

type VehicleTrack struct {
	ID        int64   `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	Imei      string  `gorm:"column:imei;type:varchar(50);index:idx_imei;not null" json:"imei"`
	Direction int     `gorm:"column:direction;type:integer;not null;default:0" json:"direction"`
	GateTime  int64   `gorm:"column:gateTime;type:bigint;index:idx_gateTime;not null" json:"gateTime"`
	GPSMode   int     `gorm:"column:gpsMode;type:integer;not null;default:0" json:"gpsMode"`
	GPSSpeed  float64 `gorm:"column:gpsSpeed;type:real;not null;default:0" json:"gpsSpeed"`
	GPSTime   int64   `gorm:"column:gpsTime;type:bigint;index:idx_gpsTime;not null" json:"gpsTime"`
	Lat       float64 `gorm:"column:lat;type:real;not null" json:"lat"`
	Lng       float64 `gorm:"column:lng;type:real;not null" json:"lng"`
	LatGCJ02  *float64 `gorm:"column:lat_gcj02;type:real" json:"lat_gcj02,omitempty"`
	LngGCJ02  *float64 `gorm:"column:lng_gcj02;type:real" json:"lng_gcj02,omitempty"`
	PosMethod int     `gorm:"column:posMethod;type:integer;not null;default:0" json:"posMethod"`
	PosMulFlag int    `gorm:"column:posMulFlag;type:integer;not null;default:0" json:"posMulFlag"`
	PosType   int     `gorm:"column:posType;type:integer;not null;default:1" json:"posType"`
	Precision int     `gorm:"column:precision;type:integer;not null;default:0" json:"precision"`
	CreatedAt time.Time `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
}

func (VehicleTrack) TableName() string {
	return "vehicle_track"
}

