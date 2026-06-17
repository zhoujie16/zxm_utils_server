package service

/**
 * 认证服务
 * 提供登录和 JWT 生成能力
 */

import (
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server/config"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server/internal/dto"
)

type IAuthService interface {
	Login(ctx context.Context, req dto.LoginRequest) (*dto.LoginResponse, error)
}

type authService struct {
	cfg *config.Config
}

func NewAuthService(cfg *config.Config) IAuthService {
	return &authService{cfg: cfg}
}

func (s *authService) Login(ctx context.Context, req dto.LoginRequest) (*dto.LoginResponse, error) {
	if s.cfg.Admin.Username == "" || s.cfg.Admin.Password == "" {
		return nil, errors.New("管理员账号未配置，请设置 ADMIN_USERNAME 和 ADMIN_PASSWORD 环境变量")
	}

	if req.Username != s.cfg.Admin.Username || req.Password != s.cfg.Admin.Password {
		return nil, errors.New("用户名或密码错误")
	}

	user := dto.LoginUser{
		ID:       "1",
		Username: s.cfg.Admin.Username,
		Email:    "admin@example.com",
		Access:   "admin",
	}

	claims := jwt.MapClaims{
		"sub":      user.ID,
		"username": user.Username,
		"access":   user.Access,
		"exp":      time.Now().Add(s.cfg.JWT.ExpiresIn).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(s.cfg.JWT.Secret))
	if err != nil {
		return nil, err
	}

	return &dto.LoginResponse{
		AccessToken: signed,
		User:        user,
	}, nil
}
