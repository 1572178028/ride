const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const zlib = require('node:zlib');
const root = path.resolve(__dirname, '..');
const app = {};
app.window = app;
vm.createContext(app);
for (const file of ['map-data.js', 'catalog.js', 'planning-data.js', 'regional-map-data.js', 'regional-catalog.js', 'map-renderer.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), app, { filename: file });
}
function km(a, b) {
  const rad = Math.PI / 180;
  const q = Math.sin((b[1] - a[1]) * rad / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin((b[0] - a[0]) * rad / 2) ** 2;
  return 12742 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
}
test('route IDs and map paths are unique and complete', () => {
  assert.equal(app.ROUTES.length, 12);
  assert.equal(new Set(app.ROUTES.map(route => route.id)).size, app.ROUTES.length);
  for (const route of app.ROUTES) {
    const points = app.MAP_DATA.paths[route.id];
    assert.ok(points.length >= 10, route.id);
    for (const point of [...points, ...route.supply.map(place => place.point)]) {
      assert.ok(point.length === 2 && point.every(Number.isFinite), route.id);
      assert.ok(point[0] > 119 && point[0] < 122 && point[1] > 29 && point[1] < 31, route.id);
    }
    assert.ok(km(points[0], route.parking.point) < 0.5, `${route.id}: road start must be near parking area`);
    if (route.shape !== '原路往返') assert.ok(km(points[0], points.at(-1)) < 0.01, `${route.id}: closed loop`);
  }
});
test('distance variants belong to seven main lines across five actual areas', () => {
  const mains = app.ROUTES.filter(route => route.id === route.familyId);
  assert.equal(mains.length, 7);
  assert.equal(app.ROUTE_METADATA.familyCount, 7);
  assert.equal(app.ROUTE_METADATA.regionCount, 5);
  for (const variant of app.ROUTES) {
    const main = mains.find(route => route.id === variant.familyId);
    assert.ok(main, variant.id);
    assert.equal(variant.parking.id || variant.parking.poiid, main.parking.id || main.parking.poiid);
    assert.equal(variant.familyTitle, main.familyTitle);
  }
});
test('West Lake previews cannot claim free parking or inflate the ride catalog', () => {
  assert.equal(app.EXPANSION_CANDIDATES.length, 2);
  assert.ok(app.EXPANSION_CANDIDATES.some(candidate => candidate.area.includes('西湖')));
  assert.ok(app.ROUTES.some(route => route.region === 'qiandao'));
  assert.equal(app.RESEARCH_MAP.parking, undefined);
  for (const candidate of app.EXPANSION_CANDIDATES) {
    assert.match(candidate.status, /待核查/);
    assert.match(candidate.missing, /免费停车/);
    assert.ok(!app.ROUTES.some(route => route.id === candidate.id));
    assert.ok(!app.ROUTES.some(route => route.id === candidate.preview));
    assert.equal(candidate.parking, undefined);
  }
});
test('displayed distances match stored road geometry, counting return trips', () => {
  for (const route of app.ROUTES) {
    const points = app.MAP_DATA.paths[route.id];
    const measured = points.slice(1).reduce((sum, point, i) => sum + km(points[i], point), 0) * (route.shape === '原路往返' ? 2 : 1);
    assert.ok(Math.abs(measured - route.distance) < 0.25, `${route.id}: ${measured} vs ${route.distance}`);
    for (let i = 1; i < points.length; i++) assert.ok(km(points[i - 1], points[i]) < 2, `${route.id}: discontinuity`);
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
    assert.ok(route.parking.id || route.parking.poiid);
    assert.ok(route.parking.condition && route.parking.evidence);
    assert.match(route.parking.source, /^https:\/\//);
    assert.equal(route.parking.checked, '2026-10-15');
    assert.match(route.parking.verification, /读取|声明/);
    assert.equal(route.parking.price, '¥0');
    if (route.window === 'night') {
      assert.match(route.parking.rule, /18:00/);
      assert.match(route.parking.rule, /08:30/);
    }
    assert.equal(route.dedicated, false, 'shared paths must not become dedicated cycleways');
  }
  assert.equal(app.ROUTE_METADATA.parkingCount, 5);
  assert.equal(app.ROUTE_METADATA.shopCount, 12, 'shared stores must be counted once');
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
      if (place.kind === '歇脚' && place.source.includes('openstreetmap')) assert.match(place.status, /设施|公园/);
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

test('new paths are made of permitted OSM edges and respect mapped one-way roads', () => {
 for (const route of app.ROUTES.filter(r => app.REGIONAL_PLANS[r.id])) {
  const plan = app.REGIONAL_PLANS[route.id];
  const elements = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root, 'research', route.region + '-osm.json.gz')))).elements;
  const ways = new Map(elements.filter(e => e.type === 'way').map(e => [e.id, e]));
  const points = app.MAP_DATA.paths[route.id];
  assert.equal(plan.segments.length, points.length - 1);
  plan.segments.forEach((segment, i) => {
   const way = ways.get(segment.way), tags = way.tags;
   assert.ok(!['no', 'private'].includes(tags.bicycle), route.id);
   assert.ok(!['no', 'private'].includes(tags.access), route.id);
   assert.ok(!['motorway', 'trunk', 'steps', 'construction'].includes(tags.highway), route.id);
   const coords = way.geometry.map(p => [p.lon, p.lat]);
   const forward = coords.some((p, j) => JSON.stringify(p) === JSON.stringify(points[i]) && JSON.stringify(coords[j + 1]) === JSON.stringify(points[i + 1]));
   const reverse = coords.some((p, j) => JSON.stringify(p) === JSON.stringify(points[i + 1]) && JSON.stringify(coords[j + 1]) === JSON.stringify(points[i]));
   assert.ok(forward || reverse, `${route.id}: no fabricated edge`);
   if ((tags['oneway:bicycle'] || tags.oneway) === 'yes') assert.ok(forward, `${route.id}: wrong-way riding`);
  });
 }
});
test('dated parking evidence and undated operator claims keep distinct conditions', () => {
 const qdh = app.ROUTES.find(r => r.id === 'qiandao-cafe').parking;
 assert.equal(qdh.published, '页面未标注');
 assert.match(qdh.condition, /非住客/);
 assert.match(qdh.verification, /需联系确认/);
 const tl = app.ROUTES.find(r => r.region === 'tonglu').parking;
 assert.match(tl.condition, /双休日/);
 assert.match(tl.condition, /不能停到/);
 const wetland = app.ROUTES.find(r => r.region === 'qiantangpark');
 assert.equal(wetland.parking.published, '2026-07-07');
 assert.equal(wetland.dedicated, false);
 assert.equal(app.ROUTES.every(r => r.dedicated === false), true, 'shared greenways are never advertised as exclusive bike lanes');
});

test('major regional water bodies are retained with multipolygon rings', () => {
 const lake = app.MAP_DATA.maps.qiandao.waterAreas.find(area => area.source === 162908);
 assert.ok(lake && lake.rings.length > 1, 'Qiandao Lake includes shoreline and island rings');
 assert.ok(app.MAP_DATA.maps.tonglu.waterAreas.some(area => area.source === 334800), 'Fuchun River polygon');
 const svg = app.makeMapSVG(app.ROUTES.find(route => route.id === 'qiandao-peninsula'));
 assert.match(svg, /data-water-area="162908"/);
 assert.match(svg, /fill-rule="evenodd"/);
});
