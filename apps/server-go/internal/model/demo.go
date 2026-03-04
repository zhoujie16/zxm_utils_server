package model

/**
 * Demo 实体模型
 * 对应数据库中的 demo 表
 */

import "time"

type Demo struct {
	ID          int64     `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	Name        string    `gorm:"column:name;type:varchar(100);not null" json:"name"`
	Description *string   `gorm:"column:description;type:text" json:"description,omitempty"`
	CreatedAt   time.Time `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt   time.Time `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
}

func (Demo) TableName() string {
	return "demo"
}

