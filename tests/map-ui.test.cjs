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
