## 表概览

- **表名**：`common_configs`
- **中文名称**：通用配置表
- **主要用途**：存储系统级别的通用配置项，例如外部接口 Token、第三方服务的 API Key 等，通过键值对的方式统一管理。

## 字段说明

| 字段名        | 类型          | 约束                     | 允许为空 | 默认值 | 说明 |
| ------------- | ------------- | ------------------------ | -------- | ------ | ---- |
| `id`          | INTEGER       | 主键，自增               | 否       | —      | 配置项主键 ID。 |
| `configKey`   | VARCHAR(255)  | 唯一索引                 | 否       | —      | 配置键，唯一标识一个配置项，例如：`TuQiangToken`、`WanCheBaoToken`、`BaiduMapApiKey`。 |
| `configValue` | TEXT          | —                        | 是       | `NULL` | 配置值，一般为字符串（视业务可为 JSON 字符串），具体格式由业务约定。 |
| `description` | VARCHAR(500)  | —                        | 是       | `NULL` | 配置描述，用于说明配置项用途。 |
| `sortOrder`   | INTEGER       | —                        | 否       | `0`    | 排序顺序，值越小越靠前，主要用于管理后台列表展示。 |
| `isEnabled`   | BOOLEAN       | —                        | 否       | `true` | 是否启用该配置项，禁用时相关业务会拒绝使用该配置。 |
| `createdAt`   | DATETIME      | —                        | 否       | 当前时间 | 配置创建时间，由 ORM 自动维护。 |
| `updatedAt`   | DATETIME      | —                        | 否       | 当前时间 | 配置更新时间，由 ORM 自动维护。 |

## 约束与索引

- **主键约束**
  - `PRIMARY KEY (id)`

- **唯一约束**
  - `UNIQUE (configKey)`：同一个配置键只能存在一条记录，用于防止重复配置。

- **常用业务约定的配置键**
  - `TuQiangToken`：途强 API 访问 token，用于车辆轨迹同步。
  - `WanCheBaoToken`：万车宝 API 访问 token，用于车辆行程同步。
  - `BaiduMapApiKey`：百度地图 API Key，用于坐标转换（BD-09 → GCJ-02）。

## 典型使用说明

- **写入来源**
  - 由“通用配置管理”模块通过后台管理界面增删改查，写入或更新本表。
  - 创建和更新配置时会：
    - 检查 `configKey` 是否重复，重复则拒绝并提示“配置键已存在”。
- **读取场景**
  - 各业务模块在调用外部服务前，从本表按 `configKey` 读取配置：
    - 车辆轨迹同步：读取 `TuQiangToken` 生成 Cookie。
    - 行程同步：读取 `WanCheBaoToken` 生成请求 Header。
    - 坐标转换：读取 `BaiduMapApiKey` 访问百度地图转换接口。
  - 读取时通常会校验：
    - 配置是否存在；
    - `isEnabled` 是否为 `true`；
    - `configValue` 是否非空（对于必须值型配置）。

## 示例记录

```json
[
  {
    "id": 1,
    "configKey": "TuQiangToken",
    "configValue": "xxxxxx",
    "description": "途强平台登录后的 SHAREJSESSIONID 值，用于车辆轨迹同步。",
    "sortOrder": 10,
    "isEnabled": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "configKey": "BaiduMapApiKey",
    "configValue": "yyyyyy",
    "description": "百度地图坐标转换 API Key，用于 BD-09 → GCJ-02 批量转换。",
    "sortOrder": 20,
    "isEnabled": true,
    "createdAt": "2024-01-01T00:05:00.000Z",
    "updatedAt": "2024-01-01T00:05:00.000Z"
  }
]
```

