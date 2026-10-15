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
for (const file of ['map-data.js', 'catalog.js', 'planning-data.js', 'regional-map-data.js', 'regional-catalog.js', 'huzhou-research.js', 'verified-map-data.js', 'verified-catalog.js', 'map-renderer.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), app, { filename: file });
}
function km(a, b) {
  const rad = Math.PI / 180;
  const q = Math.sin((b[1] - a[1]) * rad / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin((b[0] - a[0]) * rad / 2) ** 2;
  return 12742 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
}
test('route IDs and map paths are unique and complete', () => {
  assert.equal(app.ROUTES.length, 16);
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
test('distance variants belong to eleven main lines across eight actual areas', () => {
  const mains = app.ROUTES.filter(route => route.id === route.familyId);
  assert.equal(mains.length, 11);
  assert.equal(app.ROUTE_METADATA.familyCount, 11);
  assert.equal(app.ROUTE_METADATA.regionCount, 8);
  for (const variant of app.ROUTES) {
    const main = mains.find(route => route.id === variant.familyId);
    assert.ok(main, variant.id);
    assert.equal(variant.parking.id || variant.parking.poiid, main.parking.id || main.parking.poiid);
    assert.equal(variant.familyTitle, main.familyTitle);
  }
});
test('research directions cannot claim free parking or inflate the ride catalog', () => {
  assert.equal(app.EXPANSION_CANDIDATES.length, 6);
  assert.ok(app.ROUTES.some(route => route.region === 'westlake'));
  assert.ok(app.RESEARCH_MAPS.some(route => route.region === 'jiapu'));
  assert.ok(app.ROUTES.some(route => route.region === 'qiandao'));
  assert.equal(app.RESEARCH_MAP.parking, undefined);
  for (const candidate of app.EXPANSION_CANDIDATES) {
    assert.match(candidate.status, /待核查/);
    assert.match(candidate.missing, /停车/);
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
    if (route.parking.feeType === 'free') assert.equal(route.parking.price, '¥0');
    else { assert.equal(route.parking.feeType, 'paid'); assert.notEqual(route.parking.price, '¥0'); assert.ok(route.parking.priceSummary && route.parking.condition); }
    if (route.window === 'night') {
      assert.match(route.parking.rule, /18:00/);
      assert.match(route.parking.rule, /08:30/);
    }
    assert.equal(route.dedicated, false, 'shared paths must not become dedicated cycleways');
  }
  assert.equal(app.ROUTE_METADATA.parkingCount, 8);
  assert.equal(app.ROUTE_METADATA.freeParkingCount, 5);
  assert.equal(app.ROUTE_METADATA.paidParkingCount, 3);
  assert.equal(app.ROUTE_METADATA.shopCount, 22, 'shared stores must be counted once');
});
test('all supply types render distinct markers, names, evidence status and per-type filtering', () => {
  for (const route of app.ROUTES) {
    const svg = app.makeMapSVG(route);
    assert.equal((svg.match(/data-poi="supply-/g) || []).length, route.supply.length);
    for (const kind of ['咖啡', '茶饮', '餐厅', '歇脚']) {
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
  const elements = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root, 'research', (plan.snapshot || route.region) + '-osm.json.gz')))).elements;
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
   const direction = tags['oneway:bicycle'] || tags.oneway || (tags.junction === 'roundabout' ? 'yes' : 'no');
   if (['yes','1','true'].includes(direction)) assert.ok(forward, `${route.id}: wrong-way riding`);
   if (direction === '-1') assert.ok(reverse, `${route.id}: wrong-way riding`);
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

// Huzhou is a researched candidate set until real geometry and all parking conditions exist.
test('Huzhou research keeps six incomplete directions separate without publishing incomplete rides', () => {
 const candidates = app.EXPANSION_CANDIDATES.filter(c => c.researchCity === 'huzhou');
 assert.deepEqual(Array.from(candidates, c => c.id).sort(), [
  'huzhou-badu-research', 'huzhou-huaxi-research',
  'huzhou-jiapu-research', 'huzhou-lijiaxiang-research', 'huzhou-lougang-research',
  'huzhou-nanxun-research'
 ].sort());
 for (const candidate of candidates) {
  assert.equal(candidate.city, '湖州市');
  assert.equal(candidate.checked, '2026-10-15');
  assert.match(candidate.status, /非可出行方案/);
  assert.ok(candidate.parkingNote && candidate.roadNote && candidate.foodNote);
  assert.ok(candidate.sources.length > 0);
  for (const [title, url] of candidate.sources) {
   assert.ok(title); assert.match(url, /^https:\/\//);
  }
  assert.equal(candidate.distance, undefined);
  assert.equal(candidate.start, undefined);
  assert.equal(app.MAP_DATA.paths[candidate.id], undefined);
 }
});

test('paid routes keep reference charges separate from free parking and unpublished policies', () => {
  const paid = app.ROUTES.filter(r => r.parking.feeType === 'paid');
  assert.deepEqual(Array.from(paid, r => r.id).sort(), ['mogan-foothills', 'westlake-road', 'westlake-tea-road', 'yucun-villages']);
  for (const r of paid) {
    assert.notEqual(r.parking.price, '¥0');
    assert.ok(r.parking.namedNavigation, 'area pins must use name lookup');
    assert.ok(r.city && r.parking.precision && r.parking.evidence);
    const svg = app.makeMapSVG(r);
    assert.match(svg, /data-poi="parking"/);
    assert.match(svg, /data-poi="start"/, 'parking area and road start have distinct source locations');
    assert.ok(fs.existsSync(path.join(root, 'maps', r.id + '.svg')));
    assert.ok(fs.existsSync(path.join(root, 'maps', r.id + '.png')));
  }
  const yucun = paid.find(r => r.region === 'yucun');
  assert.match(yucun.parking.published, /未显示年份/);
  assert.match(yucun.parking.condition, /不能据此承诺/);
  const mogan = paid.find(r => r.region === 'mogan');
  assert.match(mogan.parking.condition, /30分钟/);
  assert.match(mogan.parking.condition, /参考价格/);
  assert.equal(app.ROUTES.filter(r => r.parking.feeType === 'free').length, 12);
});

test('research previews use real edges and never draw a free parking pin', () => {
  const jiapu = app.RESEARCH_MAPS.find(r => r.region === 'jiapu');
  assert.ok(jiapu && jiapu.research && !jiapu.parking);
  const points = app.MAP_DATA.paths[jiapu.id], plan = app.REGIONAL_PLANS[jiapu.id];
  const snapshot = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root, 'research', plan.snapshot + '-osm.json.gz'))));
  const ways = new Map(snapshot.elements.filter(e => e.type === 'way').map(e => [e.id, e]));
  assert.equal(plan.segments.length, points.length - 1);
  plan.segments.forEach((segment, i) => {
    const way = ways.get(segment.way), coords = way.geometry.map(p => [p.lon, p.lat]);
    assert.ok(coords.some((p, j) => JSON.stringify(p) === JSON.stringify(points[i]) && JSON.stringify(coords[j + 1]) === JSON.stringify(points[i + 1]))
      || coords.some((p, j) => JSON.stringify(p) === JSON.stringify(points[i + 1]) && JSON.stringify(coords[j + 1]) === JSON.stringify(points[i])));
  });
  assert.ok(!app.makeMapSVG(jiapu, { export: true }).includes('data-poi="parking"'));
  assert.ok(!app.ROUTES.some(r => r.id === jiapu.id));
});
