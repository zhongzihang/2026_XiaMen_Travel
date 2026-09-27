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

右上角的「下载 PDF」直接下载 `assets/xiamen-itinerary-2026.pdf`，内容涵盖路线总览、每日地图与实景图、按地点整理的美食和出门提示。行程或美食改动后重新生成：

```powershell
python scripts/build-itinerary-pdf.py
```

生成脚本需要 `reportlab` 和 Windows 系统的 `SimHei` 字体。

## 内容维护

- 地图点位与路线在 `map-data.js`，总览与每日地图由 `map-atlas-v2.js` / `map-atlas-v2.css` 绘制，复用同一套手绘地标与曲线。连线放在地标下层，遮罩给插画和名称留出空白。彩色线表示游玩先后，虚线表示轮渡。地图不调用在线瓦片或地图密钥。
- 每段交通方式、路径、参考耗时和依据链接位于 `map-transit.js`；步行和打车时间为规划估算，不是实时路况。地图编号与交通段保持一致，重复到访的酒店或码头显示双编号。厦大备选切换同时更新点位、连线和交通卡片。
- `assets/xiamen-overview-watercolor.png` 是用户提供的总览水彩地图底图，`assets/xiamen-landmark-reference.png` 是用户提供的手绘地标缩略图来源。整体为方位示意，不可用于导航。`assets/xiamen-map-base.png` 和四张 `xiamen-*-scene.png` 为每日地图的 AI 装饰画；它们不是实拍或地理数据。景点实拍仍可在每日地图点位详情中查看。发布时务必完整上传 `assets/` 文件夹。
- 图片路径经 `image-path.js` 统一解析。本地素材放在 `assets/`；更新后保留同名或一并修改数据记录。餐饮卡片图片若未载入，会显示匹配图片不可用的提示，不会串用其他菜品照片。
- 每日行程、美食卡片和日期联动逻辑位于 `app.js`；地图绘制与点位详情位于 `map-atlas-v2.js`。`map-ui.js` 是未被当前页面加载的旧版实现。
- 景点开放、轮渡与夜游班次、餐饮营业及海鲜时价均可能变化，出行前以当日现场信息为准。

网站包含旅行者提供的动车票原图。若使用公开 GitHub Pages，请确认愿意公开票面上的个人信息；下载版 PDF 不含票图。
