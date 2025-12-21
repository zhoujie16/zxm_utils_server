# 查询车辆轨迹数据列表

## 接口信息

- **接口路径**: `GET /api/vehicle-track`
- **接口描述**: 获取车辆轨迹数据列表，支持分页和时间范围筛选
- **是否需要认证**: 否

## 请求参数

### 查询参数 (Query)

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| page | number | 否 | 页码，默认为1 | 1 |
| limit | number | 否 | 每页数量，默认为10，最大100 | 10 |
| startTime | number | 否 | 开始时间（时间戳，毫秒），筛选 gpsTime >= startTime 的记录 | 1736822392000 |
| endTime | number | 否 | 结束时间（时间戳，毫秒），筛选 gpsTime <= endTime 的记录 | 1736822394000 |
| missingGcj02 | boolean | 否 | 筛选缺少 GCJ-02 坐标的数据（lat 和 lng 存在，但 lat_gcj02 或 lng_gcj02 为 null） | false |
| missingWgs84 | boolean | 否 | 筛选缺少 WGS84 坐标的数据（lat 和 lng 存在，但 lat_wgs84 或 lng_wgs84 为 null） | false |

### 请求示例

```
# 基本查询（仅分页）
GET /api/vehicle-track?page=1&limit=10

# 带时间范围筛选
GET /api/vehicle-track?page=1&limit=10&startTime=1736822392000&endTime=1736822394000

# 筛选缺少 GCJ-02 坐标的数据
GET /api/vehicle-track?page=1&limit=10&missingGcj02=true

# 筛选缺少 WGS84 坐标的数据
GET /api/vehicle-track?page=1&limit=10&missingWgs84=true
```

## 响应结果

### 成功响应 (200)

```json
{
  "data": [
    {
      "id": 1,
      "imei": "868120325700570",
      "direction": 0,
      "gateTime": 1736822394000,
      "gpsMode": 0,
      "gpsSpeed": 8.0,
      "gpsTime": 1736822392000,
      "lat": 31.194825142366195,
      "lng": 121.54489237789676,
      "lat_gcj02": 31.194825142366195,
      "lng_gcj02": 121.54489237789676,
      "lat_wgs84": 31.194825142366195,
      "lng_wgs84": 121.54489237789676,
      "posMethod": 0,
      "posMulFlag": 0,
      "posType": 1,
      "precision": 0,
      "createdAt": "2025-12-14T07:39:52.000Z",
      "updatedAt": "2025-12-14T07:39:52.000Z"
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
| imei | string | 设备IMEI |
| direction | number | 方向（度） |
| gateTime | number | 门时间（13位时间戳，毫秒） |
| gpsMode | number | GPS模式 |
| gpsSpeed | number | GPS速度（km/h） |
| gpsTime | number | GPS时间（13位时间戳，毫秒） |
| lat | number | BD-09坐标系纬度（百度地图） |
| lng | number | BD-09坐标系经度（百度地图） |
| lat_gcj02 | number \| null | GCJ-02坐标系纬度（高德地图），转换失败时为 null |
| lng_gcj02 | number \| null | GCJ-02坐标系经度（高德地图），转换失败时为 null |
| lat_wgs84 | number \| null | WGS84坐标系纬度（GPS标准），转换失败时为 null |
| lng_wgs84 | number \| null | WGS84坐标系经度（GPS标准），转换失败时为 null |
| posMethod | number | 定位方法 |
| posMulFlag | number | 定位多重标志 |
| posType | number | 定位类型 |
| precision | number | 精度 |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

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
curl -X GET "http://localhost:8010/api/vehicle-track?page=1&limit=10"

# 带时间范围筛选
curl -X GET "http://localhost:8010/api/vehicle-track?page=1&limit=10&startTime=1736822392000&endTime=1736822394000"
```

### JavaScript (Fetch)

```javascript
// 基本查询（仅分页）
const response = await fetch('http://localhost:8010/api/vehicle-track?page=1&limit=10');
const result = await response.json();
console.log(result.data); // 数据列表
console.log(result.pagination); // 分页信息

// 带时间范围筛选
const params = new URLSearchParams({
  page: '1',
  limit: '10',
  startTime: '1736822392000',
  endTime: '1736822394000',
});
const response2 = await fetch(`http://localhost:8010/api/vehicle-track?${params}`);
const result2 = await response2.json();
```

### TypeScript (Axios)

```typescript
import axios from 'axios';

// 基本查询（仅分页）
const response = await axios.get('http://localhost:8010/api/vehicle-track', {
  params: {
    page: 1,
    limit: 10,
  },
});

const { data, pagination } = response.data;
console.log('数据列表:', data);
console.log('分页信息:', pagination);

// 带时间范围筛选
const response2 = await axios.get('http://localhost:8010/api/vehicle-track', {
  params: {
    page: 1,
    limit: 10,
    startTime: 1736822392000,
    endTime: 1736822394000,
  },
});
```

## 注意事项

1. **分页参数**: 
   - `page` 从 1 开始，默认为 1
   - `limit` 最大值为 100，默认为 10

2. **时间范围筛选**: 
   - `startTime` 和 `endTime` 都是可选的，可以单独使用或组合使用
   - `startTime`: 筛选 `gpsTime >= startTime` 的记录（GPS时间大于等于指定时间）
   - `endTime`: 筛选 `gpsTime <= endTime` 的记录（GPS时间小于等于指定时间）
   - 时间格式为时间戳（毫秒，13位）

3. **坐标筛选**: 
   - `missingGcj02`: 当为 `true` 时，筛选缺少 GCJ-02 坐标的数据（lat 和 lng 存在，但 lat_gcj02 或 lng_gcj02 为 null）
   - `missingWgs84`: 当为 `true` 时，筛选缺少 WGS84 坐标的数据（lat 和 lng 存在，但 lat_wgs84 或 lng_wgs84 为 null）
   - 这两个参数可以与其他筛选条件组合使用

3. **排序**: 
   - 默认按 `gpsTime` 倒序排列（最新的在前）

4. **性能优化**: 
   - 查询和计数使用并行执行（Promise.all），提高性能
   - `gpsTime` 字段已添加索引，时间范围查询性能良好

5. **数据格式**: 
   - 时间字段 `gateTime` 和 `gpsTime` 为时间戳（毫秒，13位）
   - 经纬度字段 `lat` 和 `lng` 为浮点数（BD-09坐标系，百度地图）
   - 经纬度字段 `lat_gcj02` 和 `lng_gcj02` 为浮点数（GCJ-02坐标系，高德地图），可能为 null
   - 经纬度字段 `lat_wgs84` 和 `lng_wgs84` 为浮点数（WGS84坐标系，GPS标准），可能为 null
