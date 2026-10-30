const {test}=require('node:test'),assert=require('node:assert/strict');
const {ROUTES,ROUTE_METADATA}=require('../src/data/index.js');
const {matchesRoute}=require('../src/domain/route-filters.js');
const {routeCardHTML}=require('../src/features/routes/card.js');
const filters={search:'',city:'all',region:'qiandao',distance:'all',parking:'all',lane:'all',favoritesOnly:false};
const ids=['qiandao-cafe','qiandao-peninsula','qiandao-shangjiang','qiandao-center-short','qiandao-center-shangjiang','qiandao-lake-loop','qiandao-northeast'];
test('one Qiandao area exposes all seven independently maintained route plans',()=>{
 const routes=ROUTES.filter(r=>matchesRoute(r,filters,new Set()));
 assert.deepEqual(routes.map(r=>r.id),ids);
 assert.equal(new Set(routes.map(r=>r.familyId)).size,4);
 assert.equal(ROUTE_METADATA.familyCount,49);
 assert.equal(ROUTE_METADATA.regionCount,45);
 for(const r of routes){
  const html=routeCardHTML([...routes],{selected:r,saved:new Set()});
  assert.match(html,/<h3>千岛湖<\/h3>/);assert.match(html,/route-card selected/);
  assert.match(html,new RegExp('data-select="'+r.id+'"'));
 }
});
test('Qiandao grouping respects search, distance and per-plan favorites',()=>{
 const select=f=>ROUTES.filter(r=>matchesRoute(r,{...filters,...f},new Set(['qiandao-northeast']))).map(r=>r.id);
 assert.deepEqual(select({distance:'long'}),[ids[2],ids[4],ids[5],ids[6]]);
 assert.deepEqual(select({search:'东北湖区'}),[ids[6]]);
 assert.deepEqual(select({favoritesOnly:true}),[ids[6]]);
});
