const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const app = {};
app.window = app;
vm.createContext(app);
for (const file of ['map-data.js', 'catalog.js', 'planning-data.js', 'map-renderer.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), app, { filename: file });
}
function km(a, b) {
  const rad = Math.PI / 180;
  const q = Math.sin((b[1] - a[1]) * rad / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin((b[0] - a[0]) * rad / 2) ** 2;
  return 12742 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
}
test('route IDs and map paths are unique and complete', () => {
  assert.equal(app.ROUTES.length, 8);
  assert.equal(new Set(app.ROUTES.map(route => route.id)).size, app.ROUTES.length);
  for (const route of app.ROUTES) {
    const points = app.MAP_DATA.paths[route.id];
    assert.ok(points.length > 20, route.id);
    for (const point of [...points, ...route.supply.map(place => place.point)]) {
      assert.ok(point.length === 2 && point.every(Number.isFinite), route.id);
      assert.ok(point[0] > 119 && point[0] < 122 && point[1] > 29 && point[1] < 31, route.id);
    }
    assert.ok(km(points[0], route.parking.point) < 0.1, `${route.id}: start must be near parking`);
    if (route.shape !== '原路往返') assert.ok(km(points[0], points.at(-1)) < 0.01, `${route.id}: closed loop`);
  }
});
test('displayed distances match stored road geometry, counting return trips', () => {
  for (const route of app.ROUTES) {
    const points = app.MAP_DATA.paths[route.id];
    const measured = points.slice(1).reduce((sum, point, i) => sum + km(points[i], point), 0) * (route.shape === '原路往返' ? 2 : 1);
    assert.ok(Math.abs(measured - route.distance) < 0.25, `${route.id}: ${measured} vs ${route.distance}`);
    for (let i = 1; i < points.length; i++) assert.ok(km(points[i - 1], points[i]) < 1, `${route.id}: discontinuity`);
  }
});
test('new variants reuse actual stored segments rather than straight-line waypoint connections', () => {
  const originals = app.ROUTES.filter(route => !route.planBasis);
  const allowed = new Set(originals.flatMap(route => app.MAP_DATA.paths[route.id].slice(1).map((point, i) => JSON.stringify([app.MAP_DATA.paths[route.id][i], point]))));
  for (const route of app.ROUTES.filter(route => route.planBasis)) {
    const points = app.MAP_DATA.paths[route.id];
    for (let i = 1; i < points.length; i++) assert.ok(allowed.has(JSON.stringify([points[i - 1], points[i]])), `${route.id}: new unsupported segment`);
  }
});
test('every plan preserves parking evidence and exposes overnight restrictions', () => {
  for (const route of app.ROUTES) {
    assert.ok(['B0FFHHAW61', 'B0JR5SQAWE'].includes(route.parking.poiid));
    assert.match(route.parking.source, /^https:\/\//);
    assert.equal(route.parking.checked, '2026-10-14');
    assert.match(route.parking.verification, /本次未复核/);
    assert.equal(route.parking.price, '¥0');
    if (route.window === 'night') {
      assert.match(route.parking.rule, /18:00/);
      assert.match(route.parking.rule, /08:30/);
    }
    assert.equal(route.dedicated, false, 'shared paths must not become dedicated cycleways');
  }
  assert.equal(app.ROUTE_METADATA.parkingCount, 2);
  assert.equal(app.ROUTE_METADATA.shopCount, 4, 'reused shops must not be counted as new businesses');
});
test('all supply types render distinct markers, names, evidence status and per-type filtering', () => {
  for (const route of app.ROUTES) {
    const svg = app.makeMapSVG(route);
    assert.equal((svg.match(/data-poi="supply-/g) || []).length, route.supply.length);
    for (const kind of ['咖啡', '餐厅', '歇脚']) {
      const filtered = app.makeMapSVG(route, { supplyKind: kind });
      assert.equal((filtered.match(/data-poi="supply-/g) || []).length, route.supply.filter(place => place.kind === kind).length);
      assert.match(filtered, /data-poi="parking"/);
    }
    for (const place of route.supply) {
      assert.match(place.source, /^https:\/\//);
      assert.ok(place.mapLabel && place.status, place.name);
      assert.ok(svg.includes(place.mapLabel.replace(/&/g, '&amp;')), place.name);
      if (place.kind === '歇脚') assert.match(place.status, /非设施核验/);
    }
  }
});
test('rest map coordinates are converted to GCJ-02 before provider links use them', () => {
  // Standard Beijing conversion fixture. Original parking pins identify a POI area,
  // not a survey-grade WGS84/GCJ02 coordinate pair suitable as a reference fixture.
  const converted = app.RIDE_COORDS.wgs84ToGcj02([116.404, 39.915]);
  assert.ok(Math.abs(converted[0] - 116.41024449916938) < 1e-9);
  assert.ok(Math.abs(converted[1] - 39.91640428150164) < 1e-9);
  for (const route of app.ROUTES) for (const place of route.rest) {
    assert.ok(place.gcj[0] > place.point[0]);
    assert.ok(place.gcj[1] < place.point[1]);
    assert.ok(place.gcj.every(Number.isFinite));
  }
});
