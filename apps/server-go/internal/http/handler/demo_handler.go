package handler

/**
 * Demo 控制器
 * 处理 Demo 相关的 HTTP 请求
 */

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/service"
)

type DemoHandler struct {
	svc service.IDemoService
}

func NewDemoHandler(svc service.IDemoService) *DemoHandler {
	return &DemoHandler{svc: svc}
}

func (h *DemoHandler) Register(rg *gin.RouterGroup) {
	rg.POST("", h.create)
	rg.GET("", h.findAll)
	rg.GET(":id", h.findOne)
	rg.PATCH(":id", h.update)
	rg.DELETE(":id", h.remove)
}

func (h *DemoHandler) create(c *gin.Context) {
	var body struct {
		Name        string  `json:"name"`
		Description *string `json:"description"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "请求参数错误"})
		return
	}
	input := service.DemoCreateInput{
		Name:        body.Name,
		Description: body.Description,
	}
	created, err := h.svc.Create(c.Request.Context(), input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, created)
}

func (h *DemoHandler) findAll(c *gin.Context) {
	list, err := h.svc.FindAll(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, list)
}

func (h *DemoHandler) findOne(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "参数错误"})
		return
	}
	demo, err := h.svc.FindOne(c.Request.Context(), id)
	if err != nil {
		if err.Error() == "Demo 不存在" {
			c.JSON(http.StatusNotFound, gin.H{"message": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, demo)
}

func (h *DemoHandler) update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "参数错误"})
		return
	}
	var body struct {
		Name        *string `json:"name"`
		Description *string `json:"description"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "请求参数错误"})
		return
	}
	input := service.DemoUpdateInput{
		Name:        body.Name,
		Description: body.Description,
	}
	updated, err := h.svc.Update(c.Request.Context(), id, input)
	if err != nil {
		if err.Error() == "Demo 不存在" {
			c.JSON(http.StatusNotFound, gin.H{"message": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updated)
}

func (h *DemoHandler) remove(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "参数错误"})
		return
	}
	if err := h.svc.Delete(c.Request.Context(), id); err != nil {
		if err.Error() == "Demo 不存在" {
			c.JSON(http.StatusNotFound, gin.H{"message": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.Status(http.StatusOK)
}

