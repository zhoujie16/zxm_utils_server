package logger

/**
 * 日志模块
 * 使用 slog 提供结构化日志能力
 */

import (
	"context"
	"log/slog"
	"os"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/config"
)

var defaultLogger *slog.Logger

func Init(cfg *config.Config) error {
	var handler slog.Handler

	if cfg.Server.Env == "development" {
		handler = slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
			Level: slog.LevelDebug,
		})
	} else {
		handler = slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
			Level: slog.LevelInfo,
		})
	}

	defaultLogger = slog.New(handler)
	slog.SetDefault(defaultLogger)
	return nil
}

func Logger() *slog.Logger {
	if defaultLogger == nil {
		defaultLogger = slog.New(slog.NewTextHandler(os.Stdout, nil))
	}
	return defaultLogger
}

func Info(ctx context.Context, msg string, args ...any) {
	Logger().InfoContext(ctx, msg, args...)
}

func Error(ctx context.Context, msg string, args ...any) {
	Logger().ErrorContext(ctx, msg, args...)
}

