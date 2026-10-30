const {test}=require('node:test'), assert=require('node:assert/strict');
const fs=require('node:fs'), zlib=require('node:zlib');
const {ROUTES,MAP_DATA,REGIONAL_PLANS}=require('../src/data/index.js');
const ids=['qiandao-center-short','qiandao-center-shangjiang'];
test('center short and Xiushui–Shangjiang are distinct complete variants with honest parking',()=>{
  for(const id of ids){
    const r=ROUTES.find(r=>r.id===id); assert.ok(r,id);
    assert.equal(r.familyId,'qiandao-shangjiang');
    assert.equal(r.browseGroup.id,'qiandao-cafe');
    assert.equal(r.parking.feeBasis,'user-default-roadside');
    assert.match(r.parking.rule,/实际收费及禁停以现场标志为准/);
    assert.equal(r.shape,'完整往返');
    const p=MAP_DATA.paths[id],g=REGIONAL_PLANS[id];
    assert.deepEqual(p[0],p.at(-1));assert.equal(g.segments.length,p.length-1);
    assert.ok(Math.abs(g.segments.reduce((n,s)=>n+s.km,0)-r.distance)<0.051);
    assert.ok(r.stops.some(s=>/折返/.test(s.name)));
    assert.match(r.description,/非原轨迹|不是.*轨迹/);
  }
  const short=ROUTES.find(r=>r.id===ids[0]),long=ROUTES.find(r=>r.id===ids[1]);
  assert.ok(short.distance>6&&short.distance<10);
  assert.ok(long.distance>28&&long.distance<38);
  assert.ok(short.stops.some(s=>/植物园/.test(s.name)));
  assert.ok(long.sources.some(s=>s[1].includes('6854bd10000000002203ccfb')));
  assert.notEqual(short.parking.id,long.parking.id);
});
test('new geometry uses real directed edges, excludes motor tunnels and restricted nodes',()=>{
 const d=JSON.parse(zlib.gunzipSync(fs.readFileSync('research/qiandao-center-20261030-osm.json.gz')));
 const ways=new Map(d.elements.filter(e=>e.type==='way').map(e=>[e.id,e]));
 const nodes=new Map(d.elements.filter(e=>e.type==='node').map(e=>[e.id,e]));
 for(const id of ids){
  const g=REGIONAL_PLANS[id];assert.ok(g,id);const p=MAP_DATA.paths[id];
  g.segments.forEach((s,i)=>{
   const w=ways.get(s.way),t=w.tags;
   const coords=w.geometry.map(p=>[p.lon,p.lat]);
   const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
   const forward=coords.some((v,j)=>same(v,p[i])&&same(coords[j+1],p[i+1]));
   const reverse=coords.some((v,j)=>same(v,p[i+1])&&same(coords[j+1],p[i]));
   assert.ok(forward||reverse,'real edge '+s.way);
   const dir=t['oneway:bicycle']||t.oneway;
   if(['yes','1','true'].includes(dir))assert.ok(forward);
   if(dir==='-1')assert.ok(reverse);
   assert.ok(!['trunk','motorway','steps','construction'].includes(t.highway));
   if(t.tunnel==='yes')assert.ok(t.highway==='cycleway'||(t.bicycle==='yes'&&t.motor_vehicle==='no'));
   for(const n of w.nodes){const tag=nodes.get(n)?.tags||{};assert.ok(!['no','private','customers','residents','destination','permit'].includes(tag.access));assert.notEqual(tag.bicycle,'no');}
  });
 }
});
