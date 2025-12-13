# DTO 目录

存放数据传输对象（Data Transfer Object）。

DTO 用于定义请求和响应的数据结构，通常包括：
- `create-{模块名}.dto.ts`: 创建资源的 DTO
- `update-{模块名}.dto.ts`: 更新资源的 DTO
- `query-{模块名}.dto.ts`: 查询参数的 DTO
- `response-{模块名}.dto.ts`: 响应数据的 DTO

DTO 通常配合 class-validator 和 class-transformer 使用进行数据验证和转换。

