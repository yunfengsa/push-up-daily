# 俯卧撑打卡 (push-up-daily) - 技术栈

## 核心框架 (Core Framework)
*   **Next.js (v16.1.2)**: 使用 App Router 架构，利用 React Server Components (RSC) 和 Server Actions 实现高性能的全栈开发。
*   **TypeScript**: 作为主要的编程语言，确保端到端的类型安全。

## 身份验证与安全 (Auth & Security)
*   **better-auth (v1.4.13)**: 使用基于标准且功能强大的认证框架。
    *   **Plugins**: 启用 `username` 插件，支持用户名/密码登录。
*   **Next.js Middleware (proxy.ts)**: 实现路由保护和未授权重定向。

## 数据存储 (Data Storage)
*   **MySQL**: 作为主关系型数据库。
*   **mysql2**: 使用其 Promise 接口的连接池管理，确保数据库操作的效率和稳定性。
*   **server-only**: 关键的数据库逻辑和敏感连接信息通过 `server-only` 库进行物理隔离，防止泄露到客户端。

## UI 与样式 (UI & Styling)
*   **Tailwind CSS (v4)**: 使用最新的原子化 CSS 框架进行 UI 开发。
*   **Recharts**: 用于统计数据的可视化展示（如折线图）。
*   **React (v19)**: 作为底层 UI 库。

## PWA 与 移动端 (PWA & Mobile)
*   **Service Worker**: 原生实现资源缓存，支持离线访问。
*   **Web Manifest**: 配置应用名称、图标及安装属性。

## 开发工具 (Dev Tools)
*   **ESLint**: 用于代码质量控制。
*   **Better Auth CLI**: 用于数据库迁移和模式管理。
