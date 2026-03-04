package router_middleware

/**
 * 日志中间件
 * 记录每个 HTTP 请求的关键信息
 */

import (
	"time"

	"github.com/gin-gonic/gin"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/pkg/logger"
)

func Logging() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		method := c.Request.Method
		clientIP := c.ClientIP()

		c.Next()

		latency := time.Since(start)
		status := c.Writer.Status()

		logger.Info(c.Request.Context(), "HTTP 请求",
			"method", method,
			"path", path,
			"status", status,
			"latency_ms", latency.Milliseconds(),
			"client_ip", clientIP,
		)
	}
}

