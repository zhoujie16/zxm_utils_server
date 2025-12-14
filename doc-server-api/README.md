# API 文档总览

## 📚 文档结构

本项目API文档采用模块化组织方式，按功能模块分类管理。

### 模块目录

- [登录认证模块](./login/) - 用户登录、JWT 认证
  - [用户登录](./login/login.md) - `POST /api/auth/login`
- [车辆行程模块](./vehicle-trip/) - 车辆行程数据管理
  - [查询车辆行程数据列表](./vehicle-trip/list.md) - `GET /api/vehicle-trip`
  - [同步车辆行程数据](./vehicle-trip/sync.md) - `POST /api/vehicle-trip/sync`
- [车辆轨迹模块](./vehicle-track/) - 车辆轨迹数据管理
  - [查询车辆轨迹数据列表](./vehicle-track/list.md) - `GET /api/vehicle-track`
  - [同步车辆轨迹数据](./vehicle-track/sync.md) - `POST /api/vehicle-track/sync`

## 🔗 基础信息

- **基础URL**: `http://localhost:8010/api`
- **Content-Type**: `application/json`
- **认证方式**: Bearer Token (需要认证的接口)

## 📋 通用规范

### HTTP状态码

- `200`: 成功响应
- `400`: 请求参数错误
- `401`: 未授权访问
- `404`: 资源未找到
- `500`: 服务器内部错误

### 分页参数

所有列表接口支持标准分页参数：

- `page`: 页码，默认为1
- `limit`: 每页数量，默认为10，最大100
