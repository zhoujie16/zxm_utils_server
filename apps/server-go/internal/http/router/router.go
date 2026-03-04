package router

/**
 * 路由注册模块
 * 基于 Gin 注册全局中间件和业务路由
 */

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/config"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/http/router_middleware"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/http/handler"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/service"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/repository"
)

func Register(engine *gin.Engine, cfg *config.Config, db *gorm.DB) {
	engine.Use(gin.Recovery())
	engine.Use(router_middleware.Logging())
	engine.Use(router_middleware.CORS(cfg))

	api := engine.Group("/" + cfg.Server.APIPrefix)

	api.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	authService := service.NewAuthService(cfg)
	authHandler := handler.NewAuthHandler(authService)
	authGroup := api.Group("/auth")
	authGroup.POST("/login", authHandler.Login)

	commonCfgRepo := repository.NewCommonConfigRepository(db)
	commonCfgSvc := service.NewCommonConfigService(commonCfgRepo)
	commonCfgHandler := handler.NewCommonConfigHandler(commonCfgSvc)

	protected := api.Group("")
	protected.Use(router_middleware.Auth(cfg))

	commonCfgGroup := protected.Group("/common-config")
	commonCfgHandler.Register(commonCfgGroup)

	demoRepo := repository.NewDemoRepository(db)
	demoSvc := service.NewDemoService(demoRepo)
	demoHandler := handler.NewDemoHandler(demoSvc)
	demoGroup := protected.Group("/demo")
	demoHandler.Register(demoGroup)

	trackRepo := repository.NewVehicleTrackRepository(db)
	trackSvc := service.NewVehicleTrackService(trackRepo, commonCfgRepo)
	trackHandler := handler.NewVehicleTrackHandler(trackSvc)
	trackGroup := protected.Group("/vehicle-track")
	trackHandler.Register(trackGroup)

	tripRepo := repository.NewVehicleTripRepository(db)
	tripSvc := service.NewVehicleTripService(tripRepo, commonCfgRepo)
	tripHandler := handler.NewVehicleTripHandler(tripSvc)
	tripGroup := protected.Group("/vehicle-trip")
	tripHandler.Register(tripGroup)
}




