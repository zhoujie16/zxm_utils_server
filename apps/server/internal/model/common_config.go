package model

/**
 * CommonConfig 实体模型
 * 对应数据库中的 common_configs 表
 */

import "time"

type CommonConfig struct {
	ID          int64     `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	ConfigKey   string    `gorm:"column:configKey;type:varchar(255);uniqueIndex;not null" json:"configKey"`
	ConfigValue *string   `gorm:"column:configValue;type:text" json:"configValue,omitempty"`
	ConfigExtra *string   `gorm:"column:configExtra;type:text" json:"configExtra,omitempty"`
	Description *string   `gorm:"column:description;type:varchar(500)" json:"description,omitempty"`
	SortOrder   int       `gorm:"column:sortOrder;type:integer;not null;default:0" json:"sortOrder"`
	IsEnabled   bool      `gorm:"column:isEnabled;type:boolean;not null;default:true" json:"isEnabled"`
	CreatedAt   time.Time `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt   time.Time `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
}

func (CommonConfig) TableName() string {
	return "common_configs"
}
