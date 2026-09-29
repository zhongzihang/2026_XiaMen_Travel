const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('published page loads the active atlas and not the retired map renderer', () => {
  const html = read('index.html');
  assert.match(html, /<script defer src="map-atlas-v2\.js\?/);
  assert.doesNotMatch(html, /<script[^>]+src="map-ui\.js/);
  assert.match(html, /id="routeOverview"/);
  assert.match(html, /id="overviewMapDialogLinks"/);
});

test('light-only palette is declared to prevent mobile browsers from auto-darkening map labels', () => {
  const html = read('index.html');
  const css = read('styles.css');
  assert.match(html, /<meta name="color-scheme" content="only light">/);
  assert.match(css, /:root\{color-scheme:\s*only light;/);
});

test('one date navigator remains above the overview map and follows it into zoom', () => {
  const js = read('map-atlas-v2.js');
  assert.match(js, /class="atlas-day-links"/);
  assert.match(js, /dialogLinks\.append\(toolbar\)/);
  assert.match(js, /target\.prepend\(toolbar\)/);
  assert.doesNotMatch(js, /atlas-date-layer|atlas-date-bubble|dateBubbles/);
});

test('mobile dates retain five readable tap targets without horizontal page overflow', () => {
  const css = read('map-atlas-v2.css');
  assert.match(css, /grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/);
  assert.match(css, /\.atlas-day-links button\{min-width:0;min-height:2\.75rem/);
  assert.match(css, /\.overview-map-zoom-canvas\{[^}]*overflow:auto/);
});

test('daily ordered place cards sit above transit and map pins scroll to their details', () => {
  const app = read('app.js');
  const atlas = read('map-atlas-v2.js');
  const css = read('map-atlas-v2.css');
  assert.ok(app.indexOf('class="day-place-list"') < app.indexOf('class="atlas-transit"'));
  assert.match(atlas, /function placeDetailsMarkup\(details, dayIndex\)/);
  assert.match(atlas, /orders\.map\(order => String\(order\)\.padStart\(2, '0'\)\)\.join\(' \/ '\)/);
  assert.match(atlas, /day-place-stack">\$\{startHotel\}\$\{cards\}/);
  assert.match(atlas, /selectPoint\(node\.dataset\.dayPointId, \{ scroll: true \}\)/);
  assert.match(atlas, /card\.scrollIntoView\(\{ behavior: 'smooth', block: 'center' \}\)/);
  assert.match(css, /\.day-place-card\[hidden\]\{display:none!important\}/);
  assert.match(css, /\.day-place-card\{[^}]*grid-template-columns:minmax\(220px/);
  assert.match(css, /\.day-place-card\{[^}]*grid-template-columns:minmax\(0,1fr\)\}/);
});

test('daily place order badge sits beside the place name on the same row', () => {
  const atlas = read('map-atlas-v2.js');
  const css = read('map-atlas-v2.css');
  assert.match(atlas, /class="day-place-title"><h3>\$\{esc\(point\.name\)\}<\/h3><div class="day-place-order"/);
  assert.match(css, /\.day-place-title\{[^}]*display:flex[^}]*align-items:center/);
  assert.match(css, /\.day-place-order\{[^}]*flex:none/);
});
