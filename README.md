# TaiASST 插件开发模板

<p align="center">
  <img src="./public/logo.png" width="120" alt="TaiASST Logo">
</p>

<p align="center">
  <a href="https://github.com/teexue/taiasst/releases">
    <img src="https://img.shields.io/github/v/release/teexue/taiasst" alt="Release">
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/github/license/teexue/taiasst" alt="License">
  </a>
</p>

<p align="center">TaiASST 插件开发模板 - 快速构建高质量 TaiASST 插件</p>

## 📖 简介

TaiASST 插件开发模板是为 TaiASST（Teexue AI Assistant）项目设计的标准插件开发框架。该模板提供了完整的插件开发环境，包括前端（React + Ant Design）和后端（Rust）的支持，帮助开发者快速构建功能丰富的插件。

## 🚀 特性

- 📦 集成 React 18 + Ant Design 5，提供现代化 UI 组件
- 🛠️ TypeScript 支持，提供类型安全和开发体验
- 🔌 支持 Rust 后端开发，高性能计算和系统交互
- 📋 标准化的插件开发流程和规范
- 🔄 开发、构建、打包一体化工具链

## 🔧 开发环境要求

- [Node.js](https://nodejs.org/) 18.0 或更高版本
- [pnpm](https://pnpm.io/) 8.0 或更高版本
- [Rust](https://www.rust-lang.org/) 1.70 或更高版本（如需开发后端功能）

## 📁 项目结构

```
taiasst-plugin/
├── dist/               # 构建输出目录
├── packages/           # 插件包输出目录
├── plugin-backend/     # Rust 后端代码 (可选)
├── public/             # 静态资源
├── scripts/            # 构建和打包脚本
├── src/                # 前端源代码
│   ├── assets/         # 资源文件
│   ├── App.tsx         # 插件预览入口
│   ├── index.tsx       # 插件主要组件
│   └── main.tsx        # 应用入口
├── .gitignore          # Git 忽略配置
├── package.json        # 项目配置
├── plugin.json         # 插件元数据
├── tsconfig.json       # TypeScript 配置
└── vite.config.ts      # Vite 构建配置
```

## ⚙️ 插件配置

插件的元数据配置在 `plugin.json` 文件中，包括：

```json
{
  "id": "taiasst-plugin-example", // 插件唯一标识
  "name": "示例插件", // 插件名称
  "description": "这是一个示例插件", // 插件描述
  "version": "1.0.0", // 插件版本
  "author": "taiasst开发组", // 插件作者
  "path": "plugin", // 插件路径
  "backendEntry": "plugin.dll", // 后端入口文件
  "hasBackend": true, // 是否包含后端
  "enabled": true, // 是否启用
  "icon": "", // 图标路径
  "category": "", // 插件分类
  "tags": [] // 标签
}
```

## 🔨 开发指南

### 安装依赖

```bash
pnpm install
```

### 前端开发

1. **修改 `src/index.tsx`**：这是插件的主要组件，导出为默认组件。
2. **开发调试**：使用 App.tsx 作为预览环境

```bash
pnpm run dev
```

### 后端开发 (可选)

1. **创建 plugin-backend 目录**：如果需要后端功能
2. **编写 Rust 代码**：实现后端逻辑
3. **将 `hasBackend` 设置为 `true`**：在 plugin.json 中启用后端

## 📦 构建与打包

### 构建前端

```bash
pnpm run build:frontend
```

### 构建后端 (如果有)

```bash
pnpm run build:backend
```

### 完整构建和打包

```bash
pnpm run build:package
```

打包完成后，在 `packages` 目录中可以找到插件包 (zip 格式)。

## 🧩 在 TaiASST 中使用

1. 打开 TaiASST 应用
2. 进入插件管理界面
3. 选择"安装插件"
4. 选择生成的插件包进行安装

## 🤝 贡献指南

欢迎提交问题和改进建议！

## 📄 许可证

本项目采用 [GPLv3 许可证](LICENSE.txt)。
