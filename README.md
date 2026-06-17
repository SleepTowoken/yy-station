# 垚总远程加油站

这是一个低压力、移动端优先的远程陪伴小站。前台给用户自己回血、表达状态、主动发送补给请求、发送穿搭和小火花儿；后台只给管理员查看和处理用户主动发送给垚总的内容。

当前线上地址：

- GitHub Pages: <https://sleeptowoken.github.io/yy-station/>

## 项目定位

项目核心不是社交绑定，也不是监督工具，而是一个“远程加油站”：

- 用户先照顾自己，再决定要不要让垚总知道。
- 所有发送给垚总的内容，都必须由用户主动点击按钮触发。
- 前台体验要轻、软、低压力，不制造负担。
- 后台只做查看、处理和必要的状态管理。
- 宠物是陪伴玩法，本地保存，不上传后台。

## 绝对边界

后续任何优化都必须遵守这些边界：

- 不做恋爱绑定、亲密度、情侣关系、表白墙、暧昧积分。
- 不做打卡、连续天数、断签提醒、未登录惩罚、催促机制。
- 不做隐蔽追踪。
- 不记录访问次数、停留时长、IP、设备、定位、在线状态、指纹信息。
- 不做宠物数据上传。
- 不把前台暗号当安全边界；真正权限依赖 Supabase Auth + RLS。
- 不在前端、仓库、README、聊天记录里写入真实密钥。
- 前端只允许使用 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`。
- 禁止把 Supabase `service_role key` 放进前端项目。

## 当前阶段状态

### 阶段 1：前台体验 MVP

已完成：

- 前台暗号入口。
- 移动端优先的主界面。
- 底部 Tab 导航。
- 今日回血。
- 能量补给站。
- 自己的节奏。
- 今日穿搭营业中。
- 小火花儿。
- 本地 Toast 反馈。
- `localStorage` 保存前台状态、Tab、宠物设置、能量豆等。
- PWA 基础配置。
- 悬浮宠物入口和回血小窝。

### 阶段 2：Supabase 后台接入

已完成：

- Supabase client。
- 前台主动点击发送时写入 Supabase。
- 后台登录。
- 管理员身份校验。
- 后台列表读取。
- 后台状态更新。
- RLS 权限策略。
- 匿名用户只能 insert。
- 管理员才能 select/update。

### 阶段 3：今日穿搭图片

已完成：

- 今日穿搭图片走 Supabase Storage 私有 bucket。
- bucket 名称：`outfit-images`。
- 前台只在用户主动点击发送时上传图片和写入记录。
- 后台通过 10 分钟 signed URL 查看图片。
- 不做公开相册。
- 不做 AI 图片分析。
- 不做复杂通知。

### 阶段 4：垚总补给箱

已完成：

- 管理员可以在 `/admin/notes` 写小纸条。
- 管理员可以保存草稿、发布、下架、置顶。
- 前台用户可以在 `/supply-box` 主动查看已发布小纸条。
- 第一版只支持文字小纸条。
- 前台按钮「收下啦」「晚点再看」只做本地 Toast。
- 前台不写入查看行为。
- 不做已读。
- 不做未读红点。
- 不做访问统计。
- 不做在线状态。
- 不记录她看没看补给箱。
- 匿名用户只能读取 `published` 内容。
- 管理员通过 Supabase Auth + `admin_users` + RLS 管理。

### 当前宠物方向

已切换为“毛绒感 2.5D 宠物组件”方向：

- 不再使用 Three.js。
- 不再使用粒子 Canvas。
- 不再使用蓝色能量球、旋转光圈、点击爆发粒子。
- 支持 `teddy`、`golden`、`ragdoll` 三种宠物类型。
- 默认宠物是 `teddy`。
- 宠物选择保存在 `localStorage`。
- 同页面切换宠物后会即时刷新，不需要手动刷新页面。
- 如果 `public/pets/*.webp` 是透明宠物图，会优先显示图片。
- 如果图片不是透明背景，会自动回退到 CSS 毛绒宠物。

## 技术栈

- Vite
- React
- TypeScript
- React Router
- Supabase JS
- Vite PWA
- Tailwind CSS Vite plugin
- 原生 CSS 组件样式

当前没有使用：

- Three.js
- `@react-three/fiber`
- `@react-three/drei`
- 外部 3D 模型
- 远程图片 URL

## 运行命令

安装依赖：

```bash
npm install
```

本地开发：

```bash
npm run dev
```

代码检查：

```bash
npm run lint
```

生产构建：

```bash
npm run build
```

本地预览生产包：

```bash
npm run preview
```

## 环境变量

本地创建 `.env.local`，只放前端可用的 Supabase 公共配置：

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

注意：

- `.env.local` 不要提交到仓库。
- `.env.example` 只保留变量名，不写真实值。
- 不要在任何前端文件中写入 `service_role key`。
- GitHub Actions 部署时，使用 GitHub Repository secrets 注入这两个变量。

## Supabase 配置

主要 SQL 文件：

- `supabase/schema.sql`
- `supabase/stage3-storage.sql`
- `supabase/stage3-admin-front-insert.sql`
- `supabase/stage4-admin-notes.sql`

### 数据表

当前 schema 包含：

- `admin_users`：管理员白名单。
- `mood_logs`：今日回血记录。
- `supply_requests`：能量补给请求。
- `rhythm_logs`：自己的节奏记录。
- `outfit_logs`：今日穿搭记录。
- `spark_logs`：小火花儿记录。
- `guest_messages`：轻留言预留表，当前前台不暴露独立入口。
- `admin_notes`：垚总补给箱小纸条，前台只读已发布内容。

### Storage

- bucket：`outfit-images`
- 类型：私有 bucket
- 用途：今日穿搭图片
- 前台：用户主动点击发送时上传
- 后台：管理员通过 signed URL 临时查看

### 权限原则

- 匿名用户只能 insert 前台主动发送的数据。
- 管理员通过 Supabase Auth 登录。
- 管理员身份通过 `admin_users` 表校验。
- 管理员可以 select/update 后台数据。
- 非管理员不能读取后台数据。
- RLS 是真正安全边界。

## 前台页面

入口由 `src/App.tsx` 管理。

前台默认走：

- `src/pages/Gate.tsx`
- `src/pages/Home.tsx`

前台功能页：

- `src/pages/TodayHeal.tsx`：今日回血。
- `src/pages/OwnRhythm.tsx`：自己的节奏。
- `src/pages/OutfitToday.tsx`：今日穿搭营业中。
- `src/pages/LittleSpark.tsx`：小火花儿。
- `src/pages/SupplyBox.tsx`：垚总补给箱，只展示已发布小纸条，不记录查看行为。

底部 Tab：

- 今日回血
- 自己的节奏
- 今日穿搭
- 小火花儿

## 后台页面

后台路由在 `src/App.tsx` 中定义，统一位于 `/admin/*`。

当前后台页面：

- `/admin/dashboard`
- `/admin/mood`
- `/admin/supply`
- `/admin/rhythm`
- `/admin/outfits`
- `/admin/sparks`
- `/admin/notes`

后台文件：

- `src/admin/AdminLayout.tsx`
- `src/admin/AdminLogin.tsx`
- `src/admin/AdminDashboard.tsx`
- `src/admin/AdminMood.tsx`
- `src/admin/AdminSupply.tsx`
- `src/admin/AdminRhythm.tsx`
- `src/admin/AdminOutfits.tsx`
- `src/admin/AdminSparks.tsx`
- `src/admin/AdminNotes.tsx`
- `src/admin/adminFormat.ts`

## Service 位置

当前前台发送和后台读取主要在这些 service 中：

- `src/services/moodService.ts`
- `src/services/supplyService.ts`
- `src/services/rhythmService.ts`
- `src/services/outfitService.ts`
- `src/services/sparkService.ts`
- `src/services/storageService.ts`
- `src/services/adminService.ts`
- `src/services/adminNoteService.ts`

Supabase client：

- `src/lib/supabase.ts`

如果 `.env.local` 未配置或发送失败，前台应该给用户低压力失败提示，例如“好像没发出去，再试一下？”。不能把 mock 成功当成真实成功。

## 宠物系统

当前宠物相关文件：

- `src/components/FloatingPet.tsx`
- `src/components/PetPanel.tsx`
- `src/components/pet/PetWidget.tsx`
- `src/components/pet/PlushPet.tsx`
- `src/components/pet/petPresets.ts`
- `src/components/pet/pet.css`
- `src/constants/pets.ts`
- `src/hooks/useDailyEnergy.ts`
- `src/hooks/useLocalStorage.ts`

宠物类型：

```ts
export type PetType = 'teddy' | 'golden' | 'ragdoll'
export type PetMood = 'normal' | 'happy' | 'sleepy'
```

默认宠物位置：

```ts
// src/components/pet/petPresets.ts
export const defaultPetType: PetType = 'teddy'
```

如果要把默认宠物改成金毛：

```ts
export const defaultPetType: PetType = 'golden'
```

如果要把默认宠物改成布偶：

```ts
export const defaultPetType: PetType = 'ragdoll'
```

宠物图片资源预留目录：

```text
public/pets/
  teddy.webp
  golden.webp
  ragdoll.webp
```

资源路径必须使用 `import.meta.env.BASE_URL`，因为项目部署在 GitHub Pages 子路径 `/yy-station/`。

当前逻辑：

- 透明背景宠物图可作为贴图主体。
- 非透明背景图会被检测出来，并回退到 CSS 宠物。
- CSS 宠物用于模拟毛绒、坐姿、耳朵、眼睛、鼻子、腮红和底部阴影。
- 宠物外层尽量不抢占点击区域。
- 宠物玩法只保存在本地。

后续宠物优化建议：

- 可以继续用 CSS/SVG 做更像参考图的毛绒结构。
- 也可以使用抠好透明背景的 WebP 作为主体贴图。
- 不建议回到粒子精灵、蓝色能量球或复杂 3D 模型。

## PWA

PWA 配置在 `vite.config.ts`。

当前配置：

- `registerType: 'autoUpdate'`
- 自动清理旧缓存。
- `clientsClaim`
- `skipWaiting`
- manifest 名称：`垚总加油站`
- 图标：
  - `public/pwa.svg`
  - `public/pwa-maskable.svg`

注意：如果线上页面看不到最新变化，可能是浏览器或 PWA 缓存，需要强制刷新或清理站点数据。

## 部署

### GitHub Pages

当前优先部署方式是 GitHub Pages。

工作流文件：

- `.github/workflows/deploy-github-pages.yml`

部署逻辑：

- 推送到 `main` 自动触发。
- GitHub Actions 安装依赖。
- 执行 `npm run build`。
- 注入 GitHub Repository secrets：
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- 把 `dist/index.html` 复制为 `dist/404.html`，支持前端路由刷新。
- 发布到 GitHub Pages。

Vite base path：

- 本地默认 `/`。
- GitHub Actions 中会根据仓库名自动生成。
- 当前仓库路径对应 `/yy-station/`。

### Netlify

项目保留 Netlify 配置：

- `netlify.toml`

项目结构不写死 Netlify 专属逻辑。之前部署目标曾考虑 Netlify，但当前公网访问以 GitHub Pages 为准。

## 主要目录结构

```text
.
├── .github/workflows/
│   └── deploy-github-pages.yml
├── public/
│   ├── pets/
│   │   ├── README.md
│   │   ├── teddy.webp
│   │   ├── golden.webp
│   │   └── ragdoll.webp
│   ├── pwa.svg
│   └── pwa-maskable.svg
├── src/
│   ├── admin/
│   ├── components/
│   │   └── pet/
│   ├── constants/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── supabase/
│   ├── schema.sql
│   ├── stage3-storage.sql
│   ├── stage3-admin-front-insert.sql
│   └── stage4-admin-notes.sql
├── .env.example
├── netlify.toml
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 重要本地状态

这些文件不应该包含真实密钥：

- `.env.example`
- `README.md`
- 所有 `src/**/*`
- 所有 `supabase/*.sql`

这些文件通常不提交：

- `.env.local`
- 本地临时图片
- 本地 prompt 草稿

当前 `public/pets/*.webp` 是宠物素材预留路径。正式上线前应确认它们是透明背景、高质量、无水印、体积可控的 WebP/PNG。

## 给 GPT 的后续协作提示

如果把本 README 发给 GPT 讨论优化，建议明确要求：

- 不要突破“绝对边界”。
- 不要新增任何隐蔽追踪或访问统计。
- 不要新增打卡、连续天数或惩罚机制。
- 不要把宠物玩法上传到 Supabase。
- 不要写入真实 Supabase key。
- 保持 GitHub Pages 子路径 `/yy-station/` 兼容。
- 修改后必须保证 `npm run lint` 和 `npm run build` 通过。
- 涉及前台发送时，必须是用户主动点击按钮。
- 涉及后台权限时，必须依赖 Supabase Auth + `admin_users` + RLS。

适合继续优化的方向：

- 宠物视觉继续打磨成更毛绒、更 2.5D。
- 移动端细节优化。
- 后台筛选、批量处理和更清晰的状态流。
- 前台文案更自然、更低压力。
- 今日穿搭图片压缩、预览和失败提示优化。
- PWA 更新提示和缓存体验优化。

不建议继续推进的方向：

- 访问分析。
- 在线状态。
- 自动提醒。
- 亲密度系统。
- 打卡系统。
- 复杂社交化功能。
- 自动下单或自动通知。
