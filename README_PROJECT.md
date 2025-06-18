# Awesome blendviewer Website

一个基于 [awesome-blendviewer](https://github.com/blendviewer/awesome-blendviewer) 数据的精美可视化网站，提供搜索、筛选、排序和多种视图模式。

## ✨ 功能特性

- 🔍 **智能搜索** - 使用 Fuse.js 进行模糊搜索，支持按名称、描述和分类搜索
- 🏷️ **分类筛选** - 下拉菜单形式的分类筛选，显示每个分类的资源数量
- 📊 **多种排序** - 支持按日期、名称、分类排序，升序降序可选
- 👀 **三种视图** - 网格视图、列表视图、紧凑视图
- 📱 **响应式设计** - 完美适配桌面端和移动端
- ⚡ **高性能** - 基于 Next.js 14 和 React 18 构建
- 🎨 **现代 UI** - 使用 shadcn/ui + Tailwind CSS

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看网站。

### 构建生产版本

```bash
npm run build
npm start
# 或
yarn build
yarn start
```

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件**: shadcn/ui + Radix UI
- **搜索**: Fuse.js
- **图标**: Lucide React
- **数据**: 直接解析 README.md 文件

## 📂 项目结构

```
src/
├── app/
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx          # 主页面
├── components/ui/         # shadcn/ui 组件
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── select.tsx
│   └── ...
├── data/
│   └── parser.ts         # Markdown 解析器
└── lib/
    └── utils.ts          # 工具函数
```

## 🎯 核心功能

### 搜索功能

- 使用 Fuse.js 实现模糊搜索
- 支持搜索项目名称、描述、分类
- 实时搜索结果更新

### 筛选功能

- 按分类筛选资源
- 下拉菜单形式，显示每个分类的资源数量
- 支持"全部分类"选项

### 排序功能

- 按日期排序（最新优先/最旧优先）
- 按名称排序（A-Z/Z-A）
- 按分类排序

### 视图模式

- **网格视图**: 卡片式布局，显示完整信息
- **列表视图**: 水平布局，紧凑信息展示
- **紧凑视图**: 小卡片布局，最大化显示数量

## 📊 数据源

网站数据来源于 [awesome-blendviewer](https://github.com/blendviewer/awesome-blendviewer) 项目的 README.md 文件，包含：

- 期刊 - 开源预印本等
- 音乐 - 无版权音乐
- 3D - 3D 打印
- 工具集 - 工具集合
- 摄影集 - 经典老照片
- 艺术馆 - 美术馆等

## 🎨 设计理念

- **简洁明了**: 清晰的布局和导航
- **功能完整**: 搜索、筛选、排序一应俱全
- **响应式**: 完美适配各种设备
- **性能优化**: 虚拟化和懒加载
- **可访问性**: 遵循 WCAG 指南

## 🔧 自定义配置

### 修改数据源

```typescript
// src/app/page.tsx
const response = await fetch('/README.md'); // 修改为你的数据源
```

### 添加新的分类

数据会自动从 README.md 中解析分类，无需手动配置。

### 自定义样式

所有样式都基于 Tailwind CSS，可以在相应组件文件中修改。

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

## 📄 许可证

MIT License

## 🙏 致谢

- [blendviewer](https://www.blendviewer.com/) - 数据源
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库
- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
