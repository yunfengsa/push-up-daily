# Implementation Plan - 年度打卡热力图看板

## Phase 1: 后端数据准备
- [x] Task: 扩展 Server Actions 以支持年度数据查询 2f191a0
    - [ ] Sub-task: 在 `app/summary/actions.ts` 中实现 `getYearlyPushups(year)` 函数。
    - [ ] Sub-task: 编写单元测试验证该函数能正确聚合过去一年的数据（需处理空缺日期）。

## Phase 2: 前端组件开发
- [x] Task: 创建基础热力图组件 beaed26
    - [ ] Sub-task: 创建 `components/heatmap.tsx`。
    - [ ] Sub-task: 实现基于 CSS Grid 的网格布局，动态渲染 365 个格子。
    - [ ] Sub-task: 实现颜色映射逻辑（根据 count 映射到 Tailwind 颜色类）。
- [x] Task: 实现交互与适配 f340853
    - [ ] Sub-task: 添加 Tooltip 组件或简单的 Title 属性，展示日期和数量。
    - [ ] Sub-task: 使用 `overflow-x-auto` 实现移动端水平滚动，或根据屏幕宽度隐藏部分月份。

## Phase 3: 集成与优化 [checkpoint: 093ff14]
- [x] Task: 将热力图集成到统计页面 9bac5c6
    - [ ] Sub-task: 在 `app/summary/page.tsx` 中引入 `Heatmap` 组件。
    - [ ] Sub-task: 在页面加载时获取年度数据并传递给组件。
    - [ ] Sub-task: 调整页面布局，将热力图放置在月历视图下方或作为独立 Tab。
- [x] Task: 最终验收与样式微调 093ff14
    - [ ] Sub-task: 确保热力图颜色风格与现有 UI 保持一致（极简白/绿配色）。
    - [ ] Sub-task: Conductor - User Manual Verification '集成与优化' (Protocol in workflow.md)
