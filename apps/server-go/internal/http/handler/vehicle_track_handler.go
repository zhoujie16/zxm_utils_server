package handler

/**
 * 车辆轨迹控制器
 * 处理车辆轨迹相关的 HTTP 请求
 */

import (
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/dto"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/service"
)

type VehicleTrackHandler struct {
	svc service.IVehicleTrackService
}

func NewVehicleTrackHandler(svc service.IVehicleTrackService) *VehicleTrackHandler {
	return &VehicleTrackHandler{svc: svc}
}

func (h *VehicleTrackHandler) Register(rg *gin.RouterGroup) {
	rg.GET("", h.findAll)
	rg.POST("sync", h.sync)
	rg.POST("convert-gcj02", h.convertGcj02)
}

func (h *VehicleTrackHandler) findAll(c *gin.Context) {
	var req dto.QueryTrackRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "请求参数错误"})
		return
	}
	list, pagination, err := h.svc.FindAll(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"data":       list,
		"pagination": pagination,
	})
}

func (h *VehicleTrackHandler) sync(c *gin.Context) {
	var req dto.SyncTrackRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "请求参数错误"})
		return
	}

	// 时间格式与范围校验
	layout := "2006-01-02 15:04:05"
	start, err := time.Parse(layout, req.StartTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "开始时间格式不正确，应为 YYYY-MM-DD HH:mm:ss"})
		return
	}
	end, err := time.Parse(layout, req.EndTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "结束时间格式不正确，应为 YYYY-MM-DD HH:mm:ss"})
		return
	}
	if !end.After(start) {
		c.JSON(http.StatusBadRequest, gin.H{"message": "结束时间必须晚于开始时间"})
		return
	}
	if end.Sub(start) > 7*24*time.Hour {
		c.JSON(http.StatusBadRequest, gin.H{"message": "时间范围不能超过7天"})
		return
	}

	success, failed, err := h.svc.SyncTrackData(c.Request.Context(), req)
	if err != nil {
		var externalErr *service.ExternalAPIError
		if errors.As(err, &externalErr) {
			c.JSON(http.StatusBadGateway, gin.H{"message": externalErr.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": success,
		"failed":  failed,
		"message": "同步完成：成功 " + strconv.Itoa(success) + " 条，失败 " + strconv.Itoa(failed) + " 条",
	})
}

func (h *VehicleTrackHandler) convertGcj02(c *gin.Context) {
	var req dto.ConvertCoordinateRequest
	if err := c.ShouldBindJSON(&req); err != nil && c.Request.Body != nil {
		// 空 body 也允许
	}
	success, failed, err := h.svc.BatchConvertToGcj02(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	if success == 0 && failed == 0 {
		c.JSON(http.StatusOK, gin.H{
			"success": 0,
			"failed":  0,
			"message": "没有需要转换的数据",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": success,
		"failed":  failed,
		"message": "转换完成：成功 " + strconv.Itoa(success) + " 条，失败 " + strconv.Itoa(failed) + " 条",
	})
}
