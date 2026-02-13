# 每日俯卧撑 (Push-up Daily)

这是一个专为中国市场设计的现代化俯卧撑追踪应用。使用 Next.js 16 构建，拥有精美的 Glassmorphism (毛玻璃) 风格 UI，并支持 PWA。

## ✨ 主要功能

- **🔐 安全认证**: 集成 Better Auth，支持用户名/密码及邮箱登录。
- **⏱️ 运动追踪**: 内置计时器，支持实时记录或手动补录俯卧撑数据。
- **📊 数据统计**: 通过 Recharts 提供详细的可视化图表，包括趋势图和年度热力图。
- **📱 PWA 支持**: 支持安装到桌面或移动设备，提供原生应用般的体验。
- **🎨 现代 UI**: 基于 Tailwind CSS v4 打造的流畅、响应式设计。

## 🛠️ 技术栈

- **框架**: [Next.js 16.1.2](https://nextjs.org/) (App Router)
- **样式**: [Tailwind CSS v4](https://tailwindcss.com/)
- **数据库**: PostgreSQL (使用 `pg` 连接池)
- **认证**: [Better Auth](https://better-auth.com/)
- **图表**: [Recharts](https://recharts.org/)
- **语言**: TypeScript

## 🚀 快速开始

### 前置要求

- Node.js (建议 v20+)
- PostgreSQL 数据库

### 1. 克隆项目

```bash
git clone git@github.com:yunfengsa/push-up-daily.git
cd push-up-daily
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

在项目根目录创建 `.env.local` 文件，并填写以下配置：

```env
# 数据库配置（推荐）
DATABASE_URL=postgres://postgres:your_password@localhost:5432/pushup_daily

# 可选：分项配置（若不使用 DATABASE_URL）
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=pushup_daily

# Better Auth 配置
BETTER_AUTH_SECRET=your_generated_secret
BETTER_AUTH_URL=http://localhost:3000
```

### 4. 数据库初始化

初始化数据库表结构：

```bash
# 1. 迁移认证相关表
npm run db:migrate

# 2. 导入业务数据表
# 请根据你的数据库配置替换连接参数
psql "$DATABASE_URL" -f scripts/init-pushup-db.sql
```

### 5. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可访问应用。

## 🧪 测试

项目包含 Jest 测试用例，运行以下命令进行测试：

```bash
npm run test
```

## 📄 许可证

[MIT](LICENSE)
