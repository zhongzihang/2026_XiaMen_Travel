const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const mapData = require('../map-data.js');
const geometry = require('../map-geometry.js');

function createMapUI() {
  const source = fs.readFileSync(path.join(__dirname, '..', 'map-ui.js'), 'utf8');
  const elements = new Map();
  const listeners = new Map();
  function element(id) {
    if (!elements.has(id)) {
      elements.set(id, {
        id,
        innerHTML: '',
        dataset: {},
        querySelectorAll() { return []; },
        addEventListener() {},
        showModal() {},
        close() {}
      });
    }
    return elements.get(id);
  }
  const document = {
    getElementById: element,
    querySelectorAll() { return []; }
  };
  const window = {
    XiamenMapData: mapData.data,
    XiamenMapDataTools: mapData,
    XiamenMapGeometry: geometry,
    SiteImages: { resolveImagePath(image) { return image; } },
    addEventListener(type, listener) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(listener);
    },
    dispatchEvent(event) {
      for (const listener of listeners.get(event.type) || []) listener(event);
      return true;
    }
  };
  function CustomEvent(type, options = {}) {
    this.type = type;
    this.detail = options.detail || {};
  }
  vm.runInNewContext(source, { window, document, CustomEvent, console }, { filename: 'map-ui.js' });
  return { ui: window.XiamenMapUI, element, window };
}

function pointIds(markup) {
  return Array.from(markup.matchAll(/data-day-point-id=['"]([^'"]+)['"]/g), match => match[1]);
}

test('daily map renders exactly the route POIs for that date', () => {
  const { ui, element } = createMapUI();
  const dayKeys = Object.keys(mapData.data.routes);
  for (const [dayIndex, dayKey] of dayKeys.entries()) {
    ui.renderDay(dayIndex);
    const markup = element('day-map-' + dayIndex).innerHTML + element('day-island-map-' + dayIndex).innerHTML;
    assert.deepEqual(pointIds(markup), mapData.routePointIds(mapData.routeForDay(mapData.data, dayKey)));
  }
});

test('Gulangyu day separates ferry details from its two local walking maps', () => {
  const { ui, element } = createMapUI();
  ui.renderDay(1);
  const localMaps = element('day-map-1').innerHTML + element('day-island-map-1').innerHTML;
  assert.match(element('day-ferry-1').innerHTML, /东渡客运码头.*10:30.*三丘田码头/);
  assert.doesNotMatch(localMaps, /is-ferry/);
  assert.deepEqual(new Set(pointIds(localMaps)), new Set(['hotel', 'dongdu', 'sanqiutian', 'longtou', 'shuzhuang', 'rock']));
});

test('XMU alternate removes its pin and scenic details reject other-day POIs', () => {
  const { ui, element } = createMapUI();
  ui.renderDay(2);
  assert.ok(pointIds(element('day-map-2').innerHTML).includes('xmu'));
  assert.equal(ui.selectPoint('xmu'), true);
  assert.match(element('day-map-detail-2').innerHTML, /厦门大学西门/);
  ui.setSkipXmu(true);
  const alternate = element('day-map-2').innerHTML;
  assert.ok(!pointIds(alternate).includes('xmu'));
  assert.ok(!/data-point-id=['"]xmu['"]/.test(element('routeOverview').innerHTML));
  assert.equal(ui.selectPoint('xmu'), false);
  ui.renderDay(3);
  assert.equal(ui.selectPoint('nanputuo'), false);
});

test('overview and daily map canvases use the local decorative base beneath vector layers', () => {
  const { ui, element } = createMapUI();
  ui.renderOverview();
  const overview = element('routeOverview').innerHTML;
  assert.match(overview, /<image class="map-generated-base" href="assets\/xiamen-map-base\.png"/);
  assert.ok(overview.indexOf('map-generated-base') < overview.indexOf('overview-zone-layer'));

  ui.renderDay(1);
  const mainland = element('day-map-1').innerHTML;
  const island = element('day-island-map-1').innerHTML;
  assert.match(mainland, /<image class="map-generated-base" href="assets\/xiamen-map-base\.png"/);
  assert.match(island, /<image class="map-generated-base" href="assets\/xiamen-map-base\.png"/);
  assert.ok(mainland.indexOf('map-generated-base') < mainland.indexOf('overview-island-shadow'));
  assert.ok(island.indexOf('map-generated-base') < island.indexOf('day-island-shadow'));
});

test('map stylesheet no longer retains controls from the replaced legacy map', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  for (const selector of ['map-toolbar', 'map-filter', 'route-map', 'map-sequence', 'sequence-no', 'sequence-name', 'sequence-mode']) {
    assert.doesNotMatch(css, new RegExp('\\.' + selector + '(?=[:{\\s,])'), selector + ' is obsolete');
  }
});

test('mobile date tabs use a wrapping grid rather than a horizontal flex row', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  assert.match(css, /@media\s*\(max-width:\s*720px\)[\s\S]*?\.day-switcher\s*\{\s*display:\s*grid;/);
  assert.match(css, /@media\s*\(max-width:\s*430px\)[\s\S]*?\.day-switcher\s*\{\s*grid-template-columns:\s*repeat\(2,/);
});

test('overlapping overview date circles resolve pointer clicks to the nearest day', () => {
  const { ui } = createMapUI();
  const overlapping = [
    { dayIndex: 0, cx: 260, cy: 374, rx: 52, ry: 26 },
    { dayIndex: 4, cx: 225, cy: 390, rx: 90, ry: 50 }
  ];
  assert.equal(ui.nearestOverviewDay(overlapping, 260, 374), 0);
  assert.equal(ui.nearestOverviewDay(overlapping, 225, 390), 4);
});

test('overview date labels remain distinct when route-zone circles overlap', () => {
  const { ui, element } = createMapUI();
  ui.renderOverview();
  const markup = element('routeOverview').innerHTML;
  const labels = Array.from(markup.matchAll(/<g class="overview-day-zone[^>]*data-overview-day="(\d+)" data-view="([^"]+)"[^>]*>[\s\S]*?<g class="overview-zone-label" transform="translate\(([\d.]+) ([\d.]+)\)"><rect width="(\d+)" height="(\d+)"/g), match => ({
    day: Number(match[1]), view: match[2], x: Number(match[3]), y: Number(match[4]), width: Number(match[5]), height: Number(match[6])
  }));
  assert.equal(labels.length, 6);
  assert.ok(labels.every(label => label.width === 100 && label.height === 28));
  for (let i = 0; i < labels.length; i++) {
    for (let j = i + 1; j < labels.length; j++) {
      const a = labels[i], b = labels[j];
      assert.ok(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y,
        'date labels for ' + a.day + '/' + a.view + ' and ' + b.day + '/' + b.view + ' overlap');
    }
  }
});

test('overview date label placement avoids hotel and island attraction names', () => {
  const { ui } = createMapUI();
  const overlaps = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
  const hotelLabel = { x: 461.8, y: 281.8, width: 44, height: 15 };
  const arrivalTag = ui.placeOverviewLabel({ cx: 508.75, cy: 310.03, rx: 104.98, ry: 52 }, [], [hotelLabel]);
  assert.equal(arrivalTag.width, 100);
  assert.ok(!overlaps(arrivalTag, hotelLabel));

  const islandLabels = [
    { x: 29.7, y: 478.3, width: 55, height: 15 },
    { x: 124.4, y: 554.5, width: 35, height: 15 },
    { x: 45.8, y: 638.2, width: 44, height: 15 },
    { x: 106.2, y: 565.7, width: 33, height: 15 }
  ];
  const islandTag = ui.placeOverviewLabel({ cx: 99.92, cy: 574.47, rx: 56, ry: 103.65 }, [], islandLabels);
  assert.ok(islandLabels.every(label => !overlaps(islandTag, label)));
});

test('daily attraction maps use local generated scenic artwork beneath accurate vector layers', () => {
  const { ui, element } = createMapUI();
  const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  assert.match(css, /\.map-generated-scenery\s*\{[^}]*pointer-events:\s*none/);
  const scenes = [
    { day: 1, id: 'day-island-map-1', asset: 'xiamen-gulangyu-scene.png', vector: 'day-island-path' },
    { day: 2, id: 'day-map-2', asset: 'xiamen-coast-scene.png', vector: 'overview-coastline' },
    { day: 3, id: 'day-map-3', asset: 'xiamen-garden-cableway-scene.png', vector: 'overview-coastline' },
    { day: 4, id: 'day-map-4', asset: 'xiamen-oldtown-scene.png', vector: 'overview-coastline' }
  ];
  for (const scene of scenes) {
    ui.renderDay(scene.day);
    const markup = element(scene.id).innerHTML;
    assert.match(markup, new RegExp('<image class="map-generated-scenery" href="assets/' + scene.asset + '"'));
    assert.ok(markup.indexOf('map-generated-scenery') < markup.indexOf(scene.vector));
    const imagePath = path.join(__dirname, '..', 'assets', scene.asset);
    assert.ok(fs.existsSync(imagePath), scene.asset + ' must be shipped locally');
    assert.ok(fs.statSync(imagePath).size > 50_000, scene.asset + ' should be a real generated image asset');
  }
  ui.renderDay(1);
  const realPhoto = mapData.data.points.find(point => point.id === 'rock').photo;
  assert.equal(ui.selectPoint('rock'), true);
  assert.ok(element('day-map-detail-1').innerHTML.includes('src="' + realPhoto + '"'));
});
