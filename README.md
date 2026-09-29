# 2026 国庆厦门游玩规划

这是一份可直接部署到 GitHub Pages 的静态旅行网站，无需安装依赖或运行构建命令。发布时请把整个站点目录中的文件和 `assets/` 文件夹一并上传到仓库根目录。

## 本地预览与测试

在站点目录运行：

```powershell
python -m http.server 8000
```

随后打开 `http://localhost:8000/`。运行纯函数回归测试：

```powershell
node --test tests/*.test.cjs
```

## GitHub Pages 发布

站点文件和完整 `assets/` 位于项目目录。`main` 分支已配置 GitHub 远端；以后每次调整先在本地提交，只有旅行者明确要求时才推送。

右上角的「下载 PDF」下载 `assets/xiamen-itinerary-2026.pdf`。精简离线版仅收录五日地图、每日时间线、对应景点的简短介绍与当日实景图；包括厦大未入校和雨天备选安排。共9幅地图，所有手绘地图明确标为插画。PDF 不包含美食卡片、游客测评、每日交通说明、“这一段，怎么走”章节或摄影署名，也不含超链接、表单和交互按钮。修改网站行程后重新生成：

```powershell
python scripts/build-complete-pdf.py
python scripts/check-guide-pdf.py
```

生成脚本需要 Python 的 `reportlab`、`Pillow`、`pypdf`，校验另需 `pdfplumber`，以及 Windows 的微软雅黑字体。地图导出使用 Node.js、Playwright 与本机 Edge（可用 `PDF_BROWSER_CHANNEL` 指定其他已安装的 Chromium 通道）。脚本优先使用本地 Playwright，其次使用 Codex 自带依赖；不会安装依赖。它通过临时的本地静态服务读取同一份网站数据并渲染现有地图，缓存与核对报告写入 `.cache/pdf/`，不提交缓存。两个兼容旧版的 PDF 生成入口也会输出当前精简版。

生成后需要用 Poppler 渲染全部页面进行目视检查；核对脚本检查行程与景点说明、照片覆盖、地图数量、字体嵌入、无交互注释和文字边界。更新下载链接中的版本号后，在手机与桌面浏览器点击下载并核对文件哈希。

## 内容维护

- 地图点位与路线在 `map-data.js`，总览与每日地图由 `map-atlas-v2.js` / `map-atlas-v2.css` 绘制，复用同一套手绘地标与曲线。连线放在地标下层，遮罩给插画和名称留出空白。彩色线表示游玩先后，虚线表示轮渡。地图不调用在线瓦片或地图密钥。
- 每段交通方式、路径、参考耗时和依据链接位于 `map-transit.js`；步行和打车时间为规划估算，不是实时路况。地图编号与交通段保持一致，重复到访的酒店或码头显示双编号。厦大备选切换同时更新点位、连线和交通卡片。
- `assets/xiamen-overview-watercolor.png` 是用户提供的总览水彩地图底图，`assets/xiamen-landmark-reference.png` 是用户提供的手绘地标缩略图来源。整体为方位示意，不可用于导航。`assets/xiamen-map-base.png` 和四张 `xiamen-*-scene.png` 为每日地图的 AI 装饰画；它们不是实拍或地理数据。景点实拍仍可在每日地图点位详情中查看。发布时务必完整上传 `assets/` 文件夹。
- 图片路径经 `image-path.js` 统一解析。本地素材放在 `assets/`；更新后保留同名或一并修改数据记录。餐饮卡片图片若未载入，会显示匹配图片不可用的提示，不会串用其他菜品照片。
- 每日行程、美食卡片和日期联动逻辑位于 `app.js`；地图绘制与点位详情位于 `map-atlas-v2.js`。`map-ui.js` 是未被当前页面加载的旧版实现。
- 景点开放、轮渡与夜游班次、餐饮营业及海鲜时价均可能变化，出行前以当日现场信息为准。

网站与完整下载版 PDF 均包含旅行者提供的两张动车票原图，分别收录于去程和返程日期，保留原票面信息。
