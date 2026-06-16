# 垚总远程加油站

一个低压力、移动端优先的远程陪伴小站。前台用于她自己回血、记录节奏、发送补给请求、穿搭图片和小火花儿内容；后台只查看她主动发送给垚总的内容。

## 运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 环境变量

本地创建 `.env.local`，只放前端可用的 Supabase 公共配置：

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

不要把 `.env.local` 提交到仓库。不要在前端项目里写入 `service_role key`。

## Supabase

主 schema：

- `supabase/schema.sql`

阶段 3 增量 SQL：

- `supabase/stage3-storage.sql`
- `supabase/stage3-admin-front-insert.sql`

权限边界：

- 匿名用户只能主动 `insert` 前台发送内容。
- 管理员通过 Supabase Auth 登录。
- 管理员身份由 `admin_users` 表校验。
- 后台读取和更新依赖 Supabase RLS。
- 穿搭图片存放在私有 `outfit-images` bucket。
- 后台通过 10 分钟 signed URL 查看图片。

## GitHub Pages 部署

项目已包含 GitHub Actions workflow：

- `.github/workflows/deploy-github-pages.yml`

部署前在 GitHub 仓库里配置：

1. `Settings` -> `Secrets and variables` -> `Actions`
2. 新增两个 Repository secrets：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. `Settings` -> `Pages`
4. `Build and deployment` 选择 `GitHub Actions`
5. 推送到 `main` 分支，Actions 会自动构建并发布。

如果仓库名不是 `username.github.io`，项目会自动使用 `/<仓库名>/` 作为部署路径，并生成 `404.html` 支持前端路由刷新。

## 明确不做

- 不做恋爱绑定、亲密度、表白墙。
- 不做打卡、连续天数、断签提醒或惩罚机制。
- 不做访问统计、停留时长、IP、设备、定位、在线状态或隐蔽追踪。
- 不做图片公开相册、AI 图片分析、复杂通知、站内回复或自动下单。
- 宠物玩法只保存在本地，不上传后台。

## 目录

```text
src/admin       后台页面
src/components  通用组件
src/constants   文案、饮品、宠物、主题配置
src/hooks       localStorage、Toast、管理员登录等 hook
src/lib         Supabase client
src/pages       前台页面
src/services    Supabase 和 Storage 调用
src/types       类型定义
supabase        数据库与 Storage SQL
```
