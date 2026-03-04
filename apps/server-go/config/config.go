package config

/**
 * 应用配置模块
 * 使用 Viper 从 YAML 和环境变量加载配置
 */

import (
	"fmt"
	"time"

	"github.com/spf13/viper"
)

type ServerConfig struct {
	Port       int    `mapstructure:"port"`
	APIPrefix  string `mapstructure:"apiPrefix"`
	CORSOrigin string `mapstructure:"corsOrigin"`
	Env        string `mapstructure:"env"`
}

func (s ServerConfig) Addr() string {
	return fmt.Sprintf(":%d", s.Port)
}

type JWTConfig struct {
	Secret    string        `mapstructure:"secret"`
	ExpiresIn time.Duration `mapstructure:"-"`
	RawTTL    string        `mapstructure:"expiresIn"`
}

type AdminConfig struct {
	Username string `mapstructure:"username"`
	Password string `mapstructure:"password"`
}

type DatabaseConfig struct {
	Path        string `mapstructure:"path"`
	Synchronize bool   `mapstructure:"synchronize"`
	Logging     bool   `mapstructure:"logging"`
}

type Config struct {
	Server   ServerConfig   `mapstructure:"server"`
	JWT      JWTConfig      `mapstructure:"jwt"`
	Admin    AdminConfig    `mapstructure:"admin"`
	Database DatabaseConfig `mapstructure:"database"`
}

func Load() (*Config, error) {
	v := viper.New()
	v.SetConfigName("config")
	v.SetConfigType("yaml")
	v.AddConfigPath("./config")
	v.AddConfigPath(".")

	v.SetDefault("server.port", 8010)
	v.SetDefault("server.apiPrefix", "api")
	v.SetDefault("server.corsOrigin", "*")
	v.SetDefault("server.env", "development")
	v.SetDefault("jwt.secret", "your_jwt_secret_key_here_change_in_production")
	v.SetDefault("jwt.expiresIn", "168h")
	v.SetDefault("database.path", "data/app.db")
	v.SetDefault("database.synchronize", true)
	v.SetDefault("database.logging", true)

	_ = v.BindEnv("server.port", "PORT")
	_ = v.BindEnv("server.apiPrefix", "API_PREFIX")
	_ = v.BindEnv("server.corsOrigin", "CORS_ORIGIN")
	_ = v.BindEnv("server.env", "NODE_ENV")
	_ = v.BindEnv("jwt.secret", "JWT_SECRET")
	_ = v.BindEnv("jwt.expiresIn", "JWT_EXPIRES_IN")
	_ = v.BindEnv("admin.username", "ADMIN_USERNAME")
	_ = v.BindEnv("admin.password", "ADMIN_PASSWORD")
	_ = v.BindEnv("database.path", "SQLITE_DATABASE")
	_ = v.BindEnv("database.synchronize", "SQLITE_SYNCHRONIZE")
	_ = v.BindEnv("database.logging", "SQLITE_LOGGING")

	if err := v.ReadInConfig(); err != nil {
		var cfg Config
		if err := v.Unmarshal(&cfg); err != nil {
			return nil, err
		}
		if err := postProcess(&cfg); err != nil {
			return nil, err
		}
		return &cfg, nil
	}

	var cfg Config
	if err := v.Unmarshal(&cfg); err != nil {
		return nil, err
	}

	if err := postProcess(&cfg); err != nil {
		return nil, err
	}

	return &cfg, nil
}

func postProcess(cfg *Config) error {
	if cfg.Server.Env == "" {
		cfg.Server.Env = "development"
	}
	if cfg.JWT.RawTTL == "" {
		cfg.JWT.RawTTL = "168h"
	}
	d, err := time.ParseDuration(cfg.JWT.RawTTL)
	if err != nil {
		return fmt.Errorf("解析 jwt.expiresIn 失败: %w", err)
	}
	cfg.JWT.ExpiresIn = d
	return nil
}

