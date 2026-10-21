const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),zlib=require('node:zlib');
const root=path.resolve(__dirname,'..');
const ctx={...require('../src/data/index.js'),...require('../src/features/map/renderer.js')};
const r=ctx.ROUTES.find(r=>r.id==='puyang-greenway'),p=ctx.REGIONAL_PLANS[r.id],points=ctx.MAP_DATA.paths[r.id];
const snapshot=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'research/puyangjiang-osm.json.gz'))));
const ways=new Map(snapshot.elements.filter(e=>e.type==='way').map(e=>[e.id,e]));
const key=p=>p.join(',');
test('Puyang draft uses actual directed OSM edges for both outbound and return',()=>{
 assert.equal(points.length-1,p.segments.length);
 assert.deepEqual(points[0],points.at(-1));
 for(let i=0;i<p.segments.length;i++){
  const edge=p.segments[i],w=ways.get(edge.way);assert.ok(w,'missing source way');
  const dir=w.tags['oneway:bicycle']||w.tags.oneway||'no';
  const geo=w.geometry.map(v=>[v.lon,v.lat]);let found=false;
  for(let j=1;j<geo.length;j++){
   const forward=key(points[i])===key(geo[j-1])&&key(points[i+1])===key(geo[j]);
   const reverse=key(points[i])===key(geo[j])&&key(points[i+1])===key(geo[j-1]);
   if(forward&&dir!=='-1'||reverse&&!['yes','1','true'].includes(dir)){found=true;break;}
  }
  assert.ok(found,'illegal direction or invented edge '+edge.way);
  assert.ok(!['motorway','trunk','steps','construction'].includes(w.tags.highway));
  assert.notEqual(w.tags.bicycle,'no');
 }
 assert.ok(Math.abs(p.segments.reduce((n,s)=>n+s.km,0)-r.distance)<0.06);
 assert.ok(Math.abs(p.connectorKm-0.762)<0.02,'connector should agree with independently read Amap route');
});
test('conditional route does not promise free all-day parking',()=>{
 assert.equal(ctx.ROUTES.filter(x=>x.id===r.id).length,1);
 assert.equal(r.parking.feeType,'unknown');assert.notEqual(r.parking.price,'¥0');
 assert.equal(r.parking.poiid,'B0KKK7TLQ8');
 assert.deepEqual(Array.from(r.parking.gcj),[120.252843,30.036164]);
 const converted=ctx.RIDE_COORDS.wgs84ToGcj02(r.parking.point);
 assert.ok(Math.abs(converted[0]-r.parking.gcj[0])<1e-6);
 const svg=ctx.makeMapSVG(r,{export:true});assert.ok(svg.includes('data-poi="parking"'));assert.ok(svg.includes('data-cycleway="true"'));
 assert.equal(r.food.length,2);assert.ok(r.food.every(f=>f.source.startsWith('https://www.amap.com/')));
});
