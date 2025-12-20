# 同步车辆轨迹数据

## 接口信息

- **接口路径**: `POST /api/vehicle-track/sync`
- **接口描述**: 从外部API获取指定时间范围的车辆轨迹数据并保存到本地数据库
- **是否需要认证**: 否

## 请求参数

### 请求体 (Body)

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| startTime | string | 是 | 开始时间（格式：YYYY-MM-DD HH:mm:ss） | 2025-12-14 00:00:00 |
| endTime | string | 是 | 结束时间（格式：YYYY-MM-DD HH:mm:ss），必须晚于开始时间，且时间范围不能超过7天 | 2025-12-14 15:20:59 |

### 请求示例

```json
{
  "startTime": "2025-12-14 00:00:00",
  "endTime": "2025-12-14 15:20:59"
}
```

## 响应结果

### 成功响应 (200)

```json
{
  "success": 25,
  "failed": 0,
  "message": "同步完成：成功 25 条，失败 0 条"
}
```

### 响应字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| success | number | 成功保存的记录数 |
| failed | number | 失败的记录数 |
| message | string | 同步结果消息 |

### 错误响应

**400 - 请求参数错误**

```json
{
  "statusCode": 400,
  "message": ["开始时间格式不正确，应为 YYYY-MM-DD HH:mm:ss"],
  "error": "Bad Request"
}
```

**400 - 时间范围超过限制**

```json
{
  "statusCode": 400,
  "message": ["时间范围不能超过7天"],
  "error": "Bad Request"
}
```

**400 - 结束时间早于开始时间**

```json
{
  "statusCode": 400,
  "message": ["结束时间必须晚于开始时间"],
  "error": "Bad Request"
}
```

**502 - 外部API调用失败**

```json
{
  "statusCode": 502,
  "message": "外部API返回错误: 未知错误",
  "error": "Bad Gateway"
}
```

**500 - 服务器内部错误**

```json
{
  "statusCode": 500,
  "message": "同步数据失败: 网络错误",
  "error": "Internal Server Error"
}
```

## 使用示例

### cURL

```bash
curl -X POST http://localhost:8010/api/vehicle-track/sync \
  -H "Content-Type: application/json" \
  -d '{
    "startTime": "2025-12-14 00:00:00",
    "endTime": "2025-12-14 15:20:59"
  }'
```

### JavaScript (Fetch)

```javascript
const response = await fetch('http://localhost:8010/api/vehicle-track/sync', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    startTime: '2025-12-14 00:00:00',
    endTime: '2025-12-14 15:20:59',
  }),
});

const data = await response.json();
console.log(data.message); // 同步完成：成功 25 条，失败 0 条
```

### TypeScript (Axios)

```typescript
import axios from 'axios';

const response = await axios.post('http://localhost:8010/api/vehicle-track/sync', {
  startTime: '2025-12-14 00:00:00',
  endTime: '2025-12-14 15:20:59',
});

const { success, failed, message } = response.data;
console.log(`同步结果: ${message}`);
```

## 注意事项

1. **时间格式**: 时间参数必须严格按照 `YYYY-MM-DD HH:mm:ss` 格式，例如 `2025-12-14 00:00:00`

2. **时间范围限制**: 开始时间和结束时间之间的时间差不能超过7天（168小时）

3. **时间顺序**: 结束时间必须晚于开始时间

2. **数据去重**: 系统会根据 `imei` 和 `gpsTime` 自动判断数据是否已存在，如果存在则更新，不存在则创建

3. **批量处理**: 接口会批量处理返回的所有数据，即使部分数据保存失败，也会继续处理其他数据

4. **外部API**: 接口会调用 `http://tuqiang123.com/trackreplay/initPiont` 获取数据，请确保网络连接正常

5. **固定参数**: 接口使用固定的参数值：
   - `imei`: 868120325700570
   - `selectMap`: baiduMap
   - `selectType`: gps,lbs,wifi,inertia
   - `filter`: false

6. **数据字段**: 外部API返回的 `data.data` 数组中的每条轨迹点数据会被保存，包括：
   - direction: 方向（度）
   - gate_time: 门时间
   - gpsMode: GPS模式
   - gpsSpeed: GPS速度（km/h）
   - gpsTime: GPS时间
   - lat: BD-09坐标系纬度（百度地图）
   - lng: BD-09坐标系经度（百度地图）
   - lat_gcj02: GCJ-02坐标系纬度（高德地图），通过百度坐标转换API自动转换，转换失败时为 null
   - lng_gcj02: GCJ-02坐标系经度（高德地图），通过百度坐标转换API自动转换，转换失败时为 null
   - posMethod: 定位方法
   - posMulFlag: 定位多重标志
   - posType: 定位类型
   - precision: 精度

7. **坐标转换**: 
   - 系统会自动调用百度地图坐标转换API，将百度坐标系（BD-09）转换为GCJ-02坐标系（高德地图）
   - 转换结果保存在 `lat_gcj02` 和 `lng_gcj02` 字段中
   - 需要在 `common-config` 表中配置 `BaiduMapApiKey` 配置项，否则坐标转换会跳过
   - 如果坐标转换失败，`lat_gcj02` 和 `lng_gcj02` 字段会保存为 `null`，不影响其他数据的保存
