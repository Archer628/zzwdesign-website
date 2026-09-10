# GitHub Pages 浏览版

网址：https://archer628.github.io/zzwdesign-website/

`zzwdesign-current` 保存当前完整项目源码；`gh-pages` 保存静态官网；原 `main` 保留，避免影响其 v0 部署。

Pages 只提供首页、关于我、案例列表及发布时已上架的案例。首页动效在浏览器运行。Admin、SQLite、登录和上传接口需要 Node 服务器，不在 Pages 上运行。后台修改后需重新导出和发布。

## 重新导出

```sh
npm ci
npx prisma generate
# 使用仓库中的公开快照，无需数据库或管理员凭据
node scripts/export-pages.mjs
# 在原完整项目中：从当前数据库刷新公开内容和图片，再构建
node scripts/export-pages.mjs --snapshot
```

产物路径记录于 `dist/pages-export.json` 的 `output`。将该目录的全部文件（含 `.nojekyll`）提交到 `gh-pages` 根目录。仓库 Settings → Pages → Deploy from a branch，选择 `gh-pages` / root。

`pages-data` 仅包含已发布作品、公开个人介绍和被这些内容引用的媒体；不包含数据库、管理员账户、签名密钥或 `.env`。完整 Node 版本的部署步骤仍见 README / deploy。

构建使用隔离目录，不修改本地正在预览的 `.next`。GitHub Pages 项目路径固定为 `/zzwdesign-website`。
