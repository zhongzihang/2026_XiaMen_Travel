# 国庆厦门游玩规划：全程总览与每日手绘地图 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 改造国庆厦门静态网站地图，让同伴先看清五日总体路线，再在每日行程中查看仅含当天点位的手绘放大图，并通过地图点位打开对应景点实拍。

**Architecture:** 保持纯静态 HTML/CSS/JavaScript/SVG。新增可测试的路线筛选与 SVG 视窗裁切函数；地图 UI 分成全程总览与每日放大两种视图；每日地图只根据当天路线边端点创建点位。将 ImageGen 生成的本地水彩底纹置于坐标矢量地图下方，所有海岸、道路、路线、圈选和坐标点仍由代码绘制。

**Tech Stack:** 原生 JavaScript、HTML、CSS、SVG、Node.js 内置 `node:test`，不增加 npm 依赖或运行时地图服务。

**Spec:** `docs/superpowers/specs/2026-09-25-xiamen-guide-map-overview-daily-design.md`

## Global Constraints

- 保持纯静态 GitHub Pages 架构；不增加外部运行依赖、在线地图服务调用、API 密钥或构建步骤。
- 继续复用 `map-data.js` 中的 GCJ-02 近似点位与按日期路线，不重新采集或臆造精确坐标。
- 路线彩线表示游玩顺序，不表示经核验的步行道路或导航轨迹；东渡至三丘田单独用海上渡轮线表示。
- 每日点位过滤基于路线边中出现的 ID，而非点位的 `days` 标签或 `view` 分类。
- 10 月 2 日未入厦大路线不显示厦大点位；10 月 1 日显示东渡→三丘田渡轮段。
- 使用本地 `assets/xiamen-map-base.png` 作为低对比度装饰底纹；它不提供地图、道路、海岸或地标的定位依据。
- 不改动车票原图、已定交通和行程信息，不更新 PDF 或美食章节，不增加实地导航链接。
- 当前站点目录不是 Git 仓库；不初始化 Git，也不安排提交步骤。

## Review Focus

- 重复起终点与跳过厦大的可选路线不得造成重复图钉或跨日点位泄漏；Task 2、Task 5 覆盖。
- 单点/紧凑路线的裁切窗口必须留出可读空间且不裁点；Task 1 覆盖。
- 鼓浪屿/厦门岛分图后，渡轮端点仍可看懂且不得当作陆路步行段；Task 4、Task 5 覆盖。
- 生成底纹失载或对比度偏高时，坐标矢量、路线与标签仍需可读；Task 6、Task 7 覆盖。
- 浏览器交互需要保证日圈正确选中并滚动、照片损坏时有提示、酒店/车站不串用景点照，且 390px 窄屏无横向溢出；Task 5、Task 7 覆盖。

---

## 文件职责

- `map-geometry.js`：保留当前经纬度投影函数，增加围绕每日路线点集合计算 SVG 裁切窗口的纯函数，并向浏览器和 CommonJS 导出。
- `map-data.js`：增加按日期取得路线边、路线顺序点位 ID、路线端点 POI 列表的纯函数；未入厦大时重连相邻路线边。
- `tests/map-geometry.test.cjs`：验证每日视窗宽高、范围内点位完整性、边界与单点输入。
- `tests/map-data.test.cjs`：验证五天的路线点位集合、路线端点去重、10 月 2 日跳过厦大及不纳入无关背景点。
- `map-ui.js`：实现全程总览 SVG、日期范围圈与酒店/厦门站符号；实现只绘制当天路线点位的局部地图和点位实拍详情。
- `app.js`：在每个日期面板中生成地图/详情容器；保留纵向日程链；删除独立的每日实拍图网格及已废弃的旧地图渲染逻辑；联动总览圈选与日期面板。
- `index.html`：将地图章节改为全程总览，扩展图例并更新脚本/样式版本号；每日放大地图由 `app.js` 放入对应行程面板。
- `styles.css`：设计总览图、分日手绘地图、图例、点位详情和窄屏排列；以低对比度方式呈现生成底纹。
- `assets/xiamen-map-base.png`：收录已经生成并审阅的本地水彩底纹（当前候选在 `D:\workspace\xiamen-map-base.png`）；不保留有虚构海岸/道路细节的第一张候选。
- `assets/xiamen-gulangyu-scene.png`、`xiamen-coast-scene.png`、`xiamen-garden-cableway-scene.png`、`xiamen-oldtown-scene.png`：每日地图下的透明 AI 地标插画底层；它们装饰地图但不是实拍或坐标来源。
- `credits.html`、`README.md`：标注底纹为 AI 生成的装饰素材，并说明地图坐标近似、路线不作导航、GitHub Pages 需上传完整 `assets/`。
- `D:\workspace\xiamen-guide-site-native-pages-v2.zip`：最终网站源码交付包，包含完整网站目录和本地素材。

## 实施任务

### Task 1：增加每日地图视窗裁切函数

**Files:**
- Modify: `map-geometry.js`
- Test: `tests/map-geometry.test.cjs`

**Interface:**
- `fitViewBox(points, bounds, viewport, options = {}) -> { x, y, width, height }`
- `points` 为至少一个 `{lat, lng}` 对象；`bounds` 使用现有 `{north, south, east, west}`；`viewport` 使用已有 `{width, height, padding}`；`options` 为 `{paddingPx, minWidth, minHeight}`。
- 函数先调用现有 `projectPoint` 取得 SVG 基准坐标，再围绕全部点计算带留白且保持 `viewport.width / viewport.height` 比例的裁切框；裁切框钳制在完整底图内，宽高不超过完整视图。
- 空数组、非有限尺寸、越界点、负留白或非正最小尺寸抛出 `RangeError`。

- [x] **Step 1: 写视窗裁切的失败测试**

在 `tests/map-geometry.test.cjs` 添加：

```js
// Replace the existing import at the top of this test file.
const { projectPoint, fitViewBox } = require('../map-geometry.js');

test('fits a zoomed view around route points without cropping any point', () => {
  const points = [{ lat: 24.46, lng: 118.08 }, { lat: 24.45, lng: 118.09 }];
  const view = { width: 800, height: 600, padding: 20 };
  const crop = fitViewBox(points, bounds, view, { paddingPx: 50, minWidth: 180, minHeight: 140 });
  assert.ok(crop.width < view.width);
  assert.ok(crop.height < view.height);
  assert.ok(crop.x >= 0 && crop.y >= 0);
  assert.ok(crop.x + crop.width <= view.width && crop.y + crop.height <= view.height);
  for (const point of points) {
    const projected = projectPoint(point, bounds, view);
    assert.ok(projected.x >= crop.x && projected.x <= crop.x + crop.width);
    assert.ok(projected.y >= crop.y && projected.y <= crop.y + crop.height);
  }
  assert.ok(Math.abs(crop.width / crop.height - view.width / view.height) < 1e-9);
});

test('keeps a one-point route readable and rejects invalid crop inputs', () => {
  const view = { width: 800, height: 600, padding: 20 };
  const crop = fitViewBox([{ lat: 24.45, lng: 118.1 }], bounds, view,
    { paddingPx: 30, minWidth: 180, minHeight: 140 });
  assert.ok(crop.width >= 180 && crop.height >= 140);
  assert.throws(() => fitViewBox([], bounds, view), RangeError);
  assert.throws(() => fitViewBox([{ lat: 25, lng: 118.1 }], bounds, view), RangeError);
  assert.throws(() => fitViewBox([{ lat: 24.45, lng: 118.1 }], bounds, view,
    { paddingPx: -1 }), RangeError);
});
```

- [x] **Step 2: 运行测试确认先失败**

Run: `node --test tests/map-geometry.test.cjs`
Expected: FAIL，提示 `fitViewBox` 未定义。

- [x] **Step 3: 实现视窗拟合并保持原有投影 API**

在 `map-geometry.js` 工厂函数内增加 `fitViewBox`。实现轮廓：

```js
function fitViewBox(points, bounds, viewport, options = {}) {
  const { paddingPx = 56, minWidth = 180, minHeight = 140 } = options;
  if (!Array.isArray(points) || points.length === 0 ||
      !Number.isFinite(paddingPx) || paddingPx < 0 ||
      !Number.isFinite(minWidth) || minWidth <= 0 ||
      !Number.isFinite(minHeight) || minHeight <= 0) {
    throw new RangeError('Invalid route points or viewBox options');
  }
  const xy = points.map(point => projectPoint(point, bounds, viewport));
  const xs = xy.map(point => point.x), ys = xy.map(point => point.y);
  const ratio = viewport.width / viewport.height;
  let width = Math.max(Math.max(...xs) - Math.min(...xs) + paddingPx * 2, minWidth);
  let height = Math.max(Math.max(...ys) - Math.min(...ys) + paddingPx * 2, minHeight);
  if (width / height < ratio) width = height * ratio;
  else height = width / ratio;
  const scale = Math.min(1, viewport.width / width, viewport.height / height);
  width *= scale;
  height *= scale;
  const x = Math.max(0, Math.min(viewport.width - width,
    (Math.min(...xs) + Math.max(...xs) - width) / 2));
  const y = Math.max(0, Math.min(viewport.height - height,
    (Math.min(...ys) + Math.max(...ys) - height) / 2));
  return { x, y, width, height };
}
```

Export it alongside `projectPoint` from both browser global and CommonJS API. Preserve the same `RangeError` behavior for invalid geographic inputs as `projectPoint`.

- [x] **Step 4: 运行地图几何测试**

Run: `node --test tests/map-geometry.test.cjs`
Expected: 原有投影测试和新增的两项视窗测试全部通过。

### Task 2：建立严格的按日路线点位助手

**Files:**
- Modify: `map-data.js`
- Test: `tests/map-data.test.cjs`

**Interfaces:**
- `routeForDay(data, dayKey, { skipXmu = false } = {}) -> RouteEdge[]`
- `routePointIds(edges) -> string[]`，按路线顺序返回去重后的点位 ID。
- `pointsForRoute(data, edges) -> MapPoint[]`，只返回路线边的起终点对应 POI。

- [x] **Step 1: 写失败测试**

```js
// Replace the existing two map-data imports with this one.
const { validateMapData, data, routeForDay, routePointIds, pointsForRoute } = require('../map-data.js');

test('returns only POIs referenced by the selected day route', () => {
  const edges = routeForDay(data, '2026-10-03');
  const ids = routePointIds(edges);
  assert.deepEqual(ids, ['hotel', 'botanic', 'cable', 'bashi']);
  assert.deepEqual(new Set(pointsForRoute(data, edges).map(point => point.id)), new Set(ids));
  assert.ok(!ids.includes('nanputuo'));
});

test('removes Xiamen University and reconnects the no-lottery route', () => {
  const edges = routeForDay(data, '2026-10-02', { skipXmu: true });
  const ids = routePointIds(edges);
  assert.deepEqual(ids, ['hotel', 'nanputuo', 'baicheng', 'shapowei', 'heping']);
  assert.ok(!edges.some(edge => edge.from === 'xmu' || edge.to === 'xmu'));
  assert.deepEqual(edges.at(-1), { from: 'heping', to: 'hotel', type: 'visit' });
});

test('deduplicates a route endpoint without deleting the closing route edge', () => {
  const edges = routeForDay(data, '2026-10-02');
  assert.equal(routePointIds(edges).filter(id => id === 'hotel').length, 1);
  assert.deepEqual(edges.at(-1), { from: 'heping', to: 'hotel', type: 'visit' });
});
```

将现有两条 `map-data.js` 导入替换成上面的单条导入，避免重复声明 `data` 与 `validateMapData`。

- [x] **Step 2: 运行新增测试确认失败**

Run: `node --test tests/map-data.test.cjs`
Expected: FAIL，提示路线助手导出缺失。

- [x] **Step 3: 实现三个纯数据助手**

`routePointIds` 以首条边的 `from` 加所有 `to` 构造有序去重列表。`pointsForRoute` 仅按这组 ID 从 `data.points` 取记录。`routeForDay` 返回原始路线副本；`skipXmu` 为真时移除 `xmu` 后把相邻 ID 重新连接为 `visit` 边：

```js
function routePointIds(edges) {
  if (!Array.isArray(edges) || edges.length === 0) return [];
  return [...new Set([edges[0].from, ...edges.map(edge => edge.to)])];
}

function pointsForRoute(data, edges) {
  const ids = new Set(routePointIds(edges));
  return data.points.filter(point => ids.has(point.id));
}

function routeForDay(data, dayKey, { skipXmu = false } = {}) {
  const edges = [...(data.routes[dayKey] || [])];
  if (!skipXmu) return edges;
  const ids = routePointIds(edges).filter(id => id !== 'xmu');
  return ids.slice(1).map((to, index) => ({ from: ids[index], to, type: 'visit' }));
}
```

将三项函数并入 `XiamenMapDataTools` 和 `module.exports` 暴露的同一 API。数据对象本身保持不变。

- [x] **Step 4: 运行地图数据测试**

Run: `node --test tests/map-data.test.cjs`
Expected: 现有 POI 校验与新增按日过滤测试全部通过。

### Task 3：将生成底纹纳入网站资源

**Files:**
- Create: `assets/xiamen-map-base.png`（从 `D:\workspace\xiamen-map-base.png` 复制，不覆盖已有同名文件）
- Modify: `credits.html`
- Modify: `README.md`

- [x] **Step 1: 确认目标不存在并复制经审阅底纹**

Run in `D:\workspace\output\xiamen-guide-site`:

```powershell
if (Test-Path -LiteralPath 'assets\xiamen-map-base.png') {
  throw 'Refusing to overwrite an existing map texture.'
}
Copy-Item -LiteralPath 'D:\workspace\xiamen-map-base.png' -Destination 'assets\xiamen-map-base.png'
Get-Item 'assets\xiamen-map-base.png' | Select-Object FullName,Length
```

Expected: 文件位于站点 `assets/` 下且长度大于 100 KB。若目录权限仍拒绝复制，不以远程图片 URL 或生成目录路径替代；先对这个精确目标申请文件访问，再继续。

- [x] **Step 2: 标注生成图片的性质与使用限制**

在 `credits.html` 素材清单中加入“厦门地图水彩底纹 · AI 生成，装饰用途”；在 `README.md` 的地图维护说明中写明底纹不表示地理位置，必须和网站一同上传 `assets/`。保留现有素材说明，不改其他条目。

- [x] **Step 3: 检查本地资源被正确收录**

Run: `Get-Item assets\xiamen-map-base.png | Select-Object Name,Length`
Expected: 站点内有该文件，后续地图 SVG 仅引用 `assets/xiamen-map-base.png`。

### Task 4：实现全程总览图与每日范围圈

**Files:**
- Modify: `map-data.js`
- Modify: `map-ui.js`
- Modify: `index.html`

**Interface:** `XiamenMapUI` 暴露 `renderOverview()`、`renderDay(dayIndex)`、`selectPoint(pointId)`；浏览器其他模块通过 `window.XiamenMapUI` 使用这些方法，不复制地图数据或重新维护日期表。

- [x] **Step 1: 先为总览圈选构建一个纯模型测试**

在 `map-data.js` 增加 `overviewRoutes(data, { skipXmuDayKey = null } = {})`，返回 `[{ dayKey, edges, points }]`，其中 `points` 由 `pointsForRoute` 生成；当 `dayKey === skipXmuDayKey` 时使用未入厦大路线。为测试添加：

```js
test('overview model contains each daily route once and has no dangling POIs', () => {
  const groups = overviewRoutes(data);
  assert.deepEqual(groups.map(group => group.dayKey), Object.keys(data.routes));
  for (const group of groups) {
    const ids = new Set(group.points.map(point => point.id));
    for (const edge of group.edges) {
      assert.ok(ids.has(edge.from));
      assert.ok(ids.has(edge.to));
    }
  }
  const alternate = overviewRoutes(data, { skipXmuDayKey: '2026-10-02' });
  const coast = alternate.find(group => group.dayKey === '2026-10-02');
  assert.ok(!coast.points.some(point => point.id === 'xmu'));
  assert.deepEqual(coast.edges.at(-1), { from: 'heping', to: 'hotel', type: 'visit' });
});
```

- [x] **Step 2: 运行测试确认失败，再实现并运行通过**

Run: `node --test tests/map-data.test.cjs`
Expected first run: FAIL，`overviewRoutes` 未定义。实现：

```js
function overviewRoutes(data, { skipXmuDayKey = null } = {}) {
  return Object.entries(data.routes).map(([dayKey]) => {
    const edges = routeForDay(data, dayKey, { skipXmu: dayKey === skipXmuDayKey });
    return { dayKey, edges, points: pointsForRoute(data, edges) };
  });
}
```

将测试文件的数据导入更新为：

```js
const { validateMapData, data, routeForDay, routePointIds, pointsForRoute, overviewRoutes } = require('../map-data.js');
```

重新运行，预期所有测试 PASS。

- [x] **Step 3: 用独立容器替换旧日期地图工具条**

在 `index.html` 的 `#map` 中保留总览图容器 `#routeOverview`，移除顶部 `#mapFilters`、`#routeMap`、`#mapSequence` 和共享 `#mapDetail`。地图图例放在 `#routeOverview` 下方，明确列出景点、住宿、厦门站、当日路线、渡轮、当日圈选范围。

```html
<div class="map-panel">
  <div id="routeOverview" class="route-overview" aria-label="厦门五日游全程地理方位总览"></div>
  <div class="map-legend" id="mapLegend" aria-label="地图图例">
    <span><i class="legend-dot attraction"></i>景点</span>
    <span><i class="legend-dot hotel"></i>住宿</span>
    <span><i class="legend-dot station"></i>厦门站</span>
    <span><i class="legend-line"></i>游玩顺序</span>
    <span><i class="legend-ferry"></i>渡轮段</span>
    <span><i class="legend-ring"></i>每日范围</span>
  </div>
</div>
```

总览 SVG 使用现有主图边界投影全程点位与各日路线。按日期为路线 POI 生成虚线圈选区域；按 `point.view` 拆分鼓浪屿和厦门岛范围，10 月 1 日的两组范围使用同一颜色和日期序号，并保留单独虚线渡轮边。唯一地点标记合并共享 POI，酒店与厦门站使用不同的内嵌 SVG 符号。日期圈使用 `<g data-overview-day="0">` 至 `<g data-overview-day="4">`，显示日期和序号并支持 Enter/Space。总览圈选使用 `overviewRoutes`，厦大备选切换后同步移除总览里的厦大路线端点。圈的中心由同一日同一 `view` 的 POI 投影坐标平均值计算，半径取相对中心最大距离再加固定留白：

```js
function overviewZone(points, color, dayIndex, view) {
  if (points.length === 0) return '';
  const xy = points.map(point => projectPoint(point, data.mainBounds, overviewView));
  const cx = xy.reduce((sum, point) => sum + point.x, 0) / xy.length;
  const cy = xy.reduce((sum, point) => sum + point.y, 0) / xy.length;
  const rx = Math.max(42, ...xy.map(point => Math.abs(point.x - cx) + 28));
  const ry = Math.max(34, ...xy.map(point => Math.abs(point.y - cy) + 24));
  return `<g class="overview-day-zone" style="color:${color}" data-overview-day="${dayIndex}" data-view="${view}" role="button" tabindex="0" aria-label="查看${dayList[dayIndex].label}路线"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" stroke="${color}"/></g>`;
}
```

- [x] **Step 4: 实现总览日期圈选择事件**

日期圈被点击或按键激活时发送：

```js
window.dispatchEvent(new CustomEvent('xiamen:map-daychange', {
  detail: { dayIndex, scrollIntoView: true }
}));
```

总览只做全程浏览与日期选择，不显示单独景点照片卡；景点详情由每日地图点位开启。

- [x] **Step 5: 检查总览 SVG DOM 与路由模型**

Run: `node --test tests/map-data.test.cjs`
Expected: 五天都能生成有效总览路线组；总览显示所有行程 POI，但不额外添加参考图内未安排的地点。

### Task 5：把当天放大地图和实拍详情嵌入每日行程

**Files:**
- Modify: `map-ui.js`
- Modify: `app.js`
- Modify: `tests/map-data.test.cjs`

**Interfaces:**
- 每个 `#day-N` 面板生成 `#day-map-N` 与 `#day-map-detail-N` 两个容器。
- 10 月 1 日另生成 `#day-island-map-N`，只用于鼓浪屿局部放大；仅跨岛行程显示渡轮连接条。
- `renderDay(dayIndex)` 根据 `routeForDay`、`routePointIds`、`pointsForRoute` 仅绘制当天路线端点，并使用 `fitViewBox` 对当天 POI 投影位置裁切基准 SVG。
- `selectPoint(pointId)` 只接受当前当日路线中的可查看景点 POI，不允许打开其他日期详情。

- [x] **Step 1: 固定每天的路线端点筛选测试**

在 `tests/map-data.test.cjs` 明确验证五天路线的 ID 集合：

```js
const expected = {
  '2026-09-30': ['station', 'hotel'],
  '2026-10-01': ['hotel', 'dongdu', 'sanqiutian', 'longtou', 'shuzhuang', 'rock'],
  '2026-10-02': ['hotel', 'nanputuo', 'xmu', 'baicheng', 'shapowei', 'heping'],
  '2026-10-03': ['hotel', 'botanic', 'cable', 'bashi'],
  '2026-10-04': ['hotel', 'baijia', 'station']
};
for (const [dayKey, ids] of Object.entries(expected)) {
  assert.deepEqual(routePointIds(routeForDay(data, dayKey)), ids);
}
```

- [x] **Step 2: 运行测试并确认五日点位集合**

Run: `node --test tests/map-data.test.cjs`
Expected: 每天的实际路由端点集合与表格一致，跳过厦大测试仍排除 `xmu`。

- [x] **Step 3: 在每日地图 SVG 中使用同一基准坐标系裁切**

日图不要把 POI 换算到新范围后叠到固定海岸图形上。保留 `mainBounds`/`islandBounds` 的基准投影，先将路线 POI 投影到原 SVG，再用 `fitViewBox` 设置 `<svg viewBox="x y width height">`，这样手绘海岸、道路、底纹和 POI 一起放大，不会错位。

```js
const routeEdges = routeForDay(data, day.key, { skipXmu });
const routePoints = pointsForRoute(data, routeEdges);
const mainland = routePoints.filter(point => point.view === 'main');
const island = routePoints.filter(point => point.view === 'island');
const mainCrop = fitViewBox(mainland, data.mainBounds, mainView,
  { paddingPx: 56, minWidth: 220, minHeight: 180 });
const islandCrop = island.length
  ? fitViewBox(island, data.islandBounds, islandView, { paddingPx: 42, minWidth: 150, minHeight: 180 })
  : null;
const ferryEdges = routeEdges.filter(edge => edge.type === 'ferry');
```

主图裁切只覆盖 `mainland` 点位，岛图裁切只覆盖 `island` 点位；两图之间用独立渡轮连接条展示 `ferryEdges` 的准确码头名称和 10:30 时刻，不在任一局部投影里拉一条跨图直线。只将两组当天 route ID 对应的记录传给标记渲染；每日图不得再用 `data.points.filter(point => point.view === 'main')` 或同类全量上下文过滤。

- [x] **Step 4: 绘制日路线、站点图标和可交互景点点位**

按路线边顺序为可游览点位编号；厦门岛地图和鼓浪屿地图之间若有 `ferryEdges`，显示可读的海上渡轮连接条而非把它画成陆上路径。内嵌自绘小屋图标表示酒店、火车图标表示厦门站；基础设施图标显示标签但不冒用景点照片。普通景点、码头等有对应素材的可查看 POI 使用 `button` 语义、键盘 Enter/Space 和可触控的命中范围。

- [x] **Step 5: 将详情卡绑定当前每日地图，并删除独立日照片网格**

在点击景点后只更新当前 pane 的 `#day-map-detail-N`：照片取自当前点位 `photo`；成功加载显示图、景点名、地址/精度、游玩说明；`error` 时隐藏裂图并显示“实拍暂不可用”。点击成功加载的照片仍打开现有 `photoDialog`。点位不在 `routePointIds(routeEdges)` 中时 `selectPoint` 直接返回。

在 `app.js` 的 `renderDays()` 每个面板里新增当天地图区，移除“沿途实拍”标题和 `.photo-grid`。删除 `app.js` 中已无调用者的旧 `mapPoints`、`showMapPoint()`、`renderMap()` 及其 `mapRoutes` 常量，让 `map-ui.js` 成为唯一地图渲染器。生成的结构是：

```html
<div class="day-map-layout">
  <div class="day-map-pair">
    <div id="day-map-0" class="day-route-map"></div>
    <div id="day-island-map-0" class="day-route-map day-island-map" hidden></div>
    <div class="map-ferry-connector" hidden></div>
  </div>
  <aside id="day-map-detail-0" class="map-detail" aria-live="polite"></aside>
</div>
```

实际 id 后缀使用当前日期索引；仅当日有岛屿点位时显示第二个岛屿地图容器，渡轮连接条显示在主图与岛图之间。保留纵向时间链、当天交通卡片及动车票原图。可删除只服务旧地图网格的 `day.photos` 数据，不删地图点位 `map-data.js` 的照片。

- [x] **Step 6: 让每日标签、总览圈和厦大选项同步**

`app.js` 的 `xiamen:map-daychange` 监听先执行 `activateDay(dayIndex)`，再在 `scrollIntoView` 为真时将 `#day-${dayIndex}` 平滑滚入视口。普通 `daySwitcher` 切换只派发 `xiamen:daychange`，不触发滚动。`map-ui.js` 监听日变化重画当天地图并更新总览圈选态。首次加载仍默认选中 10 月 1 日（索引 1），`map-ui.js` 注册监听后立即绘制总览与当天地图，避免错过 `app.js` 较早派发的初始化事件。厦大开关仅在 10 月 2 日显示，触发后重画该日路线并移除厦大点位。

- [x] **Step 7: 运行交互相关纯数据与语法测试**

Run: `node --check app.js; node --check map-ui.js; node --test tests/*.test.cjs`
Expected: 两个 JS 文件无语法错误，地图几何、点位、图片路径测试全部 PASS。

### Task 6：完成手绘地图布局与无障碍样式

**Files:**
- Modify: `styles.css`
- Modify: `index.html`

- [ ] **Step 1: 添加总览图样式**

建立 `.route-overview`、`.overview-map`、`.overview-day-zone`、`.overview-day-label`、`.overview-point` 样式。总览地图 SVG 保持完整宽高比；生成底纹放在最底层并以低对比度覆盖，矢量水域、岛屿/海岸、道路肌理、日路线和文字在更高层。圈选边界使用各日路线色的轻虚线和透明浅填充，激活时只加强线宽与标签背景。

```css
.route-overview { overflow: hidden; border-radius: 1.25rem; background: #e7f1ed; }
.overview-map { display: block; width: 100%; height: auto; }
.overview-day-zone ellipse { fill: currentColor; fill-opacity: .08; stroke-dasharray: 7 6; stroke-width: 3; }
.overview-day-zone:focus-visible ellipse, .overview-day-zone.is-active ellipse { fill-opacity: .18; stroke-width: 5; }
```

- [ ] **Step 2: 添加每日图与详情卡样式**

建立 `.day-map-layout` 双列布局：桌面地图与照片详情并排，地图可用宽度至少 60%；窄屏改成先地图、后详情。地图在每天切换时保持可见且不水平溢出。日期点位有清晰的选中态和足够的触控区域，酒店/车站图标的外观区别明显。

```css
.day-map-layout { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(15rem, .9fr); gap: 1rem; }
.day-map-pair { display: grid; grid-template-columns: minmax(0, 1fr); gap: .65rem; min-width: 0; }
.day-route-map svg { display: block; width: 100%; height: auto; }
@media (max-width: 720px) { .day-map-layout { grid-template-columns: 1fr; } }
```

- [ ] **Step 3: 删除过期地图与日图片网格样式冲突**

只移除不再使用的 `.photo-grid` 日程规则和旧 `#routeMap` 日期地图规则；不得删 `food-gallery`、餐饮卡片或其他照片详情样式。针对重复媒体查询只在文件尾部作小范围覆盖，不重排整个样式表。

- [ ] **Step 4: 检查样式选择器与脚本节点对齐**

Run: `rg -n "routeOverview|day-map-|mapDetail|photo-grid" index.html app.js map-ui.js styles.css`
Expected: `map-ui.js` 使用的总览和日图 ID 均由 `index.html` 或 `app.js` 创建；每日 `.photo-grid` 不再由 `app.js` 输出。

### Task 7：整合底纹、更新静态部署文档并做端到端验收

**Files:**
- Modify: `index.html`
- Modify: `credits.html`
- Modify: `README.md`
- Create: `D:\workspace\xiamen-guide-site-native-pages-v2.zip`

- [ ] **Step 1: 将生成图片加入总览和每日地图**

`map-ui.js` 输出的地图 SVG 使用本地纸感底纹。对应的每日景点地图还需将匹配的透明地标插画定位在当日裁切视窗内；插画位于陆地填色上方、海岸/路网/路线/点位和文字矢量层下方：

```html
<image class="map-generated-base" href="assets/xiamen-map-base.png"
  x="0" y="0" width="720" height="900" opacity="0.28"
preserveAspectRatio="xMidYMid slice" />
```

对应日地图另叠 `map-generated-scenery` PNG 插画层，填充当地的缩放视窗并保持透明通道。鼓浪屿、海岸、园林/索道和老城/八市分别使用各自插画。必须保留岛屿/海岸矢量、手绘道路、路线和 POI 在插画之上；不要把生成图片误用为真实厦门地图或实拍照片。

- [ ] **Step 2: 更新静态引用版本并检查资源 URL**

在 `index.html` 将 CSS 与 JS 的查询版本从 `20260925-native4` 统一提升为 `20260925-native5`。地图底纹引用使用站点相对路径 `assets/xiamen-map-base.png`，禁止使用本机绝对路径。

- [ ] **Step 3: 运行所有 Node 测试和静态引用检查**

Run:

```powershell
node --check app.js
node --check map-ui.js
node --test tests\*.test.cjs
rg -n 'native4|C:\\Users\\zhongzihang|D:\\workspace\\output' index.html app.js map-ui.js styles.css README.md credits.html
```

Expected: 所有测试通过，站点代码中无旧缓存版本和本机绝对路径。

- [ ] **Step 4: 在当前本地预览检查地图功能**

打开 `http://localhost:8766/?v=20260925-native5#map`，桌面和 390px 窄屏依次验证：

1. 总览图显示全程 POI、五日彩色范围圈、酒店与厦门站图标、路线图例。
2. 点击/键盘触发 9.30、10.1、10.2、10.3、10.4 总览圈，各自选中对应日期且滚动到当天地图。
3. 日期标签切换时，当天 map 点位只等于其路线端点 ID；10.1 有东渡→三丘田海上段与鼓浪屿局部图，10.2 的无厦大选项会去掉厦大标点。
4. 点击地图景点显示本点实拍详情；图片可放大；破损图片显示占位。酒店/车站自定义图标不显示错配的景点照片。
5. 页面无水平滚动，浏览器控制台无脚本错误或本地底纹 404。

- [ ] **Step 5: 生成完整源码 ZIP 并检查归档**

归档整个站点目录，使解压后的根目录直接包含 `index.html`、`app.js`、`map-ui.js`、`map-data.js`、测试、文档和完整 `assets/`。输出到：

```powershell
if (Test-Path -LiteralPath 'D:\workspace\xiamen-guide-site-native-pages-v2.zip') {
  throw 'Refusing to overwrite an existing source archive.'
}
Compress-Archive -Path 'D:\workspace\output\xiamen-guide-site\*' `
  -DestinationPath 'D:\workspace\xiamen-guide-site-native-pages-v2.zip' -CompressionLevel Optimal
```

随后用 `tar -tf D:\workspace\xiamen-guide-site-native-pages-v2.zip` 检查 ZIP 根目录含 `index.html` 和 `assets/xiamen-map-base.png`，并确认归档中没有绝对本机路径文件。

## 自审清单

- Spec 中“全程路线总览、逐日放大图、手绘地图样式、日期圈选、酒店/车站图例、点位看实拍、删除每日独立照片网格”分别由 Task 3—7 覆盖。
- 10 月 1 日的两个地理视图使用各自基准坐标投影，渡轮段用有时刻与码头名的独立连接条表达；没有把两岛之间路径当作陆路，也不会因跨海裁切而失去每日地图放大效果。
- 每日路线点位由测试覆盖的纯函数生成，`days` 标签不作为额外标记来源，避免灰点或其他日期点位泄漏。
- ImageGen 底纹的打包和本地路径由 Task 3/7 覆盖；其地理精确性风险通过只作纹理基底和上叠矢量点位明确隔离。
- 厦大不摇号路线、单点视窗、闭环回酒店、手机宽度、失效照片和本地图片 URL 都有相应任务或回归检查。
- 站点不是 Git 仓库，计划不包含 git init、commit、branch 或外部发布动作。
