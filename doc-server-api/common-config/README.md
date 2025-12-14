# 公共配置 API 文档

公共配置管理模块用于管理系统级别的配置信息，支持增删改查、排序和状态管理等功能。

## 接口列表

| 接口名称 | 请求方式 | 接口地址 | 说明 |
|---------|---------|---------|------|
| 获取所有配置 | GET | /api/common-config | 获取系统中所有配置项 |
| 根据ID获取配置 | GET | /api/common-config/:id | 根据ID获取单个配置项 |
| 根据配置键获取配置 | GET | /api/common-config/key/:configKey | 根据配置键获取配置项 |
| 创建新配置 | POST | /api/common-config | 创建一个新的配置项 |
| 更新配置 | PATCH | /api/common-config/:id | 更新指定ID的配置项 |
| 删除配置 | DELETE | /api/common-config/:id | 删除指定ID的配置项 |

## 数据模型

### CommonConfig 公共配置

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| id | number | 配置ID | 1 |
| configKey | string | 配置键（唯一标识） | "system.max_user_count" |
| configValue | string | 配置值（JSON字符串） | '{"count": 100}' |
| description | string | 配置描述 | "系统最大用户数限制" |
| sortOrder | number | 排序顺序 | 0 |
| isEnabled | boolean | 是否启用 | true |
| createdAt | string | 创建时间 | "2024-01-01T00:00:00.000Z" |
| updatedAt | string | 更新时间 | "2024-01-01T00:00:00.000Z" |

## 配置键命名规范

配置键应遵循以下规范：
- 使用小写字母、数字、点(.)、下划线(_)和短横线(-)
- 使用点(.)分隔层级关系
- 采用有意义的命名方式

示例：
- `system.max_user_count`
- `email.smtp_host`
- `api.rate_limit`
- `app.version`