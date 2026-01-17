# Implementation Plan - 统计视图折线图功能

## Phase 1: 后端数据准备 [checkpoint: baaf988]
- [x] Task: 扩展 Server Actions 以支持最近30天数据查询 f5e3562
    - [x] Sub-task: 在 `app/summary/actions.ts` 中实现 `getRecentPushups(days)` 函数，默认 days=30。
    - [x] Sub-task: 实现后端逻辑，生成过去30天的日期列表，并与数据库结果合并，填充缺失日期为 0。
    - [x] Sub-task: 编写单元测试验证该函数能正确返回连续30天的数据，且包含0值填充。

## Phase 2: 前端图表组件开发 [checkpoint: 6ee4be3]
- [x] Task: 引入 Recharts 并创建图表组件 4f2a2f7
    - [x] Sub-task: 安装 `recharts` 库。
    - [x] Sub-task: 创建 `components/pushup-chart.tsx`。
    - [x] Sub-task: 使用 `LineChart` 实现基础折线图。
    - [x] Sub-task: 配置 `XAxis` 显示格式化日期（MM/DD），隐藏 `YAxis` 和 `CartesianGrid`。
    - [x] Sub-task: 自定义 `Tooltip` 样式，使其符合极简风格。
    - [x] Sub-task: 编写组件测试，验证数据渲染和响应式容器 `ResponsiveContainer` 的使用。

## Phase 3: 集成与验收 [checkpoint: bcb4c77]
- [x] Task: 将折线图集成到统计页面 835e9f7
    - [x] Sub-task: 在 `app/summary/page.tsx` 中引入 `PushupChart` 组件。
    - [x] Sub-task: 在页面加载时并行获取最近30天数据。
    - [x] Sub-task: 将折线图放置在页面合适位置（建议在热力图上方或下方）。
- [x] Task: 最终验收与优化 bcb4c77
    - [x] Sub-task: 验证移动端适配效果。
    - [x] Sub-task: 检查无数据情况下的空状态展示。
    - [x] Sub-task: Conductor - User Manual Verification '集成与验收' (Protocol in workflow.md)
