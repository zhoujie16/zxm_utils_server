# 同步车辆行程数据

## 接口信息

- **接口路径**: `POST /api/vehicle-trip/sync`
- **接口描述**: 从外部API获取指定月份的车辆行程数据并保存到本地数据库
- **是否需要认证**: 否

## 请求参数

### 请求体 (Body)

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| month | string | 是 | 时间（格式：YYYY-MM） | 2025-12 |

### 请求示例

```json
{
  "month": "2025-12"
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
  "message": ["时间格式不正确，应为 YYYY-MM"],
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
curl -X POST http://localhost:8010/api/vehicle-trip/sync \
  -H "Content-Type: application/json" \
  -d '{
    "month": "2025-12"
  }'
```

### JavaScript (Fetch)

```javascript
const response = await fetch('http://localhost:8010/api/vehicle-trip/sync', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    month: '2025-12',
  }),
});

const data = await response.json();
console.log(data.message); // 同步完成：成功 25 条，失败 0 条
```

### TypeScript (Axios)

```typescript
import axios from 'axios';

const response = await axios.post('http://localhost:8010/api/vehicle-trip/sync', {
  month: '2025-12',
});

const { success, failed, message } = response.data;
console.log(`同步结果: ${message}`);
```

## 注意事项

1. **时间格式**: 月份参数必须严格按照 `YYYY-MM` 格式，例如 `2025-12` 表示 2025年12月

2. **数据去重**: 系统会根据 `externalId` 自动判断数据是否已存在，如果存在则更新，不存在则创建

3. **批量处理**: 接口会批量处理返回的所有数据，即使部分数据保存失败，也会继续处理其他数据

4. **外部API**: 接口会调用 `https://online.wanchebao.com/v2/driveRecord/section` 获取数据，请确保网络连接正常

5. **数据范围**: 接口会获取指定月份的所有行程数据（从该月1日 00:00:00 到该月最后一天 23:59:59）

6. **数据字段**: 
   - 外部API返回的数据会完整保存，包括原始 `raw` 字段
   - `raw` 字段会被扁平化处理，所有字段都会加上 `raw_` 前缀保存到数据库

