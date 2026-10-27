// A phone test sheet, generated from the same route/waypoint owners as the site.
// Regenerate after changing Jiaxing geometry; opening a link is not a pass.
const fs = require('node:fs');
const { ROUTES, MAP_DATA, NAVIGATION_GEOMETRY } = require('../src/data/index.js');
const { buildRouteNavigation } = require('../src/domain/route-navigation.js');
const { baiduCyclingRoute, navCity } = require('../src/shared/navigation.js');
const { esc } = require('../src/shared/dom.js');
const routes = ROUTES.filter(r => r.id.startsWith('jiaxing-'));
const link = (r, points, label) => `<a href="${esc(baiduCyclingRoute(points, navCity(r)))}">${label}<small>${points.length - 2}点 · ${points.at(-1).km.toFixed(1)}km</small></a>`;
const rows = routes.map(r => {
  const { plans, fallback } = buildRouteNavigation(r, MAP_DATA.paths[r.id], NAVIGATION_GEOMETRY[r.id]);
  return `<section id="${r.id}" data-route="${r.id}"><h2>${esc(r.title)} <small>${r.id.slice(8)} · ${r.distance.toFixed(1)}km</small></h2><div class="links">${link(r, plans.full, '全程')}${plans.outbound ? link(r, plans.outbound, '去程') + link(r, plans.inbound, '返程') : ''}</div><details><summary>备用与地图对照</summary><div class="links">${link(r, fallback, '关键点备用')}</div><p>起点：${esc(plans.full[0].name)}。${plans.outbound ? '折返点：' + esc(plans.outbound.at(-1).name) + '。' : '闭合环线，不拆去返程。'}</p><img src="../../assets/maps/${r.id}.svg" width="1000" height="610" alt="${esc(r.title)}本站道路参考地图"><a href="../../#route=${r.id}">路线详情</a></details></section>`;
}).join('\n');
fs.writeFileSync('experiments/jiaxing-baidu/index.html', `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>嘉兴 · iPhone 百度验证清单</title><link rel="stylesheet" href="../../src/styles/tokens.css"><link rel="stylesheet" href="../puyang-baidu/style.css"><style>
main{max-width:760px;padding:12px 14px 32px}h1{font-size:22px;margin:10px 0}section{padding:12px;margin:12px 0}section h2{font-size:17px;margin:0 0 8px}small{font-size:12px;font-weight:400;display:block}p{margin:8px 0}.links{display:flex;gap:8px}.links a{flex:1;min-height:48px;text-align:center;text-decoration:none;background:var(--blue);color:var(--paper);border-radius:8px;padding:6px 8px;font-weight:700}.links a:hover{filter:brightness(.9)}.links a:active{filter:brightness(.8)}details{margin-top:8px}summary{min-height:36px}details .links{margin:8px 0}a{cursor:pointer}summary:focus-visible{outline:3px solid var(--blue)}
</style></head><body><main><a href="../../">← 返回路线库</a><h1>嘉兴 · iPhone 百度验证</h1><p>在 Safari 点击。每条确认：自行车模式、起终点、途经点顺序、路线图、公里数。百度重新规划，不是轨迹导入。</p><p class="notice">此页是待测清单，打开 App 不等于通过。可用 Safari「在页面上查找」搜索英文简称（如 juanhu）定位。请记录全程/去程/返程/备用分别的结果，不点击“开始导航”。</p>${rows}<p>地图数据 © OpenStreetMap contributors · ODbL。当前路段通行与收费以现场为准。</p><noscript>本清单为静态链接，无需 JavaScript。</noscript></main></body></html>\n`);
console.log(`Generated ${routes.length} Jiaxing phone test rows.`);
