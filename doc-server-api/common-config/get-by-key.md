# 根据配置键获取配置

根据配置键获取对应的配置项。

## 接口信息

- **请求方式**：GET
- **接口地址**：`/api/common-config/key/:configKey`
- **是否需要认证**：是

## 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| configKey | string | 是 | 配置键 |

## 请求示例

```
GET /api/common-config/key/system.max_user_count
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
  "message": "配置项不存在"
}
```

### 配置项不存在时返回 null

```json
null
```

## 代码示例

### cURL

```bash
curl -X GET "http://localhost:7031/api/common-config/key/system.max_user_count" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript (Axios)

```javascript
const axios = require('axios');

const configKey = 'system.max_user_count';
const response = await axios.get(`/api/common-config/key/${configKey}`, {
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
  .url("http://localhost:7031/api/common-config/key/system.max_user_count")
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

config_key = 'system.max_user_count'
response = requests.get(f'http://localhost:7031/api/common-config/key/{config_key}', headers=headers)

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
  "message": "配置项不存在"
}
```

### 500 服务器内部错误

```json
{
  "message": "Internal Server Error"
}
```