package main

/**
 * 应用入口文件
 * 初始化配置、日志、数据库和 HTTP 服务
 */

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server/config"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server/internal/http/router"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server/pkg/db"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server/pkg/logger"
)

func main() {
	ctx := context.Background()

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("加载配置失败: %v", err)
	}

	if err := logger.Init(cfg); err != nil {
		log.Fatalf("初始化日志失败: %v", err)
	}

	gin.SetMode(gin.ReleaseMode)
	if cfg.Server.Env == "development" {
		gin.SetMode(gin.DebugMode)
	}

	dbConn, err := db.Init(cfg)
	if err != nil {
		logger.Error(ctx, "初始化数据库失败", "error", err)
		os.Exit(1)
	}

	engine := gin.New()
	router.Register(engine, cfg, dbConn)

	srv := &http.Server{
		Addr:           cfg.Server.Addr(),
		Handler:        engine,
		ReadTimeout:    15 * time.Second,
		WriteTimeout:   30 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	go func() {
		logger.Info(ctx, "HTTP 服务启动", "addr", cfg.Server.Addr())
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Error(ctx, "HTTP 服务异常退出", "error", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	shutdownCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		logger.Error(ctx, "HTTP 服务优雅关闭失败", "error", err)
	} else {
		logger.Info(ctx, "HTTP 服务已关闭")
	}
}
