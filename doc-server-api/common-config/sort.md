# 批量更新排序

批量更新多个配置项的排序顺序。

## 接口信息

- **请求方式**：POST
- **接口地址**：`/api/common-config/sort`
- **是否需要认证**：是

## 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| updates | Array | 是 | 排序更新数组 |

### updates 数组项结构

| 字段名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| id | number | 是 | 配置项ID | 1 |
| sortOrder | number | 是 | 新的排序顺序 | 0 |

## 请求示例

```json
{
  "updates": [
    {
      "id": 1,
      "sortOrder": 10
    },
    {
      "id": 2,
      "sortOrder": 0
    },
    {
      "id": 3,
      "sortOrder": 5
    }
  ]
}
```

## 响应数据

### 更新成功 (200)

```json
{
  "success": true,
  "message": "排序更新成功"
}
```

### 请求参数错误 (400)

```json
{
  "message": "updates should not be empty",
  "error": "Bad Request"
}
```

## 代码示例

### cURL

```bash
curl -X POST "http://localhost:7031/api/common-config/sort" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {
        "id": 1,
        "sortOrder": 10
      },
      {
        "id": 2,
        "sortOrder": 0
      },
      {
        "id": 3,
        "sortOrder": 5
      }
    ]
  }'
```

### JavaScript (Axios)

```javascript
const axios = require('axios');

const sortData = {
  updates: [
    { id: 1, sortOrder: 10 },
    { id: 2, sortOrder: 0 },
    { id: 3, sortOrder: 5 }
  ]
};

const response = await axios.post('/api/common-config/sort', sortData, {
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

String json = "{\"updates\":[{\"id\":1,\"sortOrder\":10},{\"id\":2,\"sortOrder\":0},{\"id\":3,\"sortOrder\":5}]}";

RequestBody body = RequestBody.create(mediaType, json);

Request request = new Request.Builder()
  .url("http://localhost:7031/api/common-config/sort")
  .post(body)
  .addHeader("Authorization", "Bearer YOUR_JWT_TOKEN")
  .addHeader("Content-Type", "application/json")
  .build();

Response response = client.newCall(request).execute();
System.out.println(response.body().string());
```

### Python (Requests)

```python
import requests

headers = {
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'application/json'
}

sort_data = {
  'updates': [
    {'id': 1, 'sortOrder': 10},
    {'id': 2, 'sortOrder': 0},
    {'id': 3, 'sortOrder': 5}
  ]
}

response = requests.post('http://localhost:7031/api/common-config/sort',
                       headers=headers,
                       json=sort_data)

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
  "message": "updates should not be empty",
  "error": "Bad Request"
}
```

### 404 配置项不存在

如果指定的ID不存在，会返回相关错误信息

### 500 服务器内部错误

```json
{
  "message": "Internal Server Error"
}
```

## 使用场景

1. **拖拽排序**：前端实现拖拽功能后，批量更新排序
2. **批量调整**：需要同时调整多个配置项的显示顺序
3. **导入恢复**：从备份恢复时需要设置正确的排序顺序
4. **分类管理**：将相关配置项通过排序进行分组显示

## 注意事项

1. 排序值不需要连续，只需要保持相对顺序即可
2. 建议使用 0, 1, 2, 3... 这样的连续整数，便于后续插入
3. 事务处理：要么全部成功，要么全部失败
4. 可以同时更新任意数量的配置项排序