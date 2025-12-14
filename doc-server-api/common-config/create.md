# 创建新配置

创建一个新的系统配置项。

## 接口信息

- **请求方式**：POST
- **接口地址**：`/api/common-config`
- **是否需要认证**：是

## 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| configKey | string | 是 | 配置键（唯一标识） | "api.rate_limit" |
| configValue | string | 否 | 配置值（一般为JSON字符串） | '{"limit": 1000}' |
| description | string | 否 | 配置描述 | "API速率限制" |
| sortOrder | number | 否 | 排序顺序，默认为0 | 10 |
| isEnabled | boolean | 否 | 是否启用，默认为true | true |

## 请求示例

```json
{
  "configKey": "api.rate_limit",
  "configValue": "{\"limit\": 1000, \"window\": 3600}",
  "description": "API速率限制设置",
  "sortOrder": 10,
  "isEnabled": true
}
```

## 响应数据

### 创建成功 (201)

```json
{
  "id": 3,
  "configKey": "api.rate_limit",
  "configValue": "{\"limit\": 1000, \"window\": 3600}",
  "description": "API速率限制设置",
  "sortOrder": 10,
  "isEnabled": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 请求参数错误 (400)

```json
{
  "message": [
    "configKey should not be empty",
    "configKey must be a string",
    "configKey length must be less than or equal to 255"
  ]
}
```

### 配置键已存在 (409)

```json
{
  "message": "配置键 \"api.rate_limit\" 已存在"
}
```

## 代码示例

### cURL

```bash
curl -X POST "http://localhost:7031/api/common-config" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "configKey": "api.rate_limit",
    "configValue": "{\"limit\": 1000, \"window\": 3600}",
    "description": "API速率限制设置",
    "sortOrder": 10,
    "isEnabled": true
  }'
```

### JavaScript (Axios)

```javascript
const axios = require('axios');

const configData = {
  configKey: 'api.rate_limit',
  configValue: JSON.stringify({ limit: 1000, window: 3600 }),
  description: 'API速率限制设置',
  sortOrder: 10,
  isEnabled: true
};

const response = await axios.post('/api/common-config', configData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

console.log(response.data);
```

### Java (OkHttp)

```java
OkHttpClient client = new OkHttpClient();
MediaType mediaType = MediaType.parse("application/json; charset=utf-8");

String json = "{\"configKey\":\"api.rate_limit\",\"configValue\":\"{\\\"limit\\\": 1000, \\\"window\\\": 3600}\",\"description\":\"API速率限制设置\",\"sortOrder\":10,\"isEnabled\":true}";

RequestBody body = RequestBody.create(mediaType, json);

Request request = new Request.Builder()
  .url("http://localhost:7031/api/common-config")
  .post(body)
  .addHeader("Authorization", "Bearer YOUR_JWT_TOKEN")
  .addHeader("Content-Type", "application/json")
  .build();

Response response = client.newCall(request).execute();
```

### Python (Requests)

```python
import requests
import json

headers = {
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'application/json'
}

config_data = {
  'configKey': 'api.rate_limit',
  'configValue': json.dumps({'limit': 1000, 'window': 3600}),
  'description': 'API速率限制设置',
  'sortOrder': 10,
  'isEnabled': True
}

response = requests.post('http://localhost:7031/api/common-config',
                       headers=headers,
                       json=config_data)

print(response.json())
```

## 错误响应

### 401 未授权

```json
{
  "message": "Unauthorized"
}
```

### 400 请求参数错误

```json
{
  "message": [
    "configKey should not be empty",
    "configKey must be a string",
    "configKey length must be less than or equal to 255"
  ]
}
```

### 409 配置键已存在

```json
{
  "message": "配置键 \"api.rate_limit\" 已存在"
}
```

### 500 服务器内部错误

```json
{
  "message": "Internal Server Error"
}
```