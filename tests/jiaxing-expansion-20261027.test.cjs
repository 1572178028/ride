const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),zlib=require('node:zlib');
const {ROUTES,MAP_DATA,REGIONAL_PLANS}=require('../src/data/index.js');
const {buildRouteNavigation}=require('../src/domain/route-navigation.js');
const ids=['xiangjiadang','xiuhu','wangjiangjing','xincheng','wuzhen','fenghuanghu','juanhu','dayun','xitang','nanbeihu','haiyan-coast','pinghu-donghu','zhapu'].map(s=>'jiaxing-'+s);

test('Jiaxing additions use connected directed snapshot roads with measured full distances',()=>{
 for(const id of ids){
  const r=ROUTES.find(r=>r.id===id);assert.ok(r,id+' missing');
  const p=MAP_DATA.paths[id],g=REGIONAL_PLANS[id];
  assert.deepEqual(p[0],p.at(-1));assert.equal(g.segments.length,p.length-1);
  assert.ok(Math.abs(g.segments.reduce((s,e)=>s+e.km,0)-r.distance)<.051,id);
  const data=JSON.parse(zlib.gunzipSync(fs.readFileSync('research/'+g.snapshot+'-osm.json.gz')));
  const ways=new Map(data.elements.filter(e=>e.type==='way').map(e=>[e.id,e]));
  const usedPoints=new Set(p.map(point=>point.join(',')));
  for(const node of data.elements.filter(e=>e.type==='node'&&usedPoints.has([e.lon,e.lat].join(',')))){
   assert.ok(!['yes','stepping_stones'].includes(node.tags.ford),id+': unverified water crossing');
   assert.ok(!['no','private'].includes(node.tags.bicycle),id+': restricted node');
  }
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  for(const [i,e] of g.segments.entries()){
   const w=ways.get(e.way),t=w.tags,geo=w.geometry.map(p=>[p.lon,p.lat]);
   const forward=geo.some((a,j)=>same(a,p[i])&&same(geo[j+1],p[i+1]));
   const reverse=geo.some((a,j)=>same(a,p[i+1])&&same(geo[j+1],p[i]));
   assert.ok(forward||reverse,id+': edge '+e.way);
   assert.ok(!['motorway','motorway_link','trunk','trunk_link','steps','construction','path','footway','pedestrian'].includes(t.highway));
   assert.ok(!['no','private','use_sidepath'].includes(t.bicycle));
   assert.ok(!['residents','destination','delivery','agricultural','forestry','permit'].includes(t.bicycle),id+': restricted bicycle access');
   if(!['yes','designated'].includes(t.bicycle))for(const key of ['access','vehicle']){
    assert.ok(!['no','private','customers','residents','destination','delivery','agricultural','forestry','permit'].includes(t[key]),id+': '+t[key]+' access');
   }
   assert.notEqual(t.tunnel,'yes');
   const direction=t['oneway:bicycle']||t.oneway||(t.junction==='roundabout'?'yes':'no');
   if(['yes','1','true'].includes(direction))assert.ok(forward,id+': wrong direction');
   if(direction==='-1')assert.ok(reverse,id+': wrong reverse direction');
  }
  assert.equal(r.cityGroup,'jiaxing');assert.ok(r.city.startsWith('嘉兴市'));
  assert.equal(r.parking.feeBasis,'user-default-roadside');
  assert.ok(r.parking.query.includes(r.parking.address),id+': disambiguate the real parking location');
  assert.ok(g.parkingSnapMetres<120);assert.equal(r.dedicated,false);
 }
 assert.ok(REGIONAL_PLANS['jiaxing-juanhu'].cyclewayKm>3);
});

test('Jiaxing return plans have named turnarounds and rings do not split at arbitrary halfway points',()=>{
 const returns=new Set(['wangjiangjing','xincheng','juanhu','haiyan-coast','zhapu'].map(s=>'jiaxing-'+s));
 for(const id of ids){
  const r=ROUTES.find(r=>r.id===id);assert.ok(r,id);
  const nav=buildRouteNavigation(r,MAP_DATA.paths[id]);
  assert.equal(!!nav.plans.outbound,returns.has(id),id);
  assert.ok(nav.fallback.length<nav.plans.full.length,id);
  assert.deepEqual(nav.plans.full[0].point,r.start.point);
  if(returns.has(id)){
   assert.match(nav.plans.outbound.at(-1).name,/折返点/);
   assert.deepEqual(nav.plans.outbound.at(-1).point,nav.plans.inbound[0].point);
  }
 }
});
