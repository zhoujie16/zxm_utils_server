package handler

/**
 * 公共配置控制器
 * 处理与系统配置相关的 HTTP 请求
 */

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/service"
)

type CommonConfigHandler struct {
	svc service.ICommonConfigService
}

func NewCommonConfigHandler(svc service.ICommonConfigService) *CommonConfigHandler {
	return &CommonConfigHandler{svc: svc}
}

func (h *CommonConfigHandler) Register(rg *gin.RouterGroup) {
	rg.GET("", h.findAll)
	rg.GET("key/:configKey", h.findByKey)
	rg.GET(":id", h.findOne)
	rg.POST("", h.create)
	rg.PATCH(":id", h.update)
	rg.DELETE(":id", h.remove)
}

func (h *CommonConfigHandler) findAll(c *gin.Context) {
	list, err := h.svc.FindAll(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, list)
}

func (h *CommonConfigHandler) findByKey(c *gin.Context) {
	key := c.Param("configKey")
	cfg, err := h.svc.FindByKey(c.Request.Context(), key)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	if cfg == nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "配置项不存在"})
		return
	}
	c.JSON(http.StatusOK, cfg)
}

func (h *CommonConfigHandler) findOne(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "参数错误"})
		return
	}
	cfg, err := h.svc.FindOne(c.Request.Context(), id)
	if err != nil {
		if err.Error() == "配置项不存在" {
			c.JSON(http.StatusNotFound, gin.H{"message": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, cfg)
}

func (h *CommonConfigHandler) create(c *gin.Context) {
	var body struct {
		ConfigKey   string  `json:"configKey"`
		ConfigValue *string `json:"configValue"`
		Description *string `json:"description"`
		SortOrder   *int    `json:"sortOrder"`
		IsEnabled   *bool   `json:"isEnabled"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "请求参数错误"})
		return
	}
	input := service.CommonConfigCreateInput{
		ConfigKey:   body.ConfigKey,
		ConfigValue: body.ConfigValue,
		Description: body.Description,
		SortOrder:   body.SortOrder,
		IsEnabled:   body.IsEnabled,
	}
	created, err := h.svc.Create(c.Request.Context(), input)
	if err != nil {
		if err.Error() == "配置键已存在" {
			c.JSON(http.StatusConflict, gin.H{"message": err.Error()})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, created)
}

func (h *CommonConfigHandler) update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "参数错误"})
		return
	}
	var body struct {
		ConfigKey   *string `json:"configKey"`
		ConfigValue *string `json:"configValue"`
		Description *string `json:"description"`
		SortOrder   *int    `json:"sortOrder"`
		IsEnabled   *bool   `json:"isEnabled"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "请求参数错误"})
		return
	}
	input := service.CommonConfigUpdateInput{
		ConfigKey:   body.ConfigKey,
		ConfigValue: body.ConfigValue,
		Description: body.Description,
		SortOrder:   body.SortOrder,
		IsEnabled:   body.IsEnabled,
	}
	updated, err := h.svc.Update(c.Request.Context(), id, input)
	if err != nil {
		switch err.Error() {
		case "配置项不存在":
			c.JSON(http.StatusNotFound, gin.H{"message": err.Error()})
		case "配置键已存在":
			c.JSON(http.StatusConflict, gin.H{"message": err.Error()})
		default:
			c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, updated)
}

func (h *CommonConfigHandler) remove(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "参数错误"})
		return
	}
	if err := h.svc.Delete(c.Request.Context(), id); err != nil {
		if err.Error() == "配置项不存在" {
			c.JSON(http.StatusNotFound, gin.H{"message": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

