package handler

/**
 * 认证控制器
 * 处理登录等认证相关的 HTTP 请求
 */

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/dto"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/service"
)

type AuthHandler struct {
	auth service.IAuthService
}

func NewAuthHandler(auth service.IAuthService) *AuthHandler {
	return &AuthHandler{auth: auth}
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "请求参数错误",
		})
		return
	}

	resp, err := h.auth.Login(c.Request.Context(), req)
	if err != nil {
		msg := err.Error()
		status := http.StatusUnauthorized
		if msg == "管理员账号未配置，请设置 ADMIN_USERNAME 和 ADMIN_PASSWORD 环境变量" {
			status = http.StatusInternalServerError
		}
		if msg == "用户名或密码错误" {
			status = http.StatusUnauthorized
		}
		c.JSON(status, gin.H{
			"message": msg,
		})
		return
	}

	c.JSON(http.StatusOK, resp)
}

