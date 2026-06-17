package dto

/**
 * 车辆行程相关 DTO 定义
 */

type QueryTripRequest struct {
	Page      int   `form:"page"`
	Limit     int   `form:"limit"`
	StartTime int64 `form:"startTime"`
	EndTime   int64 `form:"endTime"`
}

type SyncTripRequest struct {
	Month string `json:"month" binding:"required"`
}
