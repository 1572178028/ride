const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),zlib=require('node:zlib');
const {ROUTES,MAP_DATA,REGIONAL_PLANS}=require('../src/data/index.js');
const ids=['qiandao-shangjiang','qiandao-northeast'];
test('Qiandao additions have complete roads, honest distances and public roadside parking',()=>{
 for(const id of ids){
  const r=ROUTES.find(r=>r.id===id);assert.ok(r,'missing new route '+id);
  const p=MAP_DATA.paths[id],g=REGIONAL_PLANS[id];
  assert.deepEqual(p[0],p.at(-1));assert.equal(g.segments.length,p.length-1);
  assert.equal(r.parking.feeBasis,'user-default-roadside');assert.equal(r.city,'杭州市');
  assert.equal(r.dedicated,false);assert.ok(g.parkingSnapMetres<50);
  assert.ok(Math.abs(g.segments.reduce((s,e)=>s+e.km,0)-r.distance)<0.06);
  assert.ok(r.notes.some(n=>/不是.*轨迹|非.*轨迹/.test(n)));
 }
 assert.equal(ROUTES.find(r=>r.id===ids[0]).shape,'完整往返');
 assert.equal(ROUTES.find(r=>r.id===ids[1]).shape,'环线');
 assert.ok(ROUTES.find(r=>r.id===ids[0]).distance>20);
 assert.ok(ROUTES.find(r=>r.id===ids[1]).distance>48);
});
test('Qiandao paths keep raw OSM tags, directed edges and push-only bridge access separate',()=>{
 for(const id of ids){
  const g=REGIONAL_PLANS[id];assert.ok(g,'missing checked geometry '+id);
  const data=JSON.parse(zlib.gunzipSync(fs.readFileSync('research/'+g.snapshot+'-osm.json.gz')));
  const ways=new Map(data.elements.filter(e=>e.type==='way').map(e=>[e.id,e]));
  g.segments.forEach((s,i)=>{
   const w=ways.get(s.way),t=w.tags,coords=w.geometry.map(p=>[p.lon,p.lat]);
   const forward=coords.some((p,j)=>JSON.stringify(p)===JSON.stringify(MAP_DATA.paths[id][i])&&JSON.stringify(coords[j+1])===JSON.stringify(MAP_DATA.paths[id][i+1]));
   const reverse=coords.some((p,j)=>JSON.stringify(p)===JSON.stringify(MAP_DATA.paths[id][i+1])&&JSON.stringify(coords[j+1])===JSON.stringify(MAP_DATA.paths[id][i]));
   assert.ok(forward||reverse,'disconnected '+s.way);
   const direction=t['oneway:bicycle']||t.oneway;
   if(['yes','1','true'].includes(direction))assert.ok(forward);
   if(direction==='-1')assert.ok(reverse);
   assert.ok(!['motorway','trunk','trunk_link','steps','construction'].includes(t.highway));
   if(s.mode==='push'){assert.ok(g.pushWays.includes(s.way));assert.equal(t.highway,'footway');assert.equal(t.bicycle,undefined);}
   else if(t.tunnel==='yes')assert.ok(t.highway==='cycleway'||(t.bicycle==='yes'&&t.motor_vehicle==='no'));
  });
 }
 const ne=REGIONAL_PLANS[ids[1]];assert.ok(ne.pushKm>1&&ne.pushKm<1.6);
});
test('Qiandao navigation shows three directions for the return and one complete circuit',()=>{
 const {routeDetailHTML}=require('../src/features/routes/detail.js');
 for(const id of ids){const r=ROUTES.find(r=>r.id===id);assert.ok(r,'missing detail '+id);
  const html=routeDetailHTML(r,{supplyKind:'all'});assert.match(html,/full-route-open/);assert.match(html,/full-route-fallback/);
  if(id===ids[0])assert.match(html,/full-route-outbound/);else assert.doesNotMatch(html,/full-route-outbound/);
 }
});
