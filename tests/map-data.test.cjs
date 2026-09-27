const test = require('node:test');
const assert = require('node:assert/strict');
const { validateMapData, data, routeForDay, routePointIds, pointsForRoute, overviewRoutes, amapDestinationUrl } = require('../map-data.js');

test('every route destination opens the named Amap POI or its coordinate marker', () => {
  const destinations = new Set(Object.values(data.routes).flat().map(edge => edge.to));
  for (const id of destinations) {
    const point = data.points.find(item => item.id === id);
    const url = new URL(amapDestinationUrl(point));
    assert.equal(url.origin, 'https://uri.amap.com');
    assert.equal(url.pathname, '/marker');
    assert.equal(url.searchParams.get('callnative'), '1');
    const poiId = /\/place\/(B[A-Z0-9]+)/i.exec(point.mapUrl)?.[1];
    if (poiId) assert.equal(url.searchParams.get('poiid'), poiId);
    else {
      assert.equal(url.searchParams.get('position'), `${point.lng},${point.lat}`);
      assert.equal(url.searchParams.get('name'), point.name);
    }
  }
});
const { projectPoint } = require('../map-geometry.js');

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

test('published Xiamen points and routes are complete and projectable', () => {
  assert.ok(data, 'verified map data must be exported');
  const ids = new Set(data.points.map(point => point.id));
  assert.equal(ids.size, data.points.length);
  for (const point of data.points) {
    assert.match(point.mapUrl, /^https:\/\/ditu\.amap\.com\//);
    assert.ok(point.name && point.address && point.photo);
    projectPoint(point, data.mainBounds, { width: 960, height: 680, padding: 32 });
    if (point.precision === 'approx') assert.ok(point.note, `${point.id} needs a location note`);
    if (point.view === 'island') projectPoint(point, data.islandBounds, { width: 800, height: 500, padding: 24 });
  }
  const edges = Object.values(data.routes).flat();
  for (const edge of edges) assert.ok(ids.has(edge.from) && ids.has(edge.to));
  const ferries = edges.filter(edge => edge.type === 'ferry');
  assert.ok(ferries.some(edge => edge.from === 'dongdu' && edge.to === 'sanqiutian'));
});

test('returns only POIs referenced by the selected day route', () => {
  const edges = routeForDay(data, '2026-10-03');
  const ids = routePointIds(edges);
  assert.deepEqual(ids, ['hotel', 'botanic', 'cable', 'bashi', 'zhongshan']);
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

test('each daily route keeps its planned POI order without leaking other dates', () => {
  const expected = {
    '2026-09-30': ['station', 'hotel'],
    '2026-10-01': ['hotel', 'dongdu', 'sanqiutian', 'longtou', 'shuzhuang', 'rock', 'bashi'],
    '2026-10-02': ['hotel', 'nanputuo', 'xmu', 'baicheng', 'shapowei', 'heping'],
    '2026-10-03': ['hotel', 'botanic', 'cable', 'bashi', 'zhongshan'],
    '2026-10-04': ['hotel', 'baijia', 'station']
  };
  for (const [dayKey, ids] of Object.entries(expected)) {
    assert.deepEqual(routePointIds(routeForDay(data, dayKey)), ids);
  }
});
