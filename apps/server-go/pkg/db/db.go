package db

/**
 * 数据库模块
 * 初始化 SQLite 连接并返回 gorm.DB 实例
 */

import (
	"os"
	"path/filepath"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/config"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/model"
)

func Init(cfg *config.Config) (*gorm.DB, error) {
	dbPath := cfg.Database.Path
	if !filepath.IsAbs(dbPath) {
		cwd, err := os.Getwd()
		if err != nil {
			return nil, err
		}
		dbPath = filepath.Join(cwd, dbPath)
	}

	if err := os.MkdirAll(filepath.Dir(dbPath), 0o755); err != nil {
		return nil, err
	}

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	if cfg.Database.Synchronize {
		if err := db.AutoMigrate(
			&model.Demo{},
			&model.VehicleTrip{},
			&model.VehicleTrack{},
			&model.CommonConfig{},
		); err != nil {
			return nil, err
		}
	}

	return db, nil
}
