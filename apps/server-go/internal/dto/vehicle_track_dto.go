package dto

/**
 * 车辆轨迹相关 DTO 定义
 */

type QueryTrackRequest struct {
	Page         int   `form:"page"`
	Limit        int   `form:"limit"`
	StartTime    int64 `form:"startTime"`
	EndTime      int64 `form:"endTime"`
	MissingGcj02 bool  `form:"missingGcj02"`
}

type SyncTrackRequest struct {
	StartTime string `json:"startTime" binding:"required"`
	EndTime   string `json:"endTime" binding:"required"`
}

type ConvertCoordinateRequest struct {
	StartTime *int64 `json:"startTime"`
	EndTime   *int64 `json:"endTime"`
}

