# 更新配置

更新指定ID的配置项信息。

## 接口信息

- **请求方式**：PATCH
- **接口地址**：`/api/common-config/:id`
- **是否需要认证**：是

## 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 配置项ID |

## 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| configKey | string | 否 | 配置键（唯一标识） | "api.rate_limit_v2" |
| configValue | string | 否 | 配置值（一般为JSON字符串） | '{"limit": 2000}' |
| description | string | 否 | 配置描述 | "API速率限制v2" |
| sortOrder | number | 否 | 排序顺序 | 15 |
| isEnabled | boolean | 否 | 是否启用 | false |

> 注意：所有参数都是可选的，只需要传递需要更新的字段。

## 请求示例

```json
{
  "configValue": "{\"limit\": 2000, \"window\": 7200}",
  "description": "API速率限制v2更新",
  "sortOrder": 15,
  "isEnabled": false
}
```

## 响应数据

### 更新成功 (200)

```json
{
  "id": 3,
  "configKey": "api.rate_limit",
  "configValue": "{\"limit\": 2000, \"window\": 7200}",
  "description": "API速率限制v2更新",
  "sortOrder": 15,
  "isEnabled": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T01:00:00.000Z"
}
```

### 配置项不存在 (404)

```json
{
  "message": "配置项 ID 3 不存在"
}
```

### 配置键已存在 (409)

```json
{
  "message": "配置键 \"new_key\" 已存在"
}
```

## 代码示例

### cURL

```bash
curl -X PATCH "http://localhost:7031/api/common-config/3" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "configValue": "{\"limit\": 2000, \"window\": 7200}",
    "description": "API速率限制v2更新",
    "sortOrder": 15,
    "isEnabled": false
  }'
```

### JavaScript (Axios)

```javascript
const axios = require('axios');

const configId = 3;
const updateData = {
  configValue: JSON.stringify({ limit: 2000, window: 7200 }),
  description: 'API速率限制v2更新',
  sortOrder: 15,
  isEnabled: false
};

const response = await axios.patch(`/api/common-config/${configId}`, updateData, {
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

String json = "{\"configValue\":\"{\\\"limit\\\": 2000, \\\"window\\\": 7200}\",\"description\":\"API速率限制v2更新\",\"sortOrder\":15,\"isEnabled\":false}";

RequestBody body = RequestBody.create(mediaType, json);

Request request = new Request.Builder()
  .url("http://localhost:7031/api/common-config/3")
  .patch(body)
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

config_id = 3
update_data = {
  'configValue': json.dumps({'limit': 2000, 'window': 7200}),
  'description': 'API速率限制v2更新',
  'sortOrder': 15,
  'isEnabled': False
}

response = requests.patch(f'http://localhost:7031/api/common-config/{config_id}',
                         headers=headers,
                         json=update_data)

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
  "message": "配置项 ID 3 不存在"
}
```

### 409 配置键已存在

```json
{
  "message": "配置键 \"new_key\" 已存在"
}
```

### 500 服务器内部错误

```json
{
  "message": "Internal Server Error"
}
```