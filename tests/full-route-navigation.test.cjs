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

test('every route detail offers a direct full route and fallback without blank tabs or copied Puyang claims',()=>{
 const {routeDetailHTML}=require('../src/features/routes/detail.js');
 for(const r of ROUTES){
  const html=routeDetailHTML(r,{supplyKind:'all'});
   assert.match(html,/class="nav-primary full-route-open" href="baidumap:/);
   assert.match(html,/class="full-route-fallback" href="baidumap:/);
  if(/往返|折返/.test(r.shape)){
   assert.match(html,/class="full-route-outbound" href="baidumap:/);
   assert.match(html,/class="full-route-inbound" href="baidumap:/);
   assert.doesNotMatch(html,/<a[^>]*class="(?:nav-primary full-route-open|full-route-fallback|full-route-outbound|full-route-inbound)"[^>]*target=/);
   assert.doesNotMatch(html,/route-test-link/);
  }else assert.doesNotMatch(html,/class="full-route-(?:outbound|inbound)"/);
  if(r.id!=='puyang-greenway') assert.doesNotMatch(html,/临浦|义桥|用户已|先前已测/);
 }
});

test('Puyang one-way plans split the dense loop at its real turnaround and keep each direction in travel order',()=>{
 const {buildRoutePlans}=domain();assert.equal(typeof buildRoutePlans,'function');
 const r=ROUTES.find(r=>r.id==='puyang-greenway');
 const plans=buildRoutePlans(MAP_DATA.paths[r.id],r.stops,r.shape);
 assert.equal(plans.full.length,13);
 assert.equal(plans.outbound.length,7);assert.equal(plans.inbound.length,7);
 assert.deepEqual(plans.outbound.map(p=>p.index),[0,21,58,104,127,148,192]);
 assert.deepEqual(plans.inbound.map(p=>p.index),[192,236,257,280,326,363,384]);
 assert.equal(plans.inbound[0].km,0);
 for(const leg of [plans.outbound,plans.inbound]){
  assert.ok(leg.at(-1).km>8.3&&leg.at(-1).km<8.4);
  const u=new URL(navigation.baiduCyclingRoute(leg,'杭州市'));
  assert.notEqual(u.searchParams.get('origin'),u.searchParams.get('destination'));
  assert.equal(JSON.parse(u.searchParams.get('viaPoints')).viaPoints.length,5);
 }
 const out=new URL(navigation.baiduCyclingRoute(plans.outbound,'杭州市'));
 const back=new URL(navigation.baiduCyclingRoute(plans.inbound,'杭州市'));
 assert.equal(out.searchParams.get('origin'),back.searchParams.get('destination'));
 assert.equal(out.searchParams.get('destination'),back.searchParams.get('origin'));
});

test('closed circuits stay one plan even though they return to the same origin',()=>{
 const {buildRoutePlans}=domain();assert.equal(typeof buildRoutePlans,'function');
 const a=[120,30],b=[120.01,30],c=[120.01,30.01],d=[120,30.01];
 for(const shape of ['环线','双环线','闭合道路方案']){
  const plans=buildRoutePlans([a,b,c,d,a],[{point:c,name:'沿途地点'}],shape);
  assert.deepEqual(Object.keys(plans),['full']);
  const r=ROUTES.find(r=>r.id==='puyang-greenway');
  const html=require('../src/features/routes/full-route.js').fullRouteHTML({...r,shape});
  assert.match(html,/full-route-open/);
  assert.doesNotMatch(html,/class="full-route-(?:outbound|inbound)"/);
 }
 // Return geometry may use different permitted roads; never just reverse outbound.
 const plans=buildRoutePlans([a,b,c,d,a],[{point:b,name:'去程道路'},{point:d,name:'返程道路'},{point:c,name:'折返点'}],'往返环路');
 assert.deepEqual(plans.inbound.map(p=>p.point),[c,d,a]);
});

test('all navigation plans close the full route and split at the maintained actual turnaround',()=>{
 const {buildRouteNavigation}=require('../src/domain/route-navigation.js');
 const {NAVIGATION_GEOMETRY}=require('../src/data/index.js');
 let returns=0,circuits=0;
 for(const r of ROUTES){
  const n=buildRouteNavigation(r,MAP_DATA.paths[r.id],NAVIGATION_GEOMETRY[r.id]);
  assert.deepEqual(n.plans.full[0].point,n.plans.full.at(-1).point,r.id);
  assert.ok(n.plans.full.length>=5&&n.plans.full.length<=17,r.id);
  assert.ok(n.fallback.length>=3&&n.fallback.length<n.plans.full.length,r.id+': fallback must reduce waypoints');
  assert.notEqual(navigation.baiduCyclingRoute(n.fallback,'测试城市'),navigation.baiduCyclingRoute(n.plans.full,'测试城市'),r.id);
  if(n.plans.outbound){returns++;assert.deepEqual(n.plans.outbound.at(-1).point,n.plans.inbound[0].point);assert.equal(n.plans.inbound[0].km,0);}
  else circuits++;
  if(r.id!=='xianghu-hegong') assert.ok(Math.abs(n.plans.full.at(-1).km-r.distance)<0.25,r.id);
 }
 assert.equal(returns,45);assert.equal(circuits,23);
 for(const[id,index]of[['westlake-tea-road',601],['meiling-south-road',228],['eastlake-outskirts',22]]){
  const r=ROUTES.find(r=>r.id===id),n=buildRouteNavigation(r,MAP_DATA.paths[id]);
  assert.equal(n.plans.outbound.at(-1).index,index,id);
 }
});

test('a complete stored return path is not doubled just because its label says original-road return',()=>{
 const {buildRouteNavigation}=require('../src/domain/route-navigation.js');
 const r=ROUTES.find(r=>r.id==='puyang-greenway');
 const n=buildRouteNavigation({...r,shape:'原路往返'},MAP_DATA.paths[r.id]);
 assert.equal(n.path.length,385);
 assert.ok(n.plans.full.at(-1).km<16.8);
});
