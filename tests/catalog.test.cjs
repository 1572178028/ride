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
for (const file of ['map-data.js', 'catalog.js', 'planning-data.js', 'regional-map-data.js', 'regional-catalog.js', 'huzhou-research.js', 'verified-map-data.js', 'verified-catalog.js', 'expanded-catalog.js', 'city-catalog.js', 'research-updates.js', 'night-catalog.js', 'photo-data.js', 'catalog-metadata.js', 'map-renderer.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), app, { filename: file });
}
function km(a, b) {
  const rad = Math.PI / 180;
  const q = Math.sin((b[1] - a[1]) * rad / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin((b[0] - a[0]) * rad / 2) ** 2;
  return 12742 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
}
test('route IDs and map paths are unique and complete', () => {
  assert.equal(app.ROUTES.length, 30);
  assert.equal(new Set(app.ROUTES.map(route => route.id)).size, app.ROUTES.length);
  for (const route of app.ROUTES) {
    const points = app.MAP_DATA.paths[route.id];
    assert.ok(points.length >= 10, route.id);
    for (const point of [...points, ...route.supply.map(place => place.point)]) {
      assert.ok(point.length === 2 && point.every(Number.isFinite), route.id);
      assert.ok(point[0] > 119 && point[0] < 122 && point[1] > 29 && point[1] < 31.2, route.id);
    }
    assert.ok(km(points[0], route.parking.point) < 0.5, `${route.id}: road start must be near parking area`);
    if (route.shape !== '原路往返') assert.ok(km(points[0], points.at(-1)) < 0.01, `${route.id}: closed loop`);
  }
});
test('distance variants belong to eighteen main lines across fifteen actual areas', () => {
  const mains = app.ROUTES.filter(route => route.id === route.familyId);
  assert.equal(mains.length, 18);
  assert.equal(app.ROUTE_METADATA.familyCount, 18);
  assert.equal(app.ROUTE_METADATA.regionCount, 15);
  for (const variant of app.ROUTES) {
    const main = mains.find(route => route.id === variant.familyId);
    assert.ok(main, variant.id);
    assert.equal(variant.parking.id || variant.parking.poiid, main.parking.id || main.parking.poiid);
    assert.equal(variant.familyTitle, main.familyTitle);
  }
});
test('research directions cannot claim free parking or inflate the ride catalog', () => {
  assert.equal(app.EXPANSION_CANDIDATES.length, 12);
  assert.ok(app.ROUTES.some(route => route.region === 'westlake'));
  assert.ok(app.RESEARCH_MAPS.some(route => route.region === 'jiapu'));
  assert.ok(app.ROUTES.some(route => route.region === 'qiandao'));
  assert.equal(app.RESEARCH_MAP.parking, undefined);
  for (const candidate of app.EXPANSION_CANDIDATES) {
    assert.match(candidate.status, /待核查|已复核/);
    assert.ok(candidate.missing.trim().length > 0);
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
    assert.match(route.parking.source, /^https?:\/\//);
    assert.equal(route.parking.checked, ['huaxi','nanhu','jinhua','canal','binjiang','qianjiang'].includes(route.region) ? '2026-10-16' : '2026-10-15');
    assert.match(route.parking.verification, /读取|声明|对照/);
    if (route.parking.feeType === 'free') assert.equal(route.parking.price, '¥0');
    else { assert.ok(['paid','unknown'].includes(route.parking.feeType)); assert.notEqual(route.parking.price, '¥0'); assert.ok(route.parking.priceSummary && route.parking.condition); }
    if (route.window === 'night') {
      assert.ok(route.nightRide && route.nightRide.lighting && route.nightRide.parking);
      if (route.region === 'xianghu') {
        assert.match(route.parking.rule, /18:00/);
        assert.match(route.parking.rule, /08:30/);
      } else if (route.region === 'westlake') {
        assert.ok(['westlake-beishan-night', 'westlake-nanshan-night'].includes(route.id));
        assert.match(route.parking.rule, /20:00/);
        assert.match(route.parking.rule, /8:00/);
      }
    }
    assert.equal(route.dedicated, false, 'shared paths must not become dedicated cycleways');
  }
  assert.equal(app.ROUTE_METADATA.parkingCount, 15);
  assert.equal(app.ROUTE_METADATA.freeParkingCount, 5);
  assert.equal(app.ROUTE_METADATA.paidParkingCount, 6);
  assert.equal(app.ROUTE_METADATA.shopCount, 28, 'shared stores must be counted once');
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
test('Huzhou keeps four directions separate while Jiapu and Huaxi have explicit parking data', () => {
 const candidates = app.EXPANSION_CANDIDATES.filter(c => c.researchCity === 'huzhou');
 assert.deepEqual(Array.from(candidates, c => c.id).sort(), [
  'huzhou-badu-research', 'huzhou-lijiaxiang-research', 'huzhou-lougang-research',
  'huzhou-nanxun-research'
 ].sort());
 for (const candidate of candidates) {
  assert.equal(candidate.city, '湖州市');
  assert.equal(candidate.checked, ['huzhou-badu-research','huzhou-lijiaxiang-research'].includes(candidate.id) ? '2026-10-16' : '2026-10-15');
  assert.ok(!app.ROUTES.some(r => r.id === candidate.id));
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
  assert.deepEqual(Array.from(paid, r => r.id).sort(), ['binjiang-wentao-night', 'binjiang-wentao-short-night', 'canal-streets', 'mogan-foothills', 'qianjiang-city-night', 'westlake-beishan-night', 'westlake-nanshan-night', 'westlake-road', 'westlake-tea-road', 'yucun-villages']);
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

test('new cities and parking fee categories remain explicit and deduplicated', () => {
  assert.equal(app.ROUTE_METADATA.cityCount, 4);
  assert.equal(app.ROUTE_METADATA.unknownParkingCount, 4);
  assert.equal(app.ROUTE_METADATA.restSuggestionCount, 39);
  for (const r of app.ROUTES) {
    assert.ok(app.CITY_LABELS[r.cityGroup] && app.REGION_LABELS[r.region], r.id);
    if (['nanhu', 'jinhua', 'canal'].includes(r.region)) assert.equal(r.city, { nanhu: '嘉兴市', jinhua: '金华市', canal: '杭州市' }[r.region]);
    if (r.parking.feeType === 'unknown') {
      assert.equal(r.parking.price, '待确认');
      assert.match(r.parking.rule, /待确认|未在正文标明|以场内公示/);
    }
    assert.ok(!r.food.some(p => /必胜客|Tims/.test(p.name)), 'unverified branch leads do not inflate shop counts');
  }
  assert.equal(app.ROUTE_METADATA.freeParkingCount + app.ROUTE_METADATA.paidParkingCount + app.ROUTE_METADATA.unknownParkingCount, app.ROUTE_METADATA.parkingCount);
});

test('north Beishan night ride uses lit roads and never advertises tea hills as fully lit', () => {
  const plan = app.REGIONAL_PLANS['westlake-beishan-night'];
  const snapshot = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root, 'research', plan.snapshot + '-osm.json.gz'))));
  const ways = new Map(snapshot.elements.filter(e => e.type === 'way').map(e => [e.id, e.tags]));
  for (const segment of plan.segments) assert.equal(ways.get(segment.way).lit, 'yes');
  assert.ok(Math.abs(plan.lightingMappedKm - plan.distance) < 0.1);
  assert.equal(app.ROUTES.find(r => r.id === 'westlake-tea-road').window, 'day');
  assert.equal(app.ROUTES.find(r => r.id === 'canal-streets').window, 'day');
  assert.ok(app.EXPANSION_CANDIDATES.some(c => c.id === 'hangzhou-canal-night-research'));
});

test('round trips never reverse one-way edges, and Nanhu avoids road tunnels', () => {
  for (const r of app.ROUTES.filter(r => app.REGIONAL_PLANS[r.id])) {
    const plan = app.REGIONAL_PLANS[r.id];
    const snapshot = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root, 'research', (plan.snapshot || r.region) + '-osm.json.gz'))));
    const ways = new Map(snapshot.elements.filter(e => e.type === 'way').map(e => [e.id, e.tags]));
    for (const seg of plan.segments) {
      const tags = ways.get(seg.way), direction = tags['oneway:bicycle'] || tags.oneway || (tags.junction === 'roundabout' ? 'yes' : 'no');
      if (r.shape === '原路往返') assert.ok(!['yes', '1', 'true', '-1'].includes(direction), r.id);
      if (r.region === 'nanhu') assert.notEqual(tags.tunnel, 'yes');
      assert.ok(!Object.keys(tags).some(k => ['bicycle:conditional', 'access:conditional', 'vehicle:conditional'].includes(k)), r.id);
    }
  }
});

test('new city lakes preserve actual shoreline and island polygons', () => {
  assert.ok(app.MAP_DATA.maps.nanhu.waterAreas.some(a => a.source === 3808151 && a.rings.length > 1));
  assert.ok(app.MAP_DATA.maps.didang.waterAreas.some(a => a.source === 6039798 && a.rings.length > 1));
  const preview = app.RESEARCH_MAPS.find(r => r.id === 'didang-research');
  assert.ok(preview && !preview.parking);
  assert.ok(!app.makeMapSVG(preview, { export: true }).includes('data-poi="parking"'));
  assert.ok(!app.ROUTES.some(r => r.region === 'didang'), 'unmatched parking cannot publish a ride');
  assert.ok(!app.ROUTES.some(r => r.region === 'shaoxing-eastlake'), 'incorrect old parking location must not publish');
});

test('local and external licensed photos are attributed and attached to their actual subject', () => {
  const licenses = JSON.parse(fs.readFileSync(path.join(root, 'research/photo-licenses.json')));
  assert.equal(licenses.length, 10);
  for (const r of [...app.ROUTES, ...app.EXPANSION_CANDIDATES]) for (const photo of r.photos || []) {
    const record = licenses.find(p => p.src === photo.src);
    assert.ok(record && record.author === photo.author && record.license === photo.license);
    assert.ok(photo.source.startsWith('https://commons.wikimedia.org/wiki/File:'));
    assert.ok(photo.date && photo.licenseUrl && photo.modification && photo.caption);
    if (photo.storage === 'external') assert.ok(['upload.wikimedia.org','thumb.wikimedia.org'].includes(new URL(photo.src).hostname));
    else assert.ok(fs.existsSync(path.join(root, photo.src)));
    const expected = r.region === 'westlake' ? 'beishan-road' : r.region === 'nanhu' ? 'nanhu' : r.region === 'xianghu' ? 'xianghu' : r.id === 'shaoxing-eastlake-research' ? 'shaoxing' : 'jinhua';
    assert.equal(photo.group, expected);
  }
  assert.equal(app.ROUTE_METADATA.photoCount, 7, 'five local and two external landscape references belong to published rides');
});

test('webpage and export generator load the same final data files', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const files = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1].split('?')[0]).filter(f => f !== 'app.js');
  const generator = fs.readFileSync(path.join(root, 'scripts/generate-maps.cjs'), 'utf8');
  let position = -1;
  for (const file of files) {
    const next = generator.indexOf("'" + file + "'");
    assert.ok(next > position, file);
    position = next;
  }
  for (const r of app.ROUTES) for (const ext of ['svg', 'png']) assert.ok(fs.existsSync(path.join(root, 'maps', r.id + '.' + ext)), r.id);
});


test('geotagged Beishan landscape keeps its date and cannot imply permission to ride the promenade', () => {
  const r = app.ROUTES.find(r => r.id === 'westlake-beishan-night');
  const photo = r.photos.find(p => p.point);
  assert.ok(photo && photo.kind === 'landscape');
  assert.ok(Math.min(...app.MAP_DATA.paths[r.id].map(p => km(p, photo.point))) < 0.1);
  assert.equal(photo.date, '2011-11-23');
  assert.match(photo.caption, /人行道.*非本线骑行路面/);
  assert.match(photo.caption, /不代表当前路况或夜间照明/);
});

test('follow-up audit excludes closed parking and retains new map evidence without publishing research rides', () => {
  for (const c of app.EXPANSION_CANDIDATES) {
    assert.equal(c.reviewedAt, '2026-10-16');
    assert.ok(c.reviewOutcome && c.missing && c.parkingNote && c.roadNote);
    assert.ok(!app.ROUTES.some(r => r.id === c.id));
  }
  const closed = app.ROUTES.find(r => r.id === 'binjiang-wentao-night').parking;
  assert.ok(closed.excludedParking.includes('520287620'));
  assert.match(closed.evidence, /停用/);
  for (const r of app.ROUTES) assert.notEqual(r.parking.id, '520287620');
  const jianhu = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root, 'research/shaoxing-jianhu-review-osm.json.gz'))));
  const lane = jianhu.elements.find(e => e.id === 1246053702 && e.type === 'way');
  assert.equal(lane.tags.bicycle, 'designated');
  const parking = jianhu.elements.find(e => e.id === 1327461263 && e.type === 'way');
  assert.equal(parking.tags.fee, 'yes');
  assert.equal(parking.tags['fee:conditional'], 'no @ stay < 30 minutes');
  assert.ok(jianhu.elements.some(e => e.type === 'relation' && e.id === 11335116));
  for (const name of ['jiaxing-xiuzhou-review', 'shaoxing-jianhu-review']) {
    const data = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root, 'research', name + '-osm.json.gz'))));
    assert.equal(data.source.checked, '2026-10-16');
    assert.ok(data.elements.every(e => !e.uid && !e.user));
  }
});

test('Hangzhou adds four night plans with explicit lighting gaps, conditional parking and legal mapped directions', () => {
  const ids = ['westlake-nanshan-night','binjiang-wentao-night','binjiang-wentao-short-night','qianjiang-city-night'];
  for (const id of ids) {
    const r = app.ROUTES.find(r => r.id === id), plan = app.REGIONAL_PLANS[id];
    assert.equal(r.window, 'night'); assert.equal(r.cityGroup, 'hangzhou');
    assert.equal(r.parking.feeType, 'paid'); assert.ok(r.nightRide.lightingSource);
    assert.match(r.nightRide.parking, /确认|核对/);
    assert.ok(r.sources.some(s => s[1].includes('2026-10/12')));
    const data = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root, 'research', plan.snapshot + '-osm.json.gz'))));
    const ways = new Map(data.elements.filter(e => e.type === 'way').map(e => [e.id, e]));
    let lit = 0;
    for (const seg of plan.segments) {
      const t = ways.get(seg.way).tags;
      assert.notEqual(t.tunnel, 'yes'); assert.notEqual(t.highway, 'service');
      if (t.lit === 'yes') lit += seg.km;
      if (t.highway === 'footway') assert.ok(['yes','designated'].includes(t.bicycle));
    }
    assert.ok(Math.abs(lit - r.lightingMappedKm) < .01);
    assert.ok(r.lightingMappedKm < r.distance, 'partial lighting must stay partial');
  }
  for (const region of ['binjiang','qianjiang']) assert.ok(app.MAP_DATA.maps[region].waterAreas.some(a => a.source === 8227206));
  assert.ok(app.MAP_DATA.maps.westlake.waterAreas.some(a => a.source === 2308774 && a.rings.length > 1));
  const short = app.ROUTES.find(r => r.id === ids[2]), long = app.ROUTES.find(r => r.id === ids[1]);
  assert.equal(short.familyId, long.id); assert.equal(short.parking.id, long.parking.id);
  assert.ok(short.distance < long.distance);
  const city = app.ROUTES.find(r => r.id === ids[3]);
  assert.match(city.parking.rule, /5元.*小时/);
  assert.ok(!city.parking.rule.includes('5元/次'));
  assert.ok(city.food.some(p => p.kind === '咖啡' && p.namedNavigation && p.location.includes('非店门')));
  const lake = app.EXPANSION_CANDIDATES.find(c => c.id === 'hangzhou-qingshan-night-research');
  assert.match(lake.roadNote, /恢复/); assert.ok(!app.ROUTES.some(r => /qingshan/.test(r.id)));
});
