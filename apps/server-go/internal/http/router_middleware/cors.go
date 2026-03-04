package router_middleware

/**
 * CORS 中间件
 * 根据配置允许跨域请求
 */

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/config"
)

func CORS(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := cfg.Server.CORSOrigin
		c.Header("Access-Control-Allow-Origin", origin)
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Authorization,Content-Type,X-Requested-With")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

