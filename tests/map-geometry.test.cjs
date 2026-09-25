const test = require('node:test');
const assert = require('node:assert/strict');
const { projectPoint, fitViewBox } = require('../map-geometry.js');

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
