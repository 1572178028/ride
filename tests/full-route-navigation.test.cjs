const {test}=require('node:test');
const assert=require('node:assert/strict');
const {ROUTES,MAP_DATA}=require('../src/data/index.js');
const domain=()=>require('../src/domain/route-waypoints.js');
const navigation=require('../src/shared/navigation.js');

test('Puyang density keeps outbound, turnaround and return nodes on the stored road path',()=>{
 const {selectRouteWaypoints}=domain(),r=ROUTES.find(r=>r.id==='puyang-greenway'),path=MAP_DATA.paths[r.id];
 const points=selectRouteWaypoints(path,r.stops);
 assert.equal(points.length,13); // 11 intermediate points for a 16.7km ride.
 assert.equal(points[0].index,0);assert.equal(points.at(-1).index,384);
 for(const index of [21,104,192,280,363])assert.ok(points.some(p=>p.index===index),'mandatory road node '+index);
 assert.deepEqual(points.map(p=>p.index),points.map(p=>p.index).toSorted((a,b)=>a-b));
 for(const p of points)assert.deepEqual(p.point,path[p.index]);
 assert.ok(points.filter(p=>p.index<192).length>3);assert.ok(points.filter(p=>p.index>192).length>3);
 assert.ok(points.at(-1).km>16.6&&points.at(-1).km<16.8);
});

test('longer paths receive more waypoints and short or empty paths do not invent points',()=>{
 const {selectRouteWaypoints}=domain();
 const line=Array.from({length:101},(_,i)=>[120+i*0.001,30]);
 assert.ok(selectRouteWaypoints(line,[]).length>selectRouteWaypoints(line.slice(0,21),[]).length);
 assert.deepEqual(selectRouteWaypoints([],[]),[]);
 assert.deepEqual(selectRouteWaypoints([[120,30]],[]),[]);
 assert.deepEqual(selectRouteWaypoints([[120,30],[120,30]],[]),[]);
 assert.equal(selectRouteWaypoints([[120,30],[120.001,30]],[]).length,2);
 assert.ok(selectRouteWaypoints(line.map(([lng,lat])=>[lng+(lng-120)*10,lat]),[]).length<=17);
});

test('Baidu whole-route URI preserves loop endpoints and ordered repeated waypoints with correct coordinate conversion',()=>{
 assert.equal(typeof navigation.baiduCyclingRoute,'function');
 const r=ROUTES.find(r=>r.id==='puyang-greenway'),points=domain().selectRouteWaypoints(MAP_DATA.paths[r.id],r.stops);
 const u=new URL(navigation.baiduCyclingRoute(points,'杭州市'));
 assert.equal(u.protocol,'baidumap:');assert.equal(u.host,'map');assert.equal(u.pathname,'/direction');
 assert.equal(u.searchParams.get('mode'),'riding');assert.equal(u.searchParams.get('coord_type'),'gcj02');
 assert.equal(u.searchParams.get('origin'),u.searchParams.get('destination'));
 assert.match(u.searchParams.get('origin'),/30\.036059,120\.252672/);
 const via=JSON.parse(u.searchParams.get('viaPoints')).viaPoints;
 assert.equal(via.length,11);
 assert.ok(via.some(p=>p.name==='义桥方向折返点'));
 assert.equal(via.filter(p=>p.name==='西市街接驳后绿道口').length,2);
 assert.ok(via.every(p=>p.lat>30&&p.lat<31&&p.lng>120&&p.lng<121));
 assert.ok(!u.href.includes('+')&&!/NaN|undefined/.test(u.href));
 assert.equal(navigation.baiduCyclingRoute([],'杭州市'),null);
});

test('route details offer direct whole-route and tested fallback only for Puyang without opening blank tabs',()=>{
 const {routeDetailHTML}=require('../src/features/routes/detail.js');
 for(const r of ROUTES){
  const html=routeDetailHTML(r,{supplyKind:'all'});
  if(r.id==='puyang-greenway'){
   assert.match(html,/class="nav-primary full-route-open" href="baidumap:/);
   assert.match(html,/class="full-route-fallback" href="baidumap:/);
   assert.doesNotMatch(html,/<a[^>]*class="(?:nav-primary full-route-open|full-route-fallback)"[^>]*target=/);
   assert.doesNotMatch(html,/route-test-link/);
  }else assert.doesNotMatch(html,/full-route-open/);
 }
});
