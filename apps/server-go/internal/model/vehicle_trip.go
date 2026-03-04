package model

/**
 * VehicleTrip 实体模型
 * 对应数据库中的 vehicle_trip 表
 */

import "time"

type VehicleTrip struct {
	ID        int64  `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	ExternalID int64 `gorm:"column:externalId;type:bigint;index:idx_externalId;not null" json:"externalId"`
	VehicleID  int   `gorm:"column:vehicleId;type:integer;index:idx_vehicleId;not null" json:"vehicleId"`
	ModelID    int   `gorm:"column:modelId;type:integer;not null" json:"modelId"`
	Model      string `gorm:"column:model;type:varchar(200);not null" json:"model"`
	BrandID    int   `gorm:"column:brandId;type:integer;not null" json:"brandId"`
	Brand      string `gorm:"column:brand;type:varchar(100);not null" json:"brand"`
	SeriesID   int   `gorm:"column:seriesId;type:integer;not null" json:"seriesId"`
	Series     string `gorm:"column:series;type:varchar(100);not null" json:"series"`
	DeviceID   string `gorm:"column:deviceId;type:varchar(100);index:idx_deviceId;not null" json:"deviceId"`
	UnitID     int   `gorm:"column:unitId;type:integer;index:idx_unitId;not null" json:"unitId"`
	Consumption int  `gorm:"column:consumption;type:integer;not null" json:"consumption"`
	Mileage     int  `gorm:"column:mileage;type:integer;not null" json:"mileage"`
	Velocity    int  `gorm:"column:velocity;type:integer;not null" json:"velocity"`
	MaxSpeed    int  `gorm:"column:maxSpeed;type:integer;not null" json:"maxSpeed"`
	SharpAcceleration int `gorm:"column:sharpAcceleration;type:integer;not null" json:"sharpAcceleration"`
	SharpDeceleration int `gorm:"column:sharpDeceleration;type:integer;not null" json:"sharpDeceleration"`
	SharpTurn   int  `gorm:"column:sharpTurn;type:integer;not null" json:"sharpTurn"`
	StartTime   int64 `gorm:"column:startTime;type:bigint;index:idx_startTime;not null" json:"startTime"`
	EndTime     int64 `gorm:"column:endTime;type:bigint;not null" json:"endTime"`
	CreatedAt   time.Time `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt   time.Time `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`

	RawStartTime int64 `gorm:"column:raw_start_time;type:bigint;not null" json:"raw_start_time"`
	RawEndTime   int64 `gorm:"column:raw_end_time;type:bigint;not null" json:"raw_end_time"`

	RawAvgOil    int `gorm:"column:raw_te_record_trip_avg_oil;type:integer;not null" json:"raw_te_record_trip_avg_oil"`
	RawAvgRPM    int `gorm:"column:raw_te_record_trip_avg_rpm;type:integer;not null" json:"raw_te_record_trip_avg_rpm"`
	RawAvgSpeed  int `gorm:"column:raw_te_record_trip_avg_speed;type:integer;not null" json:"raw_te_record_trip_avg_speed"`
	RawMaxRPM    int `gorm:"column:raw_te_record_trip_max_rpm;type:integer;not null" json:"raw_te_record_trip_max_rpm"`
	RawMaxSpeed  int `gorm:"column:raw_te_record_trip_max_speed;type:integer;not null" json:"raw_te_record_trip_max_speed"`
	RawMileage   int `gorm:"column:raw_te_record_trip_mileage;type:integer;not null" json:"raw_te_record_trip_mileage"`
	RawNo        int `gorm:"column:raw_te_record_trip_no;type:integer;not null" json:"raw_te_record_trip_no"`
	RawOil       int `gorm:"column:raw_te_record_trip_oil;type:integer;not null" json:"raw_te_record_trip_oil"`
	RawRunTime   int `gorm:"column:raw_te_record_trip_run_time;type:integer;not null" json:"raw_te_record_trip_run_time"`
	RawStartTime2 int64 `gorm:"column:raw_te_record_trip_start_time;type:bigint;not null" json:"raw_te_record_trip_start_time"`
	RawType      int `gorm:"column:raw_te_record_trip_type;type:integer;not null" json:"raw_te_record_trip_type"`
	RawUrgentAcc int `gorm:"column:raw_te_record_trip_urgent_acc_cnt;type:integer;not null" json:"raw_te_record_trip_urgent_acc_cnt"`
	RawUrgentDec int `gorm:"column:raw_te_record_trip_urgent_dec_cnt;type:integer;not null" json:"raw_te_record_trip_urgent_dec_cnt"`
	RawUrgentTurn int `gorm:"column:raw_te_record_trip_urgent_turn_cnt;type:integer;not null" json:"raw_te_record_trip_urgent_turn_cnt"`
}

func (VehicleTrip) TableName() string {
	return "vehicle_trip"
}

