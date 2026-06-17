package handler

/**
 * 车辆行程控制器
 * 处理车辆行程相关的 HTTP 请求
 */

import (
	"errors"
	"net/http"
	"regexp"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server/internal/dto"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server/internal/service"
)

type VehicleTripHandler struct {
	svc service.IVehicleTripService
}

func NewVehicleTripHandler(svc service.IVehicleTripService) *VehicleTripHandler {
	return &VehicleTripHandler{svc: svc}
}

func (h *VehicleTripHandler) Register(rg *gin.RouterGroup) {
	rg.GET("", h.findAll)
	rg.POST("sync", h.sync)
}

func (h *VehicleTripHandler) findAll(c *gin.Context) {
	var req dto.QueryTripRequest
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

func (h *VehicleTripHandler) sync(c *gin.Context) {
	var req dto.SyncTripRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "请求参数错误"})
		return
	}

	// 校验月份格式 YYYY-MM，与原 DTO 规则对齐
	if req.Month == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "时间不能为空"})
		return
	}
	if ok, _ := regexp.MatchString(`^\d{4}-\d{2}$`, req.Month); !ok {
		c.JSON(http.StatusBadRequest, gin.H{"message": "时间格式不正确，应为 YYYY-MM"})
		return
	}

	success, failed, err := h.svc.SyncTripData(c.Request.Context(), req)
	if err != nil {
		// 区分参数错误与外部 API 错误
		if err.Error() == "时间不能为空" {
			c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
			return
		}
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
