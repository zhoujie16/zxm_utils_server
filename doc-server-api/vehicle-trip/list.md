# 查询车辆行程数据列表

## 接口信息

- **接口路径**: `GET /api/vehicle-trip`
- **接口描述**: 获取车辆行程数据列表，支持分页和时间范围筛选
- **是否需要认证**: 否

## 请求参数

### 查询参数 (Query)

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| page | number | 否 | 页码，默认为1 | 1 |
| limit | number | 否 | 每页数量，默认为10，最大100 | 10 |
| startTime | number | 否 | 开始时间（时间戳，毫秒），筛选 startTime >= startTime 的记录 | 1764547200000 |
| endTime | number | 否 | 结束时间（时间戳，毫秒），筛选 startTime <= endTime 的记录 | 1767139199000 |

### 请求示例

```
# 基本查询（仅分页）
GET /api/vehicle-trip?page=1&limit=10

# 带时间范围筛选
GET /api/vehicle-trip?page=1&limit=10&startTime=1764547200000&endTime=1767139199000
```

## 响应结果

### 成功响应 (200)

```json
{
  "data": [
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
      "createdAt": "2025-12-13T01:42:59.000Z",
      "updatedAt": "2025-12-13T01:42:59.000Z",
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
      "raw_te_record_trip_urgent_turn_cnt": 0
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 响应字段说明

#### data 数组字段

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | 主键ID |
| externalId | number | 外部系统ID |
| vehicleId | number | 车辆ID |
| modelId | number | 车型ID |
| model | string | 车型名称 |
| brandId | number | 品牌ID |
| brand | string | 品牌名称 |
| seriesId | number | 系列ID |
| series | string | 系列名称 |
| deviceId | string | 设备ID |
| unitId | number | 单位ID |
| consumption | number | 油耗（毫升） |
| mileage | number | 里程（米） |
| velocity | number | 平均速度（km/h） |
| maxSpeed | number | 最大速度（km/h） |
| sharpAcceleration | number | 急加速次数 |
| sharpDeceleration | number | 急减速次数 |
| sharpTurn | number | 急转弯次数 |
| startTime | number | 开始时间（时间戳，毫秒） |
| endTime | number | 结束时间（时间戳，毫秒） |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |
| raw_* | number | 原始数据字段（带raw_前缀） |

#### pagination 对象字段

| 字段名 | 类型 | 说明 |
|--------|------|------|
| page | number | 当前页码 |
| limit | number | 每页数量 |
| total | number | 总记录数 |
| totalPages | number | 总页数 |

### 错误响应

**400 - 请求参数错误**

```json
{
  "statusCode": 400,
  "message": ["页码必须是整数", "每页数量不能超过100"],
  "error": "Bad Request"
}
```

## 使用示例

### cURL

```bash
# 基本查询（仅分页）
curl -X GET "http://localhost:8010/api/vehicle-trip?page=1&limit=10"

# 带时间范围筛选
curl -X GET "http://localhost:8010/api/vehicle-trip?page=1&limit=10&startTime=1764547200000&endTime=1767139199000"
```

### JavaScript (Fetch)

```javascript
// 基本查询（仅分页）
const response = await fetch('http://localhost:8010/api/vehicle-trip?page=1&limit=10');
const result = await response.json();
console.log(result.data); // 数据列表
console.log(result.pagination); // 分页信息

// 带时间范围筛选
const params = new URLSearchParams({
  page: '1',
  limit: '10',
  startTime: '1764547200000',
  endTime: '1767139199000',
});
const response2 = await fetch(`http://localhost:8010/api/vehicle-trip?${params}`);
const result2 = await response2.json();
```

### TypeScript (Axios)

```typescript
import axios from 'axios';

// 基本查询（仅分页）
const response = await axios.get('http://localhost:8010/api/vehicle-trip', {
  params: {
    page: 1,
    limit: 10,
  },
});

const { data, pagination } = response.data;
console.log('数据列表:', data);
console.log('分页信息:', pagination);

// 带时间范围筛选
const response2 = await axios.get('http://localhost:8010/api/vehicle-trip', {
  params: {
    page: 1,
    limit: 10,
    startTime: 1764547200000,
    endTime: 1767139199000,
  },
});
```

## 注意事项

1. **分页参数**: 
   - `page` 从 1 开始，默认为 1
   - `limit` 最大值为 100，默认为 10

2. **时间范围筛选**: 
   - `startTime` 和 `endTime` 都是可选的，可以单独使用或组合使用
   - `startTime`: 筛选 `startTime >= startTime` 的记录（行程开始时间大于等于指定时间）
   - `endTime`: 筛选 `startTime <= endTime` 的记录（行程开始时间小于等于指定时间）
   - 时间格式为时间戳（毫秒）

3. **排序**: 
   - 默认按 `startTime` 倒序排列（最新的在前）

4. **性能优化**: 
   - 查询和计数使用并行执行（Promise.all），提高性能
   - `startTime` 字段已添加索引，时间范围查询性能良好

5. **数据格式**: 
   - 时间字段 `startTime` 和 `endTime` 为时间戳（毫秒）
   - 所有原始数据字段都带有 `raw_` 前缀

