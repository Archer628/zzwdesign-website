# ZZWDESIGN

独立作品集与管理后台。Next.js 15 / React / Tailwind v4 / Prisma 6 / SQLite / sharp。
本项目原始素材来自同级 zzwdesign-backup；不修改原始资料，不依赖其他项目。

当前完整站点验收状态见 VERIFICATION.md。用户已批准本地端口 33100，前台 http://127.0.0.1:33100/，后台 http://127.0.0.1:33100/admin。GitHub Pages 公开浏览版及更新方法见 [GITHUB_PAGES.md](GITHUB_PAGES.md)；完整 Node 后台仍需服务器部署。

最新首页视觉方案见 DESIGN_UPDATE.md：1600px 上限，居中 Z-DESIGN 磨砂顶部、纯文字左区、等高错位向下循环卡片。首页媒体已按最新要求移除；历史媒体配置及文件保留，后台首页配置只编辑文案。

## 本地

```powershell
npm ci
node scripts/init-local.mjs
npx prisma generate
npm run db:migrate
npm run prepare:content
npm run seed
npm run build
npm run preview
```

固定目录 data/app.db、public/uploads；本地按用户批准使用 127.0.0.1:33100（npm run dev / npm run preview），生产 npm start / PM2 保持 3100。
本地 init-local 生成独立随机管理员密码和签名密钥，保存在被 Git 忽略的 .env。不要分享此文件。
正式值由所有者设置；示例密码不可用于运行。APP_ORIGIN 必须与浏览器访问来源一致。
同一管理员一个会话 cookie，有效期 7 天；更改环境变量密码或签名密钥并重启即可使旧会话失效。

seed 只补充缺失来源标识和设置，保留已有后台编辑。删除来源案例后再次 seed 会重新补入；生产升级不自动 seed。
首次准备素材从原 HTML 的图片顺序出发，根据清单选择最高分辨率，生成 800/1600 WebP。
seed-data/provenance.json 记录来源哈希、图片映射和经用户确认的 Cirsureas 原文冲突。
上传和详情使用相对地址。新上传文件通过专用读取路由提供；无需重建。视频支持 Range。
图文描述为结构化段落/标题/列表，按文本渲染，不执行输入 HTML。

## 验证

```powershell
npm test
npm run typecheck
npm run lint
npm run build
npx tsx scripts/verify-runtime.ts
```

运行 HTTP 测试前启动生产服务器，关闭后台编辑避免与 QA 清理并发。测试使用 QA 命名前缀，仅清理自身记录；保留真实作品。
evidence 保存真实测试结果和截图。测试通过与生产上线分开验收。

## 宝塔首次部署（所有者执行）

1. 在宝塔检查 3100 端口可用，并核对是否已有站点绑定 zzwdesign.cn 或 www.zzwdesign.cn。若已有绑定，停止并记录冲突；不修改既有 WordPress 站点文件或配置。
2. 新建独立目录 /www/wwwroot/zzwdesign，上传并解压 source 和 initial-media 两个包。Windows 的 node_modules、.next、.env 不上传。
3. 安装 Node.js 22 LTS 和 npm，进入该目录执行 npm ci，再执行 npx prisma generate。服务器需 Python 3 用于备份。
4. 从 .env.example 创建 .env。设置 DATABASE_URL="file:../data/app.db"、独立 ADMIN_USER、强 ADMIN_PASSWORD、至少 32 字符随机 SESSION_SECRET、APP_ORIGIN="https://zzwdesign.cn"。保护 .env 文件权限，勿写入部署日志。
5. 创建 data 与 public/uploads 目录并赋予应用运行用户读写权。执行 npm run db:migrate、npm run seed、npm run build。
6. 以同一运行用户执行 pm2 start deploy/ecosystem.config.cjs，再执行 pm2 save，并按 pm2 startup 给出的步骤启用开机恢复。仅运行一个 zzwdesign 进程。
7. 在宝塔新增独立 Nginx 站点，反代到 127.0.0.1:3100；参考 deploy/nginx.conf.example 设置 12m 上传限制。不停止共享 Nginx 服务。先测试 Nginx 配置，再通过面板平滑重载。
8. 阿里云手动添加 A 记录：@ → 110.40.173.214，www → 110.40.173.214。检查是否存在冲突的 A/AAAA/CNAME 记录后再调整；Codex 不操作控制台或使用密钥。
9. 在宝塔为两个域名申请 Let's Encrypt 证书，启用 HTTPS。将 www 以 301 跳转至 https://zzwdesign.cn；后台使用根域名，保持 APP_ORIGIN 一致。
10. 验证首页、九个案例、关于、404、后台登录、上传、发布、设置即时生效和备案链接；检查重启后数据与媒体仍存在。

## 每日备份与恢复

宝塔计划任务，每天 03:00 执行：

```sh
python3 /www/wwwroot/zzwdesign/deploy/backup.py --root /www/wwwroot/zzwdesign --dest /www/backup/zzwdesign
```

先在线备份 SQLite，再复制只增不自动删除的上传文件，执行 integrity_check 并检查每条媒体引用。只保留最近七份验证成功快照；失败副本不算成功并返回非零状态。
请在宝塔开启失败提醒。此备份位于同服务器，可另由所有者增加异地存储。
恢复时：停止 zzwdesign 进程，先保留当前 data 与 uploads，再从选定已验证快照恢复 app.db 和 uploads 至固定目录，确认所有权后重启，仅影响本应用。不要覆盖或恢复到其他应用目录。

## 升级与回滚

升级前执行一次备份。仅上传 source 包，禁止覆盖 .env、data、public/uploads；不要上传 initial-media 包或执行 seed。
在独立临时目录构建并保留当前源码版本；校验依赖和迁移后，短暂停止本应用，替换应用源码与构建产物，保留持久化目录，再启动。
失败时还原上个应用版本；只有迁移确实需要时才按恢复步骤回退数据库，不能用空库解决部署失败。
Node/sharp/Prisma 依赖必须在 Linux 服务器 npm ci，不能从 Windows 复制二进制。

间接依赖 PostCSS 与 deepmerge-ts 通过 package.json overrides 锁定已修复版本；保留 Next.js 15 与 Prisma 6。迁移、类型检查、构建和生产依赖审计已验证。

## 打包

```powershell
node scripts/package.mjs
```

dist/zzwdesign-source.zip：源码、锁文件、迁移、配置、种子文本与说明；不含凭据、业务数据库、上传和 node_modules。
dist/zzwdesign-initial-media.zip：仅首次安装用的真实案例与头像媒体。
dist/manifest.json：包大小及 SHA256。

## Michaels 案例图文升级

首次安装已随初始内容导入新版。已有安装请阅读 [MICHAELS_REFLOW.md](MICHAELS_REFLOW.md) 的定向内容升级步骤；不自动覆盖后台编辑，不自动 seed。

## 其余八个案例图文升级

全部九个案例的首次导入内容已整理。其余八个案例的对应关系、验证证据和已有安装的显式升级步骤见 [REMAINING_CASES.md](REMAINING_CASES.md)。常规版本升级不要运行内容整理脚本或 `prepare:content`；定向升级遇到后台新编辑会停止，保留既有内容。

Apricot App 已进一步重写为体验案例，详见 [APRICOT_STUDY.md](APRICOT_STUDY.md)。已有安装须按当前内容版本选择定向升级，不在新版Apricot上重跑旧八条整理脚本。
