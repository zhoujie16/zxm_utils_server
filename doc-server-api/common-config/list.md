# 获取所有配置

获取系统中所有配置项列表，按排序顺序排序。

## 接口信息

- **请求方式**：GET
- **接口地址**：`/api/common-config`
- **是否需要认证**：是

## 请求参数

无

## 响应数据

### 成功响应 (200)

```json
[
  {
    "id": 1,
    "configKey": "system.max_user_count",
    "configValue": "{\"count\": 100}",
    "description": "系统最大用户数限制",
    "sortOrder": 0,
    "isEnabled": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "configKey": "email.smtp_host",
    "configValue": "smtp.example.com",
    "description": "SMTP服务器地址",
    "sortOrder": 1,
    "isEnabled": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## 代码示例

### cURL

```bash
curl -X GET "http://localhost:7031/api/common-config" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript (Axios)

```javascript
const axios = require('axios');

const response = await axios.get('/api/common-config', {
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
  .url("http://localhost:7031/api/common-config")
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

response = requests.get('http://localhost:7031/api/common-config', headers=headers)

print(response.json())
```

## 错误响应

### 401 未授权

```json
{
  "message": "Unauthorized"
}
```

### 500 服务器内部错误

```json
{
  "message": "Internal Server Error"
}
```