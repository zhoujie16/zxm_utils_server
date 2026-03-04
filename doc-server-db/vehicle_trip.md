## 表概览

- **表名**：`vehicle_trip`
- **中文名称**：车辆行程表
- **主要用途**：存储从万车宝平台同步的车辆行程汇总数据，包括里程、油耗、平均/最大速度及一系列原始统计指标，用于行程列表展示和后续统计分析。

## 字段说明

| 字段名                                  | 类型          | 约束                        | 允许为空 | 默认值 | 说明 |
| --------------------------------------- | ------------- | --------------------------- | -------- | ------ | ---- |
| `id`                                    | INTEGER       | 主键，自增                  | 否       | —      | 行程记录主键 ID。 |
| `externalId`                            | BIGINT        | 索引 `idx_externalId`       | 否       | —      | 外部系统行程 ID，来自万车宝，用于去重与更新。 |
| `vehicleId`                             | INTEGER       | 索引 `idx_vehicleId`        | 否       | —      | 车辆 ID，对应万车宝中的车辆标识。 |
| `modelId`                               | INTEGER       | —                           | 否       | —      | 车型 ID。 |
| `model`                                 | VARCHAR(200)  | —                           | 否       | —      | 车型名称，例如“2013款 1.6L 自动舒适版”。 |
| `brandId`                               | INTEGER       | —                           | 否       | —      | 品牌 ID。 |
| `brand`                                 | VARCHAR(100)  | —                           | 否       | —      | 品牌名称，例如“大众”。 |
| `seriesId`                              | INTEGER       | —                           | 否       | —      | 系列 ID。 |
| `series`                                | VARCHAR(100)  | —                           | 否       | —      | 车系名称，例如“Polo”。 |
| `deviceId`                              | VARCHAR(100)  | 索引 `idx_deviceId`         | 否       | —      | 设备 ID，例如 `AD20-N0UE4310122`。 |
| `unitId`                                | INTEGER       | 索引 `idx_unitId`           | 否       | —      | 单位 ID，用于组织管理。 |
| `consumption`                           | INTEGER       | —                           | 否       | `0`    | 油耗，单位毫升（已四舍五入）。 |
| `mileage`                               | INTEGER       | —                           | 否       | `0`    | 里程，单位米（已四舍五入）。 |
| `velocity`                              | INTEGER       | —                           | 否       | `0`    | 平均速度，单位 km/h（已四舍五入）。 |
| `maxSpeed`                              | INTEGER       | —                           | 否       | `0`    | 最大速度，单位 km/h（已四舍五入）。 |
| `sharpAcceleration`                     | INTEGER       | —                           | 否       | `0`    | 急加速次数。 |
| `sharpDeceleration`                     | INTEGER       | —                           | 否       | `0`    | 急减速次数。 |
| `sharpTurn`                             | INTEGER       | —                           | 否       | `0`    | 急转弯次数。 |
| `startTime`                             | BIGINT        | 索引 `idx_startTime`        | 否       | —      | 行程开始时间，13 位毫秒时间戳。 |
| `endTime`                               | BIGINT        | —                           | 否       | —      | 行程结束时间，13 位毫秒时间戳。 |
| `createdAt`                             | DATETIME      | —                           | 否       | 当前时间 | 记录创建时间，由 ORM 自动维护。 |
| `updatedAt`                             | DATETIME      | —                           | 否       | 当前时间 | 记录最近更新时间，由 ORM 自动维护。 |
| `raw_start_time`                        | BIGINT        | —                           | 否       | `0`    | 原始开始时间（毫秒），来自原始 `raw` 数据。 |
| `raw_end_time`                          | BIGINT        | —                           | 否       | `0`    | 原始结束时间（毫秒），来自原始 `raw` 数据。 |
| `raw_te_record_trip_avg_oil`           | INTEGER       | —                           | 否       | `0`    | 原始平均油耗（毫升/公里）。 |
| `raw_te_record_trip_avg_rpm`           | INTEGER       | —                           | 否       | `0`    | 原始平均转速（rpm）。 |
| `raw_te_record_trip_avg_speed`         | INTEGER       | —                           | 否       | `0`    | 原始平均速度（km/h）。 |
| `raw_te_record_trip_max_rpm`           | INTEGER       | —                           | 否       | `0`    | 原始最大转速（rpm）。 |
| `raw_te_record_trip_max_speed`         | INTEGER       | —                           | 否       | `0`    | 原始最大速度（km/h）。 |
| `raw_te_record_trip_mileage`           | INTEGER       | —                           | 否       | `0`    | 原始里程（米）。 |
| `raw_te_record_trip_no`                | INTEGER       | —                           | 否       | `0`    | 原始记录编号或单位编号。 |
| `raw_te_record_trip_oil`               | INTEGER       | —                           | 否       | `0`    | 原始油耗（毫升）。 |
| `raw_te_record_trip_run_time`          | INTEGER       | —                           | 否       | `0`    | 原始运行时间（秒）。 |
| `raw_te_record_trip_start_time`        | BIGINT        | —                           | 否       | `0`    | 原始开始时间戳（毫秒）。 |
| `raw_te_record_trip_type`              | INTEGER       | —                           | 否       | `0`    | 原始行程类型。 |
| `raw_te_record_trip_urgent_acc_cnt`    | INTEGER       | —                           | 否       | `0`    | 原始急加速次数。 |
| `raw_te_record_trip_urgent_dec_cnt`    | INTEGER       | —                           | 否       | `0`    | 原始急减速次数。 |
| `raw_te_record_trip_urgent_turn_cnt`   | INTEGER       | —                           | 否       | `0`    | 原始急转弯次数。 |

## 约束与索引

- **主键约束**
  - `PRIMARY KEY (id)`

- **唯一性/去重逻辑**
  - 代码逻辑上使用 `externalId` 作为唯一键：  
    - 当同步到新的行程数据时，如果 `externalId` 已存在，则更新原有记录；否则插入新记录。

- **索引**
  - `INDEX idx_externalId (externalId)`：按外部 ID 查找与去重时使用。
  - `INDEX idx_vehicleId (vehicleId)`：按车辆维度查询行程数据时使用。
  - `INDEX idx_deviceId (deviceId)`：按设备维度查询时使用。
  - `INDEX idx_unitId (unitId)`：按单位维度做统计或筛选时使用。
  - `INDEX idx_startTime (startTime)`：按开始时间范围查询、排序时使用，是行程列表查询的主要时间字段。

## 典型使用说明

- **写入来源**
  - 由车辆行程模块的同步任务从万车宝 API 按月拉取行程数据（按 `month=YYYY-MM`），并写入或更新本表。
  - 同步时会基于 `externalId` 判断记录是否已存在：存在则覆盖更新，不存在则新增。
- **读取场景**
  - 行程列表页面：支持按时间范围分页查询，主要使用 `startTime` 字段。
  - 后续统计/报表：基于里程、油耗、平均/最大速度以及若干 `raw_` 字段，进行更细粒度的统计分析。

## 示例记录

```json
{
  "id": 559,
  "externalId": 1999486241237065700,
  "vehicleId": 2032011,
  "modelId": 14493,
  "model": "2013款 1.6L 自动舒适版",
  "brandId": 1,
  "brand": "大众",
  "seriesId": 145,
  "series": "Polo",
  "deviceId": "AD20-N0UE4310122",
  "unitId": 806,
  "consumption": 2585,
  "mileage": 42313,
  "velocity": 47,
  "maxSpeed": 104,
  "sharpAcceleration": 0,
  "sharpDeceleration": 0,
  "sharpTurn": 0,
  "startTime": 1765546341000,
  "endTime": 1765549540000,
  "raw_start_time": 1765546341000,
  "raw_end_time": 1765549540000,
  "raw_te_record_trip_avg_oil": 61,
  "raw_te_record_trip_avg_rpm": 1473,
  "raw_te_record_trip_avg_speed": 47,
  "raw_te_record_trip_max_rpm": 2783,
  "raw_te_record_trip_max_speed": 104,
  "raw_te_record_trip_mileage": 42313,
  "raw_te_record_trip_no": 806,
  "raw_te_record_trip_oil": 2585,
  "raw_te_record_trip_run_time": 3199,
  "raw_te_record_trip_start_time": 1765546341000,
  "raw_te_record_trip_type": 0,
  "raw_te_record_trip_urgent_acc_cnt": 0,
  "raw_te_record_trip_urgent_dec_cnt": 0,
  "raw_te_record_trip_urgent_turn_cnt": 0,
  "createdAt": "2025-12-13T01:42:59.000Z",
  "updatedAt": "2025-12-13T01:42:59.000Z"
}
```

