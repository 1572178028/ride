const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),zlib=require('node:zlib');
const {ROUTES,MAP_DATA,REGIONAL_PLANS}=require('../src/data/index.js');
const id='qiandao-lake-loop';
test('Qiandao century ride closes a real lake circuit and keeps bridge push and mixed access explicit',()=>{
 const r=ROUTES.find(r=>r.id===id);assert.ok(r);
 const g=REGIONAL_PLANS[id],p=MAP_DATA.paths[id];
 assert.equal(r.familyId,id);assert.equal(r.browseGroup.id,'qiandao-cafe');
 assert.equal(r.shape,'环线');assert.ok(r.distance>140&&r.distance<175);
 assert.deepEqual(p[0],p.at(-1));assert.equal(g.segments.length,p.length-1);
 assert.ok(Math.abs(g.segments.reduce((n,s)=>n+s.km,0)-r.distance)<0.051);
 assert.ok(Math.min(...p.map(p=>p[0]))<118.57&&Math.min(...p.map(p=>p[1]))<29.4);
 assert.ok(g.pushKm>1.2&&g.pushKm<1.6);assert.ok(g.mixedConnectorKm>1.4&&g.mixedConnectorKm<1.8);
 assert.match(r.laneDetail,/推行/);assert.match(r.laneDetail,/集贤路/);
 assert.match(r.parking.rule,/实际收费及禁停/);assert.equal(r.parking.feeBasis,'user-default-roadside');
 assert.equal(r.dedicated,false);assert.match(r.notes.join(' '),/非.*轨迹|不是.*轨迹/);
});
test('century circuit never rides a motorway, bridge motor carriageway, unapproved tunnel or restricted node',()=>{
 const g=REGIONAL_PLANS[id];assert.ok(g);
 const d=JSON.parse(zlib.gunzipSync(fs.readFileSync('research/'+g.snapshot+'-osm.json.gz')));
 const ways=new Map(d.elements.filter(e=>e.type==='way').map(e=>[e.id,e]));
 const nodes=new Map(d.elements.filter(e=>e.type==='node').map(e=>[e.id,e]));
 const path=MAP_DATA.paths[id],banned=['no','private','customers','residents','delivery','destination','permit'];
 g.segments.forEach((s,i)=>{
  const w=ways.get(s.way),t=w.tags,points=w.geometry.map(p=>[p.lon,p.lat]);
  const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const forward=points.some((p,j)=>eq(p,path[i])&&eq(points[j+1],path[i+1]));
  const reverse=points.some((p,j)=>eq(p,path[i+1])&&eq(points[j+1],path[i]));
  assert.ok(forward||reverse,'real adjacent edge '+s.way);
  const dir=t['oneway:bicycle']||t.oneway;
  if(['yes','1','true'].includes(dir))assert.ok(forward);if(dir==='-1')assert.ok(reverse);
  assert.ok(!['motorway','motorway_link','trunk_link','steps','construction'].includes(t.highway));
  assert.notEqual(s.way,528567578,'never route onto bridge motor carriageway');
  if(t.highway==='trunk'){assert.equal(s.way,528567576);assert.ok(g.reviewedConnectors.includes(s.way));assert.notEqual(t.motorroad,'yes');}
  if(s.mode==='push'){assert.ok(g.pushWays.includes(s.way));assert.equal(t.footway,'sidewalk');}
  else if(t.tunnel==='yes')assert.ok(t.highway==='cycleway'||t.cycleway==='lane'||(t.bicycle==='yes'&&t.motor_vehicle==='no'));
  for(const nid of w.nodes){const n=nodes.get(nid)?.tags||{};assert.ok(!banned.includes(n.access)&&!banned.includes(n.vehicle)&&!banned.includes(n.bicycle));assert.ok(!n.ford);}
 });
});
test('century circuit has only full-loop navigation with a smaller ordered fallback',()=>{
 const r=ROUTES.find(r=>r.id===id);assert.ok(r);
 const {buildRouteNavigation}=require('../src/domain/route-navigation.js');
 const n=buildRouteNavigation(r,MAP_DATA.paths[id]);
 assert.deepEqual(Object.keys(n.plans),['full']);assert.ok(n.plans.full.length<=17);
 assert.ok(n.fallback.length>=5&&n.fallback.length<n.plans.full.length);
 assert.ok(n.plans.full.every(p=>MAP_DATA.paths[id][p.index]===p.point));
 const html=require('../src/features/routes/detail.js').routeDetailHTML(r,{supplyKind:'all'});
 assert.match(html,/full-route-open/);assert.doesNotMatch(html,/class="full-route-outbound"/);
});
