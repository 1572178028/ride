const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),zlib=require('node:zlib');
const {ROUTES,MAP_DATA,REGIONAL_PLANS}=require('../src/data/index.js');
const specs=require('../research/huzhou-expansion-specs-20261027.json');
const {buildRouteNavigation}=require('../src/domain/route-navigation.js');
const {browseGroupId,browseRegion}=require('../src/domain/route-groups.js');

test('seven Huzhou road plans preserve directed OSM edges and exclude unconfirmed footpaths',()=>{
 for(const s of specs){
  const route=ROUTES.find(r=>r.id===s.id),p=MAP_DATA.paths[s.id],g=REGIONAL_PLANS[s.id];
  assert.ok(route);assert.deepEqual(p[0],p.at(-1));assert.equal(g.segments.length,p.length-1);
  assert.ok(Math.abs(g.segments.reduce((sum,e)=>sum+e.km,0)-route.distance)<.06);
  assert.ok(g.parkingSnapMetres<100);assert.equal(route.dedicated,false);
  const data=JSON.parse(zlib.gunzipSync(fs.readFileSync('research/'+g.snapshot+'-osm.json.gz')));
  const ways=new Map(data.elements.filter(e=>e.type==='way').map(e=>[e.id,e]));
  for(const [i,e]of g.segments.entries()){
   const w=ways.get(e.way),t=w.tags,coords=w.geometry.map(p=>[p.lon,p.lat]);
   const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
   const forward=coords.some((a,j)=>eq(a,p[i])&&eq(coords[j+1],p[i+1]));
   const reverse=coords.some((a,j)=>eq(a,p[i+1])&&eq(coords[j+1],p[i]));
   assert.ok(forward||reverse,s.id+': disconnected edge '+e.way);
   assert.ok(!['motorway','motorway_link','trunk','trunk_link','footway','path','pedestrian','steps','construction'].includes(t.highway));
   assert.notEqual(t.tunnel,'yes');
   const direction=t['oneway:bicycle']||t.oneway;
   if(['yes','1','true'].includes(direction))assert.ok(forward);
   if(direction==='-1')assert.ok(reverse);
  }
 }
 assert.ok(REGIONAL_PLANS['taihu-nine-long'].cyclewayKm>23);
});

test('Huzhou returns split at named turnarounds while rings remain complete',()=>{
 for(const s of specs){
  const r=ROUTES.find(r=>r.id===s.id),n=buildRouteNavigation(r,MAP_DATA.paths[s.id]);
  assert.equal(!!n.plans.outbound,s.return,s.id);
  assert.ok(n.fallback.length<n.plans.full.length);
  if(s.return){
   assert.match(n.plans.outbound.at(-1).name,/折返点/);
   assert.deepEqual(n.plans.outbound.at(-1).point,n.plans.inbound[0].point);
  }
 }
});

test('Yucun shares its existing family and Taihu collects the three plans in one browsing area',()=>{
 const y=ROUTES.find(r=>r.id==='yucun-north-road'),base=ROUTES.find(r=>r.id==='yucun-villages');
 assert.equal(y.familyId,base.familyId);assert.equal(y.parking.id,base.parking.id);assert.equal(browseRegion(y),'yucun');
 const ids=ROUTES.filter(r=>browseGroupId(r)==='jiapu-lakeside').map(r=>r.id);
 assert.deepEqual(ids,['jiapu-lakeside','jiapu-easy','taihu-nine-long']);
 assert.equal(ROUTES.find(r=>r.id==='taihu-nine-long').parking.feeBasis,'user-default-roadside');
 assert.equal(y.parking.feeType,'paid');
});
