# Wonder Lib

一个专为 Nuxt 4 项目设计的现代化 UI 组件库，支持自动导入和 TypeScript。

## 项目结构

```
wonder-lib/
├── packages/
│   └── wonder-lib/          # 核心组件库包
│       ├── src/
│       │   ├── components/  # 组件
│       │   ├── composables/ # 组合式函数
│       │   ├── utils/       # 工具函数
│       │   └── types/       # 类型定义
│       └── package.json
├── wonder-demo/             # 测试演示项目
├── pnpm-workspace.yaml     # pnpm workspace 配置
└── package.json
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 启动演示项目
pnpm dev

# 或者
pnpm demo
```

### 构建

```bash
# 构建所有包
pnpm build

# 只构建组件库
pnpm lib:build
```

## 特性

- 🚀 **Nuxt 4 支持** - 专为 Nuxt 4 设计，完美集成
- 📦 **自动导入** - 组件和组合式函数自动导入，无需手动引入
- 🎨 **现代化设计** - 基于最新设计规范的组件库
- 💪 **TypeScript** - 完整的 TypeScript 支持
- 🔧 **可定制** - 灵活的主题和样式定制
- 📱 **响应式** - 完美支持移动端和桌面端

## 使用方法

### 在 Nuxt 4 项目中安装

```bash
npm install wonder-lib
# 或
pnpm add wonder-lib
# 或
yarn add wonder-lib
```

### 配置 Nuxt 模块

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    'wonder-lib/nuxt'
  ]
})
```

### 使用组件

```vue
<template>
  <div>
    <!-- 组件会自动导入，无需手动引入 -->
    <WButton type="primary">点击我</WButton>
    <WInput v-model="value" placeholder="请输入内容" />
  </div>
</template>

<script setup>
// 组合式函数也会自动导入
const { data } = useWonderApi('/api/users')
const theme = useWonderTheme()
</script>
```

## 开发

本项目使用 pnpm workspace 管理多包结构：

- `packages/wonder-lib` - 核心组件库
- `wonder-demo` - 演示和测试项目

### 开发流程

1. 在 `packages/wonder-lib` 中开发组件
2. 在 `wonder-demo` 中测试和预览
3. 构建并发布到 npm

## 许可证

MIT License