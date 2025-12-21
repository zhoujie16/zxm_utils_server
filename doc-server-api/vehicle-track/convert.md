# 批量转换坐标

## 接口信息

- **接口路径**: `POST /api/vehicle-track/convert-gcj02` 或 `POST /api/vehicle-track/convert-wgs84`
- **接口描述**: 批量转换坐标，支持时间范围筛选
- **是否需要认证**: 否

## 转换 GCJ-02 坐标

### 接口路径
`POST /api/vehicle-track/convert-gcj02`

### 接口描述
批量将 BD-09 坐标转换为 GCJ-02 坐标。会查询所有缺少 GCJ-02 坐标的记录（lat 和 lng 存在，但 lat_gcj02 或 lng_gcj02 为 null），并批量转换。

### 请求参数

#### 请求体 (Body)

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| startTime | number | 否 | 开始时间（时间戳，毫秒），可选，不传则转换所有数据 | 1736822392000 |
| endTime | number | 否 | 结束时间（时间戳，毫秒），可选，不传则转换所有数据 | 1736822394000 |

### 请求示例

```json
{
  "startTime": 1736822392000,
  "endTime": 1736822394000
}
```

或者不传参数（转换所有数据）：

```json
{}
```

### 响应结果

#### 成功响应 (200)

```json
{
  "success": 100,
  "failed": 0,
  "message": "转换完成：成功 100 条，失败 0 条"
}
```

#### 响应字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| success | number | 成功转换的记录数 |
| failed | number | 失败的记录数 |
| message | string | 转换结果消息 |

#### 错误响应

**400 - 请求参数错误**

```json
{
  "statusCode": 400,
  "message": ["开始时间必须是整数"],
  "error": "Bad Request"
}
```

**500 - 服务器内部错误**

```json
{
  "statusCode": 500,
  "message": "批量转换 GCJ-02 坐标失败: 网络错误",
  "error": "Internal Server Error"
}
```

## 转换 WGS84 坐标

### 接口路径
`POST /api/vehicle-track/convert-wgs84`

### 接口描述
批量将 GCJ-02 坐标转换为 WGS84 坐标。会查询所有缺少 WGS84 坐标的记录（lat 和 lng 存在，lat_gcj02 和 lng_gcj02 存在，但 lat_wgs84 或 lng_wgs84 为 null），并批量转换。

### 请求参数

#### 请求体 (Body)

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| startTime | number | 否 | 开始时间（时间戳，毫秒），可选，不传则转换所有数据 | 1736822392000 |
| endTime | number | 否 | 结束时间（时间戳，毫秒），可选，不传则转换所有数据 | 1736822394000 |

### 请求示例

```json
{
  "startTime": 1736822392000,
  "endTime": 1736822394000
}
```

或者不传参数（转换所有数据）：

```json
{}
```

### 响应结果

#### 成功响应 (200)

```json
{
  "success": 100,
  "failed": 0,
  "message": "转换完成：成功 100 条，失败 0 条"
}
```

#### 响应字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| success | number | 成功转换的记录数 |
| failed | number | 失败的记录数 |
| message | string | 转换结果消息 |

#### 错误响应

**400 - 请求参数错误**

```json
{
  "statusCode": 400,
  "message": ["开始时间必须是整数"],
  "error": "Bad Request"
}
```

**500 - 服务器内部错误**

```json
{
  "statusCode": 500,
  "message": "批量转换 WGS84 坐标失败: 网络错误",
  "error": "Internal Server Error"
}
```

## 使用示例

### cURL

```bash
# 转换 GCJ-02 坐标（所有数据）
curl -X POST http://localhost:8010/api/vehicle-track/convert-gcj02 \
  -H "Content-Type: application/json" \
  -d '{}'

# 转换 GCJ-02 坐标（指定时间范围）
curl -X POST http://localhost:8010/api/vehicle-track/convert-gcj02 \
  -H "Content-Type: application/json" \
  -d '{
    "startTime": 1736822392000,
    "endTime": 1736822394000
  }'

# 转换 WGS84 坐标（所有数据）
curl -X POST http://localhost:8010/api/vehicle-track/convert-wgs84 \
  -H "Content-Type: application/json" \
  -d '{}'
```

### JavaScript (Fetch)

```javascript
// 转换 GCJ-02 坐标
const response = await fetch('http://localhost:8010/api/vehicle-track/convert-gcj02', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    startTime: 1736822392000,
    endTime: 1736822394000,
  }),
});

const data = await response.json();
console.log(data.message); // 转换完成：成功 100 条，失败 0 条
```

### TypeScript (Axios)

```typescript
import axios from 'axios';

// 转换 GCJ-02 坐标
const response = await axios.post('http://localhost:8010/api/vehicle-track/convert-gcj02', {
  startTime: 1736822392000,
  endTime: 1736822394000,
});

const { success, failed, message } = response.data;
console.log(`转换结果: ${message}`);

// 转换 WGS84 坐标
const response2 = await axios.post('http://localhost:8010/api/vehicle-track/convert-wgs84', {});
const { success: success2, failed: failed2, message: message2 } = response2.data;
console.log(`转换结果: ${message2}`);
```

## 注意事项

1. **转换范围**: 
   - 不传时间参数时，会转换所有缺少对应坐标的数据
   - 传入时间参数时，只转换指定时间范围内的数据

2. **GCJ-02 转换**: 
   - 只转换缺少 GCJ-02 坐标的记录（lat 和 lng 存在，但 lat_gcj02 或 lng_gcj02 为 null）
   - 需要配置 `BaiduMapApiKey`，否则转换会失败

3. **WGS84 转换**: 
   - 只转换缺少 WGS84 坐标的记录（lat 和 lng 存在，lat_gcj02 和 lng_gcj02 存在，但 lat_wgs84 或 lng_wgs84 为 null）
   - 需要先有 GCJ-02 坐标才能转换
   - 需要配置 `BaiduMapApiKey`，否则转换会失败

4. **批量处理**: 
   - 系统会分批处理数据（每批 100 条），避免一次性处理过多
   - 即使部分数据转换失败，也会继续处理其他数据

5. **性能考虑**: 
   - 大量数据转换可能需要较长时间，建议使用时间范围筛选
   - 转换过程中会调用外部 API，请注意 API 调用频率限制

