package service

/**
 * Demo 服务
 * 封装 demo 模块的业务逻辑
 */

import (
	"context"
	"errors"

	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/model"
	"github.com/zhouxiaomi/zxm_utils_server/apps/server-go/internal/repository"
)

type IDemoService interface {
	Create(ctx context.Context, input DemoCreateInput) (*model.Demo, error)
	FindAll(ctx context.Context) ([]model.Demo, error)
	FindOne(ctx context.Context, id int64) (*model.Demo, error)
	Update(ctx context.Context, id int64, input DemoUpdateInput) (*model.Demo, error)
	Delete(ctx context.Context, id int64) error
}

type demoService struct {
	repo repository.IDemoRepository
}

func NewDemoService(repo repository.IDemoRepository) IDemoService {
	return &demoService{repo: repo}
}

// DemoCreateInput 定义创建 Demo 所需的字段
type DemoCreateInput struct {
	Name        string
	Description *string
}

// DemoUpdateInput 定义更新 Demo 所需的字段（全部可选）
type DemoUpdateInput struct {
	Name        *string
	Description *string
}

func (s *demoService) Create(ctx context.Context, input DemoCreateInput) (*model.Demo, error) {
	d := model.Demo{
		Name:        input.Name,
		Description: input.Description,
	}
	if err := s.repo.Create(ctx, &d); err != nil {
		return nil, err
	}
	return &d, nil
}

func (s *demoService) FindAll(ctx context.Context) ([]model.Demo, error) {
	return s.repo.FindAll(ctx)
}

func (s *demoService) FindOne(ctx context.Context, id int64) (*model.Demo, error) {
	d, err := s.repo.FindOne(ctx, id)
	if err != nil {
		return nil, err
	}
	if d == nil {
		return nil, errors.New("Demo 不存在")
	}
	return d, nil
}

func (s *demoService) Update(ctx context.Context, id int64, input DemoUpdateInput) (*model.Demo, error) {
	d, err := s.FindOne(ctx, id)
	if err != nil {
		return nil, err
	}
	if input.Name != nil {
		d.Name = *input.Name
	}
	if input.Description != nil {
		d.Description = input.Description
	}
	if err := s.repo.Update(ctx, d); err != nil {
		return nil, err
	}
	return d, nil
}

func (s *demoService) Delete(ctx context.Context, id int64) error {
	d, err := s.FindOne(ctx, id)
	if err != nil {
		return err
	}
	return s.repo.Delete(ctx, d)
}

