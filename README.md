# 锦书简历

锦书简历是一个在线简历制作工具，用户可以通过简单的表单输入个人信息，实时预览简历效果，并支持将简历导出为PDF格式。

## 项目特点

- 直观的表单输入界面
- 实时预览简历效果
- 多种简历模板选择
- 支持导出为PDF格式
- 响应式设计，支持移动端和桌面端

## 项目结构

```
src/
├── assets/           # 静态资源
├── components/       # 组件
│   ├── Form/         # 表单组件
│   ├── Preview/      # 预览组件
│   └── UI/           # UI通用组件
├── contexts/         # Context状态管理
├── templates/        # 简历模板
├── utils/            # 工具函数
├── App.js            # 应用主组件
└── index.js          # 入口文件
```

## 开发环境配置

本项目使用以下技术栈：

- React.js
- Ant Design
- Styled Components
- Formik + Yup
- React Router
- Less
- Craco

## 安装和运行

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm start
```

### 构建生产版本

```bash
pnpm build
```

## 使用说明
1. 在左侧表单区域填写个人信息
2. 实时预览右侧简历效果
3. 选择喜欢的模板样式
4. 点击导出按钮生成PDF文件
