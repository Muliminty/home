# GitHub Pages 部署说明

## 🎯 已完成的配置

### 1. GitHub Actions 工作流
已创建 `.github/workflows/deploy.yml`，配置了自动化构建和部署流程。

**工作流触发条件：**
- 推送到 `main` 分支时自动触发
- Pull Request 时也会运行（仅构建，不部署）

**工作流步骤：**
1. ✅ Checkout 代码
2. ✅ 设置 Node.js 环境（版本 20）
3. ✅ 安装依赖（`npm ci`）
4. ✅ 构建项目（`npm run build`）
5. ✅ 上传构建产物到 GitHub Pages

### 2. README 更新
已在 README.md 中添加部署说明文档。

## 🚀 首次部署步骤

### 方式一：通过 GitHub 网页界面（推荐）

1. 访问仓库设置页面：
   ```
   https://github.com/Muliminty/home/settings/pages
   ```

2. 配置构建和部署：
   - **Source**: 选择 **"GitHub Actions"**
   - 保存设置

3. 触发首次部署：
   - 推送任意更改到 main 分支
   - 或手动运行 Actions 中的工作流

### 方式二：已自动触发

由于我们刚刚推送了代码，首次部署可能已经自动开始。

## 📊 查看部署状态

1. 访问 Actions 页面：
   ```
   https://github.com/Muliminty/home/actions
   ```

2. 点击最新的 workflow run 查看进度

3. 等待部署完成（通常 2-3 分钟）

## 🌐 访问你的网站

部署完成后，网站将在以下地址可用：
```
https://muliminty.github.io/home/
```

**注意**：
- 首次部署可能需要几分钟
- 如果仓库是私有仓库，需要使用 GitHub Pro 才能使用 GitHub Pages
- 如果域名是自定义的，请在仓库 Settings → Pages 中配置自定义域名

## 🔄 后续部署

### 自动部署
每次推送到 main 分支都会自动触发部署：
```bash
git add .
git commit -m "你的更新"
git push origin main
```

### 手动触发部署
1. 访问 Actions 页面
2. 选择 "Deploy to GitHub Pages" 工作流
3. 点击 "Run workflow"
4. 选择分支并点击 "Run workflow"

## ⚙️ 配置说明

### 仓库设置
- 仓库名：`home`
- 主分支：`main`
- Pages 来源：GitHub Actions

### 构建配置
- Node 版本：20
- 构建命令：`npm run build`
- 构建输出：`dist/` 目录

### 部署配置
- 部署环境：GitHub Pages
- 部署目录：`dist/`
- 部署方式：GitHub Actions

## 🐛 常见问题

### 1. 部署失败
**问题**：Actions 中显示错误
**解决**：
- 检查构建日志中的错误信息
- 确保所有依赖都已正确安装
- 检查 Node 版本是否兼容

### 2. 网站404
**问题**：访问网站显示 404
**解决**：
- 等待几分钟让 CDN 缓存更新
- 检查 Actions 中的部署是否成功
- 确认 Pages 设置正确（Source 应为 GitHub Actions）

### 3. 样式丢失
**问题**：网站显示但样式错误
**解决**：
- 检查 `vite.config.js` 中的 `base` 配置
- 如果部署在子路径下，需要设置正确的 base path

### 4. 路由问题
**问题**：刷新页面404
**解决**：
- 确保使用 Hash Router 或配置服务器重定向
- 或部署到根路径而不是子路径

## 📝 更新记录

- **2024-01-XX**: 初始配置 GitHub Actions 部署流程
- 配置自动化构建和部署
- 更新文档说明

## 🔗 相关链接

- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)

---

**⭐ 提示**：部署成功后，可以在仓库主页的 About 部分添加网站链接，让更多人访问你的网站！

