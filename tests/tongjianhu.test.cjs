const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const zlib=require('node:zlib');
const data=require('../src/data/index.js');
const source=JSON.parse(fs.readFileSync('research/tongjianhu-cycling-amap-20261021.json'));
const snapshot=JSON.parse(zlib.gunzipSync(fs.readFileSync('research/tongjianhu-osm.json.gz')));
function metresToSegment(p,a,b){
 const xy=q=>[(q[0]-p[0])*96300,(q[1]-p[1])*111200];
 a=xy(a);b=xy(b);const v=b.map((x,i)=>x-a[i]);
 const t=Math.max(0,Math.min(1,-a.reduce((s,x,i)=>s+x*v[i],0)/(v.reduce((s,x)=>s+x*x,0)||1)));
 return Math.hypot(...a.map((x,i)=>x+t*v[i]));
}
test('Tongjianhu southern footway is supported by both directional cycling plans, without rewriting OSM access tags',()=>{
 const plan=data.REGIONAL_PLANS['tongjianhu-south'];
 assert.deepEqual([...plan.wayIds].sort((a,b)=>a-b),[1049568289,1049568290,1049568302,1180699649]);
 const way=snapshot.elements.find(e=>e.type==='way'&&e.id===1180699649);
 assert.equal(way.tags.highway,'footway');assert.equal(way.tags.bicycle,undefined);
 const evidence=JSON.parse(fs.readFileSync('research/tongjianhu-access.json'));
 assert.deepEqual(Object.keys(evidence.ways),['1180699649']);
 assert.match(evidence.ways['1180699649'].source,/hangzhou.com.cn/);
 assert.equal(source.queries[0].origin,source.queries[1].destination);
 assert.equal(source.queries[0].destination,source.queries[1].origin);
 for(const query of source.queries.slice(0,2)){
  const line=query.response.data.route.paths[0].rides.flatMap(ride=>ride.polyline.split(';').map(p=>p.split(',').map(Number)));
  const distances=way.geometry.map(p=>data.RIDE_COORDS.wgs84ToGcj02([p.lon,p.lat])).map(p=>Math.min(...line.slice(1).map((b,i)=>metresToSegment(p,line[i],b))));
  assert.ok(Math.max(...distances)<15,'all southern footway nodes must match each cycling plan within 15m');
 }
 assert.ok(data.MAP_DATA.maps.tongjianhu.waterAreas.some(a=>a.source===16264750));
});
test('Tongjianhu publishes a paid southern return, while the complete ring and shop approaches retain their gaps',()=>{
 const r=data.ROUTES.find(r=>r.id==='tongjianhu-south');
 assert.equal(r.distance,3.8);assert.equal(r.parking.feeType,'paid');assert.notEqual(r.parking.price,'¥0');
 assert.equal(r.parking.published,'2025-03-28');assert.match(r.parking.condition,/旧资料不证明当前费率/);
 assert.equal(r.dedicated,false);assert.equal(r.mapCyclewayKm,0);
 assert.match(r.description,/非|区别于/);assert.match(r.description,/未计.*探店绕行/);
 const p=data.MAP_DATA.paths[r.id];assert.deepEqual(p[0],p.at(-1));
 assert.deepEqual(p.slice(0,76),p.slice(75).reverse(),'outward and return are both stored and counted');
 assert.equal(r.researchExtensions.length,2);assert.match(r.researchExtensions[0].missing,/连接缺少连续OSM几何/);
 assert.ok(r.food.every(p=>p.placement==='nearby'));assert.equal(r.photoMissing,3);
});
