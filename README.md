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

把 `index.html`、`styles.css`、`app.js`、`map-geometry.js`、`image-path.js`、`map-data.js`、`map-ui.js`、`credits.html` 和完整 `assets/` 上传到仓库根目录。在仓库的 **Settings → Pages** 选择 **Deploy from a branch**、`main` 和 `/ (root)`，保存后等待 Pages 地址生成。

## 内容维护

- 地图点位与路线在 `map-data.js`，总览上的视觉坐标在 `map-ui.js` 中按用户提供的水彩地图做了近似校准。彩色线表示游玩先后，不是导航轨迹。地图不调用在线瓦片或地图密钥。
- `assets/xiamen-overview-watercolor.png` 是用户提供的总览水彩地图底图，`assets/xiamen-landmark-reference.png` 是用户提供的手绘地标缩略图来源。整体为方位示意，不可用于导航。`assets/xiamen-map-base.png` 和四张 `xiamen-*-scene.png` 为每日地图的 AI 装饰画；它们不是实拍或地理数据。景点实拍仍可在每日地图点位详情中查看。发布时务必完整上传 `assets/` 文件夹。
- 图片路径经 `image-path.js` 统一解析。本地素材放在 `assets/`；更新后保留同名或一并修改数据记录。餐饮卡片图片若未载入，会显示匹配图片不可用的提示，不会串用其他菜品照片。
- 每日行程、美食卡片和日期联动逻辑位于 `app.js`；地图绘制与点位详情位于 `map-ui.js`。
- 景点开放、轮渡与夜游班次、餐饮营业及海鲜时价均可能变化，出行前以当日现场信息为准。

网站包含旅行者提供的动车票原图。若使用公开 GitHub Pages，请先确认愿意公开票面上的个人信息。当前交付只更新网站，不制作或更新 PDF。
