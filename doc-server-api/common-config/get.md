# 根据ID获取配置

根据指定的ID获取单个配置项详情。

## 接口信息

- **请求方式**：GET
- **接口地址**：`/api/common-config/:id`
- **是否需要认证**：是

## 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 配置项ID |

## 请求示例

```
GET /api/common-config/1
```

## 响应数据

### 成功响应 (200)

```json
{
  "id": 1,
  "configKey": "system.max_user_count",
  "configValue": "{\"count\": 100}",
  "description": "系统最大用户数限制",
  "sortOrder": 0,
  "isEnabled": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 配置项不存在 (404)

```json
{
  "message": "配置项 ID 1 不存在"
}
```

## 代码示例

### cURL

```bash
curl -X GET "http://localhost:7031/api/common-config/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript (Axios)

```javascript
const axios = require('axios');

const configId = 1;
const response = await axios.get(`/api/common-config/${configId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

console.log(response.data);
```

### Java (OkHttp)

```java
OkHttpClient client = new OkHttpClient();

Request request = new Request.Builder()
  .url("http://localhost:7031/api/common-config/1")
  .get()
  .addHeader("Authorization", "Bearer YOUR_JWT_TOKEN")
  .build();

Response response = client.newCall(request).execute();
```

### Python (Requests)

```python
import requests

headers = {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}

config_id = 1
response = requests.get(f'http://localhost:7031/api/common-config/{config_id}', headers=headers)

print(response.json())
```

## 错误响应

### 401 未授权

```json
{
  "message": "Unauthorized"
}
```

### 404 配置项不存在

```json
{
  "message": "配置项 ID 1 不存在"
}
```

### 500 服务器内部错误

```json
{
  "message": "Internal Server Error"
}
```