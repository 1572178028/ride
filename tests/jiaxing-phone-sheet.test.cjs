const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { ROUTES, MAP_DATA, NAVIGATION_GEOMETRY } = require('../src/data/index.js');
const { buildRouteNavigation } = require('../src/domain/route-navigation.js');
const { baiduCyclingRoute, navCity } = require('../src/shared/navigation.js');
test('Jiaxing phone sheet keeps every full, applicable single-leg and fallback URL identical to the website', () => {
  const html = fs.readFileSync('experiments/jiaxing-baidu/index.html', 'utf8');
  const sections = [...html.matchAll(/<section id="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g)];
  const routes = ROUTES.filter(r => r.id.startsWith('jiaxing-'));
  assert.equal(sections.length, 13);
  assert.equal(routes.length, 13);
  for (const r of routes) {
    const section = sections.find(s => s[1] === r.id);
    assert.ok(section, r.id);
    const links = [...section[2].matchAll(/href="(baidumap:[^"]+)"/g)].map(m => m[1].replaceAll('&amp;', '&'));
    const { plans, fallback } = buildRouteNavigation(r, MAP_DATA.paths[r.id], NAVIGATION_GEOMETRY[r.id]);
    const expected = [plans.full, ...(plans.outbound ? [plans.outbound, plans.inbound] : []), fallback];
    assert.deepEqual(links, expected.map(p => baiduCyclingRoute(p, navCity(r))), r.id);
    assert.ok(section[2].includes(`../../assets/maps/${r.id}.svg`));
  }
  assert.match(html, /打开 App 不等于通过/);
  assert.ok(!html.includes('target="_blank"'));
});
