# 切换启用状态

切换指定配置项的启用/禁用状态。如果当前是启用状态，则会切换为禁用状态；反之亦然。

## 接口信息

- **请求方式**：PATCH
- **接口地址**：`/api/common-config/:id/toggle`
- **是否需要认证**：是

## 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 配置项ID |

## 请求示例

```
PATCH /api/common-config/3/toggle
```

## 响应数据

### 切换成功 (200)

如果原状态为启用，响应：

```json
{
  "id": 3,
  "configKey": "api.rate_limit",
  "configValue": "{\"limit\": 1000, \"window\": 3600}",
  "description": "API速率限制设置",
  "sortOrder": 10,
  "isEnabled": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T01:00:00.000Z"
}
```

如果原状态为禁用，响应：

```json
{
  "id": 3,
  "configKey": "api.rate_limit",
  "configValue": "{\"limit\": 1000, \"window\": 3600}",
  "description": "API速率限制设置",
  "sortOrder": 10,
  "isEnabled": true,
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

## 代码示例

### cURL

```bash
curl -X PATCH "http://localhost:7031/api/common-config/3/toggle" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript (Axios)

```javascript
const axios = require('axios');

const configId = 3;

const response = await axios.patch(`/api/common-config/${configId}/toggle`, {}, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

console.log(`配置状态已切换，当前状态：${response.data.isEnabled ? '启用' : '禁用'}`);
```

### Java (OkHttp)

```java
OkHttpClient client = new OkHttpClient();

Request request = new Request.Builder()
  .url("http://localhost:7031/api/common-config/3/toggle")
  .patch(RequestBody.create("", null))
  .addHeader("Authorization", "Bearer YOUR_JWT_TOKEN")
  .build();

Response response = client.newCall(request).execute();
System.out.println(response.body().string());
```

### Python (Requests)

```python
import requests

headers = {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}

config_id = 3
response = requests.patch(f'http://localhost:7031/api/common-config/{config_id}/toggle',
                         headers=headers)

result = response.json()
status = '启用' if result['isEnabled'] else '禁用'
print(f'配置状态已切换，当前状态：{status}')
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

### 500 服务器内部错误

```json
{
  "message": "Internal Server Error"
}
```

## 使用场景

1. **临时禁用某个功能**：当需要暂时关闭某个功能时，可以通过切换状态来快速实现
2. **A/B测试**：在不同环境或不同时间段切换配置，进行功能测试
3. **维护模式**：在系统维护时禁用某些非核心功能
4. **快速响应**：当发现某个配置引起问题时，可以快速禁用以止损