package dto

/**
 * 认证与登录相关 DTO 定义
 */

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginUser struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Access   string `json:"access"`
}

type LoginResponse struct {
	AccessToken string     `json:"access_token"`
	User        LoginUser  `json:"user"`
}

