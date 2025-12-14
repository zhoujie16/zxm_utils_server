# 删除配置

删除指定ID的配置项。

## 接口信息

- **请求方式**：DELETE
- **接口地址**：`/api/common-config/:id`
- **是否需要认证**：是

## 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 配置项ID |

## 请求示例

```
DELETE /api/common-config/3
```

## 响应数据

### 删除成功 (204)

成功删除后返回 204 状态码，无响应体。

### 配置项不存在 (404)

```json
{
  "message": "配置项 ID 3 不存在"
}
```

## 代码示例

### cURL

```bash
curl -X DELETE "http://localhost:7031/api/common-config/3" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript (Axios)

```javascript
const axios = require('axios');

const configId = 3;

try {
  await axios.delete(`/api/common-config/${configId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  console.log('删除成功');
} catch (error) {
  console.error('删除失败:', error.response.data);
}
```

### Java (OkHttp)

```java
OkHttpClient client = new OkHttpClient();

Request request = new Request.Builder()
  .url("http://localhost:7031/api/common-config/3")
  .delete()
  .addHeader("Authorization", "Bearer YOUR_JWT_TOKEN")
  .build();

Response response = client.newCall(request).execute();
if (response.isSuccessful()) {
  System.out.println("删除成功");
}
```

### Python (Requests)

```python
import requests

headers = {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}

config_id = 3
response = requests.delete(f'http://localhost:7031/api/common-config/{config_id}', headers=headers)

if response.status_code == 204:
  print('删除成功')
else:
  print(f'删除失败: {response.json()}')
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

## 注意事项

1. 删除操作是不可逆的，请谨慎操作
2. 删除配置前请确认该配置是否被其他模块使用
3. 建议在删除前先禁用配置，观察一段时间后再删除
4. 系统关键配置不建议删除，只建议禁用或修改