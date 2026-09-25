# 国庆厦门游玩规划网站改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把现有厦门国庆静态攻略改成更清晰的手机优先网站，包含按真实地理坐标绘制的景点路线图、修复后的美食图鉴，以及并入每日行程的动车和渡轮信息。

**Architecture:** 保持 GitHub Pages 可直接发布的纯静态结构。新增无依赖的坐标投影、POI 数据验证和图片路径解析模块；由现有 `app.js` 用经核验的 POI 数据生成手绘风 SVG 地图，并继续驱动每日路线、美食筛选和详情弹层。地图底图为本地 SVG 图形，不依赖在线瓦片、运行时密钥或导航链接。

**Tech Stack:** HTML、CSS、原生 JavaScript、SVG、Node.js 内置 `node:test`；不增加 npm 依赖或构建步骤。

**Spec:** `docs/superpowers/specs/2026-09-25-xiamen-guide-map-redesign-design.md`

## Global Constraints

- 坐标使用同一坐标系。高德地图坐标为 GCJ-02；底图投影和点位投影共用同一输入，不混用未经转换的其他坐标系。
- 路线彩线表示游玩顺序，不表示经核验的步行道路或导航轨迹；东渡至三丘田单独用海上渡轮线表示。
- 保留纯静态 GitHub Pages 兼容，不增加运行时地图 API 密钥或构建步骤。
- 不改动车票原图，不更新 PDF，不改变已经确定的船票时间与码头。
- 每张美食图片的替代方案必须与对应菜式相符；远程图载入失败时不得回退成街景、其他菜品或虚称门店实拍。
- 景区营业、渡轮、交通、价格和供应可能在旅行日变化；本改版是游玩规划而非实时导航或运营承诺。
- 当前目录不是 Git 仓库；不初始化 Git，也不安排提交步骤。

## Review Focus

- 传入无效、越界或反向的经纬度边界时，投影函数应明确拒绝，而不是把标记悄悄画到错误位置；由 Task 1 的单元测试覆盖。
- 图片字段是裸文件名、已带 `assets/` 前缀、远程 URL 或空值时，路径只能解析一次，空值不得生成错误 URL；由 Task 2 的单元测试覆盖。
- 高德未精确收录酒店入口或景区入口时，地图须将点位明确标为“约”或“附近”，不把近似点说成精确入口；由 Task 4 的点位数据审阅和 Task 5 的详情检查覆盖。
- 手机窄屏时，地图、站点标签、路线和图例应换行/缩放而非制造整页横向滚动；由 Task 5 的 390px 浏览器验收覆盖。
- 图片加载失败时不得留下裂图图标或显示错误菜品；由 Task 7 的断网/坏 URL 浏览器验收覆盖。

---

## 文件职责

- `map-geometry.js`（新增）：坐标边界校验与经纬度到 SVG viewBox 的投影；不含厦门 POI 数据或渲染代码。
- `map-data.js`（新增）：高德核验后的主图/鼓浪屿 POI、边界和每日站点顺序；以同一份数据供浏览器地图与 Node 测试使用。
- `image-path.js`（新增）：本地资源与远程图片 URL 规范化；不决定图片内容或回退图片。
- `tests/map-geometry.test.cjs`、`tests/image-path.test.cjs`、`tests/map-data.test.cjs`（新增）：用 Node 内置测试框架验证坐标、图片路径、POI 与路线数据，无第三方依赖。
- `index.html`（修改）：按正确顺序引入新工具；移除单独交通导航和章节；保留地图、每日行程、美食圖鑑和出门小抄；行程区提供交通票图容器。
- `app.js`（修改）：消费 `map-data.js` 的高德核验景点数据和每日路线；渲染坐标地图、详情、每日交通内容；调用图片路径工具并修正美食筛选/详情。
- `styles.css`（修改）：绘制轻旅行手绘地图与标记、适配手机的地图和每日路线、交通票图以及美食详情样式。
- `credits.html`、`README.md`（修改）：同步新图像说明、地图数据说明、使用方法及静态网站限制。
- `assets/`（必要时新增）：只纳入已确认可随站点分发或用户提供的实拍图；保留并复用现有动车票原图及景点照片。
- `D:\workspace\output\2026国庆厦门游玩规划_网站源码.zip`（更新交付包）：收录最终站点目录与所有本地素材，归档内路径相对站点根目录。

## 实施任务

### Task 1：建立经纬度到 SVG 坐标的纯函数

**Files:**
- Create: `map-geometry.js`
- Create: `tests/map-geometry.test.cjs`
- Modify: `index.html` 引入地图工具脚本

**Interface:**
- `projectPoint(point, bounds, viewport) -> { x: number, y: number }`
- `point`: `{ lat, lng }`；`bounds`: `{ north, south, east, west }`；`viewport`: `{ width, height, padding }`。
- 点必须在边界内，边界必须满足 `north > south`、`east > west`；视口尺寸必须大于两倍 padding。越界/无效数据抛出 `RangeError`。
- 使用经纬度的线性局部投影，使西北角映射至 `(padding, padding)`、东南角映射至 `(width-padding, height-padding)`；SVG 统一采用与投影相同的 viewBox 尺寸。

- [x] **Step 1: 写边界行为的失败测试**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { projectPoint } = require('../map-geometry.js');

const bounds = { north: 24.5, south: 24.4, east: 118.2, west: 118.0 };
const viewport = { width: 800, height: 600, padding: 20 };

test('projects corners and center into the padded viewBox', () => {
  assert.deepEqual(projectPoint({ lat: 24.5, lng: 118.0 }, bounds, viewport), { x: 20, y: 20 });
  assert.deepEqual(projectPoint({ lat: 24.4, lng: 118.2 }, bounds, viewport), { x: 780, y: 580 });
  const center = projectPoint({ lat: 24.45, lng: 118.1 }, bounds, viewport);
  assert.ok(Math.abs(center.x - 400) < 1e-8);
  assert.ok(Math.abs(center.y - 300) < 1e-8);
});

test('rejects out-of-bounds points and invalid bounds or viewport', () => {
  assert.throws(() => projectPoint({ lat: 24.6, lng: 118.1 }, bounds, viewport), RangeError);
  assert.throws(() => projectPoint({ lat: 91, lng: 118.1 }, { ...bounds, north: 92, south: 90 }, viewport), RangeError);
  assert.throws(() => projectPoint({ lat: 24.45, lng: 181 }, { ...bounds, east: 182, west: 180 }, viewport), RangeError);
  assert.throws(() => projectPoint({ lat: 24.45, lng: 118.1 }, { ...bounds, north: bounds.south }, viewport), RangeError);
  assert.throws(() => projectPoint({ lat: 24.45, lng: 118.1 }, bounds, { ...viewport, padding: 400 }), RangeError);
  assert.throws(() => projectPoint({ lat: 24.45, lng: 118.1 }, bounds, { ...viewport, padding: -1 }), RangeError);
});
```

- [x] **Step 2: 运行测试并确认先失败**

Run: `node --test tests/map-geometry.test.cjs`
Expected: FAIL，提示 `map-geometry.js` 尚不存在或 `projectPoint` 未定义。

- [x] **Step 3: 实现带浏览器全局和 CommonJS 导出的投影函数**

```js
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.XiamenMapGeometry = api;
})(globalThis, function () {
  function projectPoint(point, bounds, viewport) {
    const values = [point?.lat, point?.lng, bounds?.north, bounds?.south, bounds?.east, bounds?.west,
      viewport?.width, viewport?.height, viewport?.padding];
    if (!values.every(Number.isFinite) || bounds.north > 90 || bounds.south < -90 || bounds.east > 180 || bounds.west < -180 ||
        point.lat > 90 || point.lat < -90 || point.lng > 180 || point.lng < -180 ||
        bounds.north <= bounds.south || bounds.east <= bounds.west || viewport.padding < 0 ||
        viewport.width <= viewport.padding * 2 || viewport.height <= viewport.padding * 2 ||
        point.lat < bounds.south || point.lat > bounds.north || point.lng < bounds.west || point.lng > bounds.east) {
      throw new RangeError('Point, bounds, or viewport are outside the supported map extent');
    }
    const usableWidth = viewport.width - viewport.padding * 2;
    const usableHeight = viewport.height - viewport.padding * 2;
    return {
      x: viewport.padding + ((point.lng - bounds.west) / (bounds.east - bounds.west)) * usableWidth,
      y: viewport.padding + ((bounds.north - point.lat) / (bounds.north - bounds.south)) * usableHeight
    };
  }
  return { projectPoint };
});
```

- [x] **Step 4: 运行测试确认通过**

Run: `node --test tests/map-geometry.test.cjs`
Expected: 两个测试通过，进程退出码为 0。

- [x] **Step 5: 按顺序加载地图工具**

在 `index.html` 的现有 `app.js` script 标签前加入 `<script src="map-geometry.js" defer></script>`，保留 `app.js` 的 `defer`；确认两者均在 body 结束前或 head 中使用 `defer`，不可因脚本时序导致 `XiamenMapGeometry` 缺失。

### Task 2：统一本地和远程图片路径解析

**Files:**
- Create: `image-path.js`
- Create: `tests/image-path.test.cjs`
- Modify: `index.html` 引入图片路径工具脚本

**Interface:**
- `resolveImagePath(source, assetPrefix = 'assets/') -> string`
- 保留 `http:`, `https:`, `data:` 与根相对 URL；本地文件名只补一次资源前缀；已经以当前前缀开头的相对路径不再拼接；空/空白值返回空字符串。

- [x] **Step 1: 写完整输入类型测试**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveImagePath } = require('../image-path.js');

test('adds the asset prefix only to bare local file names', () => {
  assert.equal(resolveImagePath('food_shacha.jpg'), 'assets/food_shacha.jpg');
  assert.equal(resolveImagePath('assets/food_shacha.jpg'), 'assets/food_shacha.jpg');
  assert.equal(resolveImagePath('https://example.test/photo.jpg'), 'https://example.test/photo.jpg');
  assert.equal(resolveImagePath('/images/photo.jpg'), '/images/photo.jpg');
  assert.equal(resolveImagePath('data:image/png;base64,AAAA'), 'data:image/png;base64,AAAA');
  assert.equal(resolveImagePath('  '), '');
});
```

- [x] **Step 2: 运行测试并确认先失败**

Run: `node --test tests/image-path.test.cjs`
Expected: FAIL，提示 `image-path.js` 尚不存在。

- [x] **Step 3: 实现小型 URL 解析器**

```js
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.SiteImages = api;
})(globalThis, function () {
  function resolveImagePath(source, assetPrefix = 'assets/') {
    if (typeof source !== 'string' || !source.trim()) return '';
    const value = source.trim();
    if (/^(?:https?:|data:|\/)/i.test(value) || value.startsWith(assetPrefix)) return value;
    return assetPrefix + value.replace(/^\.\//, '');
  }
  return { resolveImagePath };
});
```

- [x] **Step 4: 运行测试确认通过**

Run: `node --test tests/image-path.test.cjs`
Expected: 一个测试通过，进程退出码为 0。

- [x] **Step 5: 按顺序加载图片工具**

在 `index.html` 的 `app.js` 标签前加入 `<script src="image-path.js" defer></script>`；`defer` 脚本按照文档顺序执行。此时仅添加加载入口，图片调用由 Task 7 接入。

### Task 3：建立可测试的高德 POI 与路线数据

**Files:**
- Create: `map-data.js`
- Create: `tests/map-data.test.cjs`
- Modify: `index.html` 加载 `map-data.js`

**Interface:** 浏览器全局和 CommonJS 均导出 `XiamenMapDataTools.validateMapData(data)`。最终静态数据对象形状为 `{ mainBounds, islandBounds, points, routes }`；点位字段为 `{ id, name, lat, lng, address, mapUrl, locationType, precision, days, photo, note, view }`；`view` 取 `main` 或 `island`。路线边为 `{ from, to, type:'ferry'|'visit' }`。

- [ ] **Step 1: 写数据合同测试**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { validateMapData } = require('../map-data.js');
const fixture = {
  mainBounds: { north: 25, south: 24, east: 119, west: 118 },
  islandBounds: { north: 25, south: 24, east: 119, west: 118 },
  points: [
    { id: 'east-pier', name: 'East Pier', lat: 24.5, lng: 118.5, address: 'Pier Rd', mapUrl: 'https://ditu.amap.com/place/pier', locationType: 'pier', precision: 'exact', days: ['2026-10-01'], photo: 'pier.jpg', note: 'Board ferry', view: 'main' },
    { id: 'island-pier', name: 'Island Pier', lat: 24.6, lng: 118.4, address: 'Island Rd', mapUrl: 'https://ditu.amap.com/place/island', locationType: 'pier', precision: 'exact', days: ['2026-10-01'], photo: 'pier.jpg', note: 'Arrive here', view: 'island' }
  ],
  routes: { '2026-10-01': [{ from: 'east-pier', to: 'island-pier', type: 'ferry' }] }
};

test('accepts a complete POI dataset and typed route edges', () => {
  assert.equal(validateMapData(fixture), fixture);
});

test('rejects duplicate ids, missing POI fields, and dangling route edges', () => {
  assert.throws(() => validateMapData({ ...fixture, points: [...fixture.points, fixture.points[0]] }), TypeError);
  assert.throws(() => validateMapData({ ...fixture, routes: { day: [{ from: 'missing', to: 'island-pier', type: 'visit' }] } }), TypeError);
  assert.throws(() => validateMapData({ ...fixture, points: [{ ...fixture.points[0], address: '' }, fixture.points[1]] }), TypeError);
});
```

- [ ] **Step 2: 运行测试确认缺少数据时失败**

Run: `node --test tests/map-data.test.cjs`
Expected: FAIL，提示 `map-data.js` 尚不存在。

- [ ] **Step 3: 建立可在浏览器与 Node 导入的数据模块**

```js
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.XiamenMapDataTools = api;
})(globalThis, function () {
  function validateMapData(data) {
    const ids = new Set();
    for (const point of data.points) {
      if (!point.id || ids.has(point.id) || !point.name || !point.address || !point.mapUrl ||
          !Number.isFinite(point.lat) || !Number.isFinite(point.lng) ||
          !['entrance', 'pier', 'station', 'hotel', 'area'].includes(point.locationType) ||
          !['exact', 'approx'].includes(point.precision) || !['main', 'island'].includes(point.view)) {
        throw new TypeError('Map POI data is missing a field or contains a duplicate id');
      }
      ids.add(point.id);
    }
    for (const edges of Object.values(data.routes)) {
      for (const edge of edges) {
        if (!ids.has(edge.from) || !ids.has(edge.to) || !['visit', 'ferry'].includes(edge.type)) {
          throw new TypeError('Map route references an unknown POI or route type');
        }
      }
    }
    return data;
  }
  return { validateMapData };
});
```

实现后运行测试，确认验证器接受完整 fixture、拒绝重复 id 和悬空路线边。将 `index.html` 的 deferred script 顺序固定为 `map-geometry.js`、`image-path.js`、`map-data.js`、`app.js`。

### Task 4：按行程分组核验并填入高德坐标

**Files:**
- Modify: `map-data.js`
- Test: `tests/map-data.test.cjs`

**Consumes:** `XiamenMapDataTools.validateMapData(data)`、`XiamenMapGeometry.projectPoint(point, bounds, viewport)`。
**Produces:** 浏览器全局 `XiamenMapData` 与 Node 可读取的 `require('../map-data.js').data`，其结构为 `{ mainBounds, islandBounds, points, routes }`。

- [ ] **Step 1: 为实际 POI 数据写失败测试**

在 `tests/map-data.test.cjs` 新增实际数据测试：加载 `{ data } = require('../map-data.js')`，确认数据存在；每个点的高德 URL、地址、照片字段完整且 id 唯一；全部点落入 `mainBounds`，`view:'island'` 点还落入 `islandBounds`；路线端点均已定义且至少有一个渡轮边。

```js
const { data } = require('../map-data.js');
const { projectPoint } = require('../map-geometry.js');

test('published Xiamen points and routes are complete and projectable', () => {
  assert.ok(data, 'verified map data must be exported');
  const ids = new Set(data.points.map(point => point.id));
  assert.equal(ids.size, data.points.length);
  for (const point of data.points) {
    assert.match(point.mapUrl, /^https:\/\/ditu\.amap\.com\//);
    assert.ok(point.name && point.address && point.photo);
    projectPoint(point, data.mainBounds, { width: 960, height: 680, padding: 32 });
    if (point.precision === 'approx') assert.match(point.note, /约|附近/);
    if (point.view === 'island') projectPoint(point, data.islandBounds, { width: 800, height: 500, padding: 24 });
  }
  const edges = Object.values(data.routes).flat();
  for (const edge of edges) assert.ok(ids.has(edge.from) && ids.has(edge.to));
  assert.ok(edges.some(edge => edge.type === 'ferry'));
});
```

- [ ] **Step 2: 运行测试确认真实数据缺失时失败**

Run: `node --test tests/map-data.test.cjs`
Expected: FAIL，因为 Task 3 仅提供了验证器，真实 POI 数据尚未导出。

- [ ] **Step 3: 核验酒店与铁路站点**

打开设计说明中的高德页面并确认酒店（核查“文灶地铁站店”地址及湖滨中路 7 号附近 POI）与厦门站的地图定位对象和 GCJ-02 坐标。每条记录写入 `mapUrl`、准确地址与 `locationType`；酒店找不到同名 POI 就选最近可证实地址，设 `precision:'approx'` 且 `note` 含“约/附近”。

- [ ] **Step 4: 核验东渡与三丘田码头**

分别检索东渡客运码头和三丘田码头的高德 POI，确认其身份确为厦门—鼓浪屿客运码头而非夜游码头。保存 GCJ-02 经纬度、码头地址和页面 URL，写入 `points`，`locationType` 设为 `pier`。

- [ ] **Step 5: 核验植物园、索道和南普陀**

检索厦门园林植物园、钟鼓索道和南普陀寺高德 POI；优先登记游客入口/索道登车入口，无入口 POI 时使用经核对的景区区域 POI 并标 `precision:'approx'`。每点记录页面 URL 和点位对象。

- [ ] **Step 6: 核验厦大、白城和沙坡尾**

检索厦门大学思明校区、白城沙滩和沙坡尾的高德 POI；记录用户可到达的入口或准确区域地址和坐标，区域中心标 `locationType:'area'`、`precision:'approx'`。检查厦大点位代表校门还是校区中心，不能把校区中心写成游客入口。

- [ ] **Step 7: 核验中山路与八市**

检索中山路步行街和八市高德 POI，记录可识别的游客入口或准确区域位置，写明 `locationType` 与精度，不将整片街区描述为单一精确入口。

- [ ] **Step 8: 核验鹭江夜游实际上船码头**

检索原行程所选鹭江夜游的实际上船码头；核对地址和地图坐标后写入 `points`，在 `note` 中注明登船位置应以票面/运营方当日信息复核。不要把东渡客运码头误作夜游码头。

- [ ] **Step 9: 计算主图与鼓浪屿 inset 边界**

主图 `mainBounds` 覆盖厦门岛、东渡和鼓浪屿码头，确保能在同一张 overview 里表现海上渡轮段；`islandBounds` 仅覆盖鼓浪屿步行点。依 Task 3 测试将全部 POI 投影到 overview，并将 `view:'island'` 点额外投影到 inset。按实际点位范围调整 bounds，确保范围包含每点且保留约 4% 边缘空白，不得更改坐标来适配图框。

- [ ] **Step 10: 编码每天站点顺序与渡轮边**

按当前 `days` 行程顺序创建 9/30、10/1、10/2、10/3、10/4 路线；不强加未决定的 10/2、10/4 景点。10/1 鼓浪屿步行点留在 inset；东渡—三丘田是唯一 `type:'ferry'` 海上段，其他连线用 `type:'visit'`。运行 `node --test tests/map-data.test.cjs tests/map-geometry.test.cjs`，全部点位投影和路线引用测试需通过。

- [ ] **Step 11: 导出已校验的静态 POI 数据**

以 `XiamenMapDataTools.validateMapData(data)` 校验最终数据；浏览器设置 `globalThis.XiamenMapData = data`，CommonJS 导出 `{ validateMapData, data }`。在 `tests/map-data.test.cjs` 校验唯一 id、地址/高德 URL、合法点类型与精度、每点有对应实拍照片路径、所有点投影到主图 bounds、鼓浪屿点还投影到 inset bounds、近似点说明含“约/附近”，并确认路线所有端点存在且有一段 `type:'ferry'`。运行 `node --test tests/map-data.test.cjs tests/map-geometry.test.cjs`，全部通过。

### Task 5：生成手绘风 SVG 地图、每日路线和景点详情

**Files:**
- Modify: `app.js` 中 `renderMap()` 与 `showMapPoint()`；移除旧的伪坐标 `mapPoints`、`mapRoutes`
- Modify: `index.html` 地图标题改为“厦门景点地图”并更新图例文案，不使用“先看地图再出发”
- Modify: `styles.css` 地图卡片与 SVG 布局

**Consumes:** `XiamenMapGeometry.projectPoint(point, bounds, viewport)`、`XiamenMapData`、`SiteImages.resolveImagePath(source)`。

- [ ] **Step 1: 写地图 DOM 的失败验收断言**

在不改动 `renderMap()` 前打开当前网站。浏览器执行 `if (document.querySelectorAll('[data-point-id]').length < XiamenMapData.points.length) throw new Error('geographic map markers are missing');`，记录其因旧版伪坐标地图没有坐标点标记而失败。该断言在 Task 5 最后一轮浏览器验收中原样重跑。

- [ ] **Step 2: 为一个点位实现坐标到 SVG marker 的最小渲染**

在地图渲染中采用共用 viewBox 尺寸，并用以下映射替代固定手工 `x/y`：

```js
const size = { width: 960, height: 680, padding: 32 };
const markerMarkup = points.map((point, index) => {
  const position = XiamenMapGeometry.projectPoint(point, bounds, size);
  return `<g class="map-marker" tabindex="0" role="button" aria-label="${safe(point.name)}" ` +
    `transform="translate(${position.x} ${position.y})" data-point-id="${safe(point.id)}">` +
    `<circle r="17"></circle><text y="5">${index + 1}</text></g>`;
}).join('');
```

对 `mainBounds` 的单点在本地浏览器核对方向与高德位置一致，再继续批量渲染；只对本地静态 POI 文本进行安全转义后插入。

- [ ] **Step 3: 绘制主岛手绘底图和鼓浪屿局部底图**

在同一 SVG viewBox 下绘制淡蓝海域、厦门岛岸线与浅沙色陆地区块，加入有限的主路、绿地和岛屿地标装饰；再用 `islandBounds` 绘制鼓浪屿 inset。不要引入远程底图瓦片。把小范围街道图案作为示意性插画，而不伪称为高德路网。

- [ ] **Step 4: 渲染按日路线、编号及渡轮虚线**

为每天配置一个 CSS route token；overview 中每条路线都用 `mainBounds` 投影两端 POI，按顺序绘制路径与编号站点，`type:'ferry'` 使用独立蓝色虚线和船形标识。鼓浪屿 inset 只绘制 `view:'island'` 点及 `type:'visit'` 的岛上路线。未选日期只展示非活动灰色 POI 与当前路线图例，路线不能遮挡地名标签。

- [ ] **Step 5: 连接标点点击详情和实拍图**

为 SVG 站点绑定一次事件代理，根据 `data-point-id` 调用 `showMapPoint(id)`；弹层显示点名、地址、`exact/approx` 精度、行程提示和匹配实拍图。图片 `src` 由 `SiteImages.resolveImagePath(photo)` 生成；将详情图片置于 `<figure>` 以复用 `bindZoom()`，若图加载失败则移除 `src` 并显示该景点专属空图说明。使用语义 SVG `<g tabindex="0" role="button">`，不要直接把 HTML `<button>` 塞入 `<svg>`。

- [ ] **Step 6: 完成日期切换及键盘可访问性**

现有日期选择器点击时更新 `activeDay`、地图标题、路线 SVG 与图例；marker 用 SVG `<g role="button">`、可见 focus ring 和可读标签。委托 `keydown` 处理器在 Enter/Space 时阻止默认并复用点击逻辑；鼠标点击、Enter 与 Space 都应打开同一个景点详情。

- [ ] **Step 7: 适配桌面和 390px 视口**

桌面地图与图例并列；手机改为主图、鼓浪屿 inset、路线说明上下排列，SVG `width:100%; height:auto` 且无固定最小宽度。浏览器在 390px 检查 `document.documentElement.scrollWidth <= document.documentElement.clientWidth`、标签可读、主岛/鼓浪屿方向正确、切换日期与打开景点详情有效。

```css
.map-layout { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(15rem, .6fr); gap: 1rem; }
.map-overview svg, .map-inset svg { display: block; width: 100%; height: auto; }
.map-marker { cursor: pointer; outline: none; }
.map-marker:focus-visible circle { stroke: #173d5b; stroke-width: 4px; }
@media (max-width: 600px) {
  .map-layout { grid-template-columns: minmax(0, 1fr); }
  .map-overview, .map-inset, .map-legend { min-width: 0; }
}
```

### Task 6：把动车、登岛渡轮及返程并入每日行程

**Files:**
- Modify: `app.js` 中 `days` 与 `renderDays()`
- Modify: `index.html` 移除 `#transport` 导航入口及独立 `<section id="transport">`
- Modify: `styles.css` 中每日票图与交通节点布局

**Interface:** 每个 day 可选含 `transport`；每日面板用 `data-day-date="YYYY-MM-DD"` 识别；铁路记录使用 `{ kind:'rail', title, detail, ticketSrc }`，渡轮记录使用 `{ kind:'ferry', title, detail, departure, arrival }`。`renderDays()` 为有字段的日期渲染对应块，原动车票图片沿用交通章节现有 `src`。

- [ ] **Step 1: 写每日交通位置回归断言**

在网页改动前用浏览器控制台执行以下验收表达式并记录失败：

```js
if (document.querySelector('#transport')) throw new Error('standalone transport chapter still exists');
for (const date of ['2026-09-30', '2026-10-01', '2026-10-04']) {
  if (!document.querySelector(`[data-day-date="${date}"] [data-day-transport]`)) {
    throw new Error(`transport block is missing from ${date}`);
  }
}
```

当前版本预期因独立 `#transport` 存在、每日卡片没有交通容器而失败；Task 6 完成后重跑并通过。

- [ ] **Step 2: 确认原票图源与日期数据**

从现有独立交通章节读取两张动车票图的原始 `src`，不裁切、不替换；为 9 月 30 日配置 D672 深圳北 15:55 出发、厦门站 19:49 到达；为 10 月 1 日配置东渡客运码头 10:30 开船、三丘田码头抵达；为 10 月 4 日配置返程动车，并沿用原票面内容。船票时间和码头按用户已提供信息，不推测航行时长或擅改班次。

- [ ] **Step 3: 将交通字段并入既有日期对象**

为 9 月 30 日和 10 月 4 日添加 `kind:'rail'` 数据并引用当前票图；为 10 月 1 日添加 `kind:'ferry'` 数据及前往东渡、登船、抵达三丘田的顺序节点。对象形状按以下字段执行：

```js
days[0].transport = { kind: 'rail', title: '去程动车', detail: 'D672 深圳北 15:55 → 厦门站 19:49', ticketSrc: 'assets/train-outbound-original.jpg' };
days[1].transport = { kind: 'ferry', title: '鼓浪屿去程', detail: '东渡客运码头 → 三丘田码头', departure: '10:30', arrival: '三丘田码头' };
days[4].transport = { kind: 'rail', title: '返程动车', detail: 'D2387 厦门站 16:33 → 深圳北 19:55', ticketSrc: 'assets/train-return-original.jpg' };
```

两张票图的 `src` 必须逐字复用当前交通章节的原图路径。其余每日安排保持现有内容，岛上返程提醒仍放在 10 月 1 日。

- [ ] **Step 4: 在每日时间线渲染铁路票图与渡轮节点**

在每天行程模板里为每个日期生成 `<div data-day-transport="日期 id"></div>`，装入后对有 `transport` 的节点调用 `renderDayTransport(day, container)`。铁路块显示站名、车次/票面时间和可点开放大的原票图；渡轮块显示东渡客运码头 → 三丘田码头、10:30 开船，以及简短出发缓冲建议。复用现有票图 lightbox 交互与图片解析 helper。

```js
function renderDayTransport(day, container) {
  container.replaceChildren();
  if (!day.transport) return;
  const item = day.transport;
  const card = document.createElement('article');
  card.className = `day-transport day-transport--${item.kind}`;
  const title = document.createElement('h4');
  title.textContent = item.title;
  const detail = document.createElement('p');
  detail.textContent = item.detail;
  card.append(title, detail);
  if (item.kind === 'rail') {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.src = SiteImages.resolveImagePath(item.ticketSrc);
    image.alt = `${item.title}原票图，点击放大`;
    figure.append(image);
    card.append(figure);
  } else {
    const departure = document.createElement('p');
    departure.textContent = `${item.departure} 东渡客运码头开船 · 抵达${item.arrival}`;
    card.append(departure);
  }
  container.append(card);
  bindZoom(container);
}
```

```css
.day-transport { display: grid; gap: .5rem; padding: 1rem; border-radius: 1rem; }
.day-transport figure { margin: 0; }
.day-transport img { display: block; max-width: 100%; height: auto; cursor: zoom-in; }
@media (max-width: 600px) { .day-transport { min-width: 0; } }
```

打开现有网页在改动前记录当前 DOM；实施后确认这个容器只由有 `transport` 数据的三天填充，其他日期为空。

- [ ] **Step 5: 移除独立交通章节并验证每日内容完整**

删除交通 nav 锚点和 `#transport` section，将页面主标题统一为“国庆厦门游玩规划”，更新顶部章节项和 README。浏览器逐项确认 9 月 30 日去程及原图、10 月 1 日船票信息、10 月 4 日返程及原图均在各自每日行程中，且页面不存在 `#transport`。

### Task 7：修复并完善美食图鉴图片及分类详情

**Files:**
- Modify: `app.js` 中 `foodPhotoFallbacks`、`foodPhoto()`、`foods` 数据与筛选/弹层渲染
- Modify: `styles.css` 中美食卡片、图片状态和详情弹层
- Modify: `credits.html`
- Add where image rights and stable access are verified: `assets/food_ye_mochi.jpg` and additional matching dish photos

**Consumes:** `SiteImages.resolveImagePath(source)`。

- [ ] **Step 1: 写现有美食筛选和图片 URL 的浏览器回归检查**

通过页面控制台/DOM 检查筛选分类：点击每个分类后，只有 `data-category` 匹配的卡片可见，“全部”恢复全部；点击吴番婆和叶氏麻糍可各自打开正确店名、地址、菜品描述与图片详情。验证裸路径和 `assets/` 路径都只出现一次前缀。

- [ ] **Step 2: 刷新门店推荐与精确地址**

先阅读 `agent-reach` 技能指引，再用其已验证的 Agent Reach/OpenCLI 通道只读检索近期小红书体验帖和本地美食讨论，整理候选店名单；不要点赞、收藏或发帖。候选覆盖八市、沙坡尾、文灶及海鲜（龙虾/螃蟹）、面食/小吃、甜品等类别。至少选出一条龙虾和一条螃蟹特色店候选；不在卡片内容中罗列推荐数据来源。

- [ ] **Step 3: 核实候选店名、精确地址与菜品信息**

对候选店逐个查高德 POI/门店页确认完整店名、详细地址和所在区域；二次比对近期攻略的招牌菜与营业信息，无法确认的营业时间不写成确定承诺。更新 `foods` 数据数组，为每个分类补齐匹配的真实门店、精确店名/地址、代表菜、两人点单建议及“出发前复核营业时间”提示；图片来源和署名留到 `credits.html`。

- [ ] **Step 4: 核验吴番婆和叶氏麻糍的匹配实拍素材**

吴番婆沙茶面使用已有本地沙茶面菜品图，并把数据改成裸文件名；叶氏麻糍只使用可确认是麻糍菜品或该店门店的实拍图，不再使用街景。候选图优先使用设计说明中的携程叶氏麻糍页面；对选中图实际加载验证并检查可否合法、稳定地随 GitHub Pages 源码包再分发。没有确认可再分发的本地照片时保留有效原图 URL 和清楚的对应菜式占位，不借用无关菜品照片。

- [ ] **Step 5: 将美食图片路径改为统一解析并修正空图回退**

将 `foodPhoto()` 改为调用 `SiteImages.resolveImagePath()`；移除会生成 `assets/assets/...` 的拼接逻辑；只有菜式匹配的本地回退图才写入 `foodPhotoFallbacks`。`img.onerror` 只处理一次：尝试该菜式专属本地图，若缺失/失败则隐藏 `<img>` 并显示“图片暂不可用”占位。

```js
function foodPhoto(food) {
  return SiteImages.resolveImagePath(food.image);
}

function handleFoodImageError(image, food) {
  const fallback = foodPhotoFallbacks[food.id];
  if (fallback && image.dataset.fallbackApplied !== 'true') {
    image.dataset.fallbackApplied = 'true';
    image.src = SiteImages.resolveImagePath(fallback);
    return;
  }
  image.hidden = true;
  image.closest('.food-photo')?.querySelector('.photo-unavailable')?.removeAttribute('hidden');
}

function attachFoodImageState(image, food) {
  image.addEventListener('error', () => handleFoodImageError(image, food));
}
```

在卡片与详情图模板中，为每张菜图放置 `<figure class="food-photo"><img ...><span class="photo-unavailable" hidden>图片暂不可用</span></figure>`；为每条门店记录提供唯一 `id`、唯一 `category`、精确 `name/address` 和与其菜品匹配的 `image`。

- [ ] **Step 6: 修复筛选和卡片详情状态**

沿用当前 `#foodFilters` 的事件代理 `button[data-filter]` 和 `foods` 字段：筛选需同时支持精确类别与区域（八市、沙坡尾、文灶等），在分类按钮中加入每种 `food.category` 一次并保留已有区域按钮，增加新类别后不能让海鲜筛选独占逻辑。卡片继续使用 `<button data-food-id>`，分类按钮更新 `aria-pressed` 和活动态；详情关闭后仍可继续筛选。

```js
function matchesFoodFilter(food, filter) {
  return filter === '全部' || food.category === filter || food.area === filter;
}
const shown = foods.filter(food => matchesFoodFilter(food, filter));
```

保留已存在的父级委托：`document.getElementById('foodFilters').addEventListener('click', e => { const button = e.target.closest('button[data-filter]'); if (button) renderFood(button.dataset.filter); });`。鼠标和键盘激活分类按钮后只显示匹配门店，卡片 Enter/Space 与鼠标仍能打开同一个详情弹层。

- [ ] **Step 7: 对坏图进行故障注入并验证图片与文案一致**

浏览器把一张美食图片 URL 临时改为不存在的本地文件，确认只展示匹配图片或占位文字，无裂图；检查吴番婆、叶氏麻糍及龙虾/螃蟹、沙坡尾、八市、文灶分类卡片的精确店名、地址、菜品文字与图像不串位。将本次纳入的照片署名与用途同步到 `credits.html`。

### Task 8：全站验收、说明更新与源码包整理

**Files:**
- Modify: `README.md`、`credits.html`（若前序任务未完成）
- Update: `D:\workspace\output\2026国庆厦门游玩规划_网站源码.zip`

- [ ] **Step 1: 运行所有纯函数测试和语法检查**

Run: `node --test tests/map-geometry.test.cjs tests/image-path.test.cjs tests/map-data.test.cjs`
Expected: 全部测试通过。

Run each command separately: `node --check app.js`, `node --check map-geometry.js`, `node --check image-path.js`, `node --check map-data.js`.
Expected: 每条命令退出码均为 0。

- [ ] **Step 2: 浏览器逐项验收桌面与手机布局**

在本地服务打开主页，分别设为桌面视口和 390px 手机视口。检查主图与鼓浪屿 inset、每天路线切换、全部标点点击、每个景点详情照片 `naturalWidth > 0`、票图放大、船票节点、美食分类筛选、食物卡片详情及坏 URL 下的图片占位。执行 `document.documentElement.scrollWidth <= document.documentElement.clientWidth`；检查地图上的“约/附近”提示，不存在导航跳转链接或独立交通章节。

- [ ] **Step 3: 更新 README 的交付说明**

说明首页静态打开/本地服务预览方式、`node --test tests/*.test.cjs`、照片与地图数据维护方式、GitHub Pages 根目录发布；注明路线是游玩顺序、经营信息出行前再次确认。删除已不适用的“独立交通章节”和“点击打开实地导航”说明。

- [ ] **Step 4: 重建 ZIP 并核对归档文件清单**

由 `D:\workspace\output\xiamen-guide-site` 的内容重建 `D:\workspace\output\2026国庆厦门游玩规划_网站源码.zip`，使用站点相对路径（归档根包含 `index.html`、`app.js`、`map-geometry.js`、`map-data.js`、`image-path.js`、`styles.css`、`assets/`、`tests/`、`docs/`）；用 `tar -tf` 检查清单并确认关键图片均在包内，没有绝对本机路径。

## 完成前自检

- Spec 覆盖：坐标投影、GCJ-02 POI 核验、手绘主图与鼓浪屿 inset、按日路线和景点详情由 Task 1/3/4/5 覆盖；交通合并、原票图及移除独立章节由 Task 6 覆盖；图片修复、分类、龙虾/螃蟹门店补充、详情与图像署名由 Task 2/7 覆盖；README、ZIP、桌面/手机验收由 Task 8 覆盖。PDF 不在本次范围。
- 占位检查：各实施项均有明确文件、输入、命令或浏览器操作与预期行为；没有未定义的工程工作项。
- 接口一致性：Task 1 导出 `projectPoint(point, bounds, viewport)`；Task 2 导出 `resolveImagePath(source, assetPrefix)`；Task 3 导出 `validateMapData(data)`；Task 4/5/6/7 按这些接口调用；行程票图仍复用现有 lightbox。
- Review Focus 覆盖：无效坐标 Task 1、路径形态 Task 2、近似 POI Task 3/4、390px 页面 Task 5/8、坏图注入 Task 7/8。
- 仓库状态：目标目录当前无 `.git`，所以不做 Git 操作/提交；若需要 PR/提交，须由用户提供已连接的 Git 仓库副本。
