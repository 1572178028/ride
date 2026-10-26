const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),zlib=require('node:zlib');
const {ROUTES,MAP_DATA,REGIONAL_PLANS,NAVIGATION_GEOMETRY}=require('../src/data/index.js');
const snapshot=name=>JSON.parse(zlib.gunzipSync(fs.readFileSync(require('node:path').join(__dirname,'../research',name+'-osm.json.gz'))));

test('legacy return expansion is restricted to checked reversible reference edges',()=>{
 for(const r of ROUTES.filter(r=>r.shape==='原路往返'&&!NAVIGATION_GEOMETRY[r.id])){
  const name=r.region==='wengjin'?'navigation-wengjin-20261026':r.region==='xianghu'?'navigation-xianghu-20261026':(REGIONAL_PLANS[r.id].snapshot||r.region);
  const data=snapshot(name),edges=new Map();
  for(const e of data.elements.filter(e=>e.type==='way'&&e.geometry)){
   for(let i=1;i<e.geometry.length;i++){
    const a=[e.geometry[i-1].lon,e.geometry[i-1].lat],b=[e.geometry[i].lon,e.geometry[i].lat];
    for(const key of [JSON.stringify([a,b]),JSON.stringify([b,a])])edges.set(key,[...(edges.get(key)||[]),e.tags]);
   }
  }
  const p=MAP_DATA.paths[r.id];
  for(let i=1;i<p.length;i++){
   const matches=edges.get(JSON.stringify([p[i-1],p[i]]))||[];
   assert.ok(matches.some(t=>!['yes','1','true','-1'].includes(t['oneway:bicycle']||t.oneway||(t.junction==='roundabout'?'yes':'no'))&&!['no','private'].includes(t.bicycle)&&!['no','private'].includes(t.access)),r.id+': reversible edge '+i);
  }
 }
});

test('Hegong navigation adjustment uses connected road edges in permitted directions without changing raw tags',()=>{
 const g=NAVIGATION_GEOMETRY['xianghu-hegong'],ways=new Map(snapshot(g.snapshot).elements.filter(e=>e.type==='way').map(e=>[e.id,e]));
 assert.equal(g.segments.length,g.path.length-1);
 assert.deepEqual(g.path[0],g.path.at(-1));assert.ok(g.turnIndex>0&&g.turnIndex<g.path.length-1);
 g.segments.forEach((seg,i)=>{
  const w=ways.get(seg.way),t=w.tags,p=w.geometry.map(p=>[p.lon,p.lat]);
  const forward=p.some((a,j)=>JSON.stringify(a)===JSON.stringify(g.path[i])&&JSON.stringify(p[j+1])===JSON.stringify(g.path[i+1]));
  const reverse=p.some((a,j)=>JSON.stringify(a)===JSON.stringify(g.path[i+1])&&JSON.stringify(p[j+1])===JSON.stringify(g.path[i]));
  assert.ok(forward||reverse);
  const direction=t['oneway:bicycle']||t.oneway||(t.junction==='roundabout'?'yes':'no');
  if(['yes','1','true'].includes(direction))assert.ok(forward,'wrong-way '+w.id);
  if(direction==='-1')assert.ok(reverse,'wrong-way '+w.id);
  assert.ok(!['no','private'].includes(t.bicycle));assert.ok(!['no','private'].includes(t.access));
  assert.ok(!['motorway','motorway_link','trunk','trunk_link','steps','construction'].includes(t.highway));
  if(t.highway==='footway'&&!['yes','designated'].includes(t.bicycle))assert.ok(g.inheritedFootwayIds.includes(w.id));
 });
});
