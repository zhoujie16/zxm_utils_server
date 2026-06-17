# 刷新配置 Token

根据公共配置的扩展参数刷新指定 Token。目前仅支持 `TuQiangToken`。

## 接口信息

- **请求方式**：POST
- **接口地址**：`/api/common-config/:configKey/refresh-token`
- **是否需要认证**：是

## 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| configKey | string | 是 | 配置键，目前仅支持 `TuQiangToken` |

## 业务规则

- `TuQiangToken.configExtra` 必须是 JSON 字符串。
- `configExtra.loginApiData` 保存完整的 `application/x-www-form-urlencoded` 登录表单字符串。
- 服务端调用 `http://tuqiang123.com/api/regdc`。
- 从响应 Cookie 中读取 `SHAREJSESSIONID`。
- 将 `SHAREJSESSIONID` 写回 `TuQiangToken.configValue`。

## configExtra 示例

```json
{
  "loginApiData": "ver=1&method=login&account=17521282018&password=81%7C87%7C101%7C114%7C48%7C57%7C50%7C54&language=zh"
}
```

实际存入 `configExtra` 字段时为 JSON 字符串：

```json
"{\"loginApiData\":\"ver=1&method=login&account=17521282018&password=81%7C87%7C101%7C114%7C48%7C57%7C50%7C54&language=zh\"}"
```

## 请求示例

```http
POST /api/common-config/TuQiangToken/refresh-token
```

## 响应数据

### 刷新成功 (200)

```json
{
  "id": 1,
  "configKey": "TuQiangToken",
  "configValue": "31de4fe5-5368-4e7f-a6c9-20ac801cdc9a",
  "configExtra": "{\"loginApiData\":\"ver=1&method=login&account=17521282018&password=81%7C87%7C101%7C114%7C48%7C57%7C50%7C54&language=zh\"}",
  "description": "途强平台登录后的 SHAREJSESSIONID 值，用于车辆轨迹同步。",
  "sortOrder": 0,
  "isEnabled": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T01:00:00.000Z"
}
```

### 参数或配置错误 (400)

```json
{
  "message": "loginApiData 未配置"
}
```

可能的错误信息：

- `暂不支持刷新该配置`
- `配置未启用`
- `配置扩展参数不存在`
- `配置扩展参数不是有效 JSON`
- `loginApiData 未配置`

### 配置项不存在 (404)

```json
{
  "message": "配置项不存在"
}
```

### 外部登录接口异常 (502)

```json
{
  "message": "登录响应中没有 SHAREJSESSIONID"
}
```

## 代码示例

### cURL

```bash
curl -X POST "http://localhost:7031/api/common-config/TuQiangToken/refresh-token" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
