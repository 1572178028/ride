const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),zlib=require('node:zlib');
const data=require('../src/data/index.js');
const specs=JSON.parse(fs.readFileSync('research/huzhou-completion-specs-20261023.json'));
test('Huzhou short return plans use permitted connected road geometry and preserve historical alternatives',()=>{
 for(const s of specs){
  const r=data.ROUTES.find(r=>r.id===s.id),p=data.REGIONAL_PLANS[s.id];
  const snapshot=JSON.parse(zlib.gunzipSync(fs.readFileSync('research/'+s.snapshot+'-osm.json.gz')));
  const ways=new Map(snapshot.elements.filter(e=>e.type==='way').map(e=>[e.id,e]));
  assert.deepEqual(data.MAP_DATA.paths[s.id][0],data.MAP_DATA.paths[s.id].at(-1));
  assert.ok(p.parkingSnapMetres<50);assert.match(r.parking.precision,/不是实测/);
  assert.equal(r.parking.poiid,s.parking.id);assert.equal(r.parking.feeBasis,'user-default-roadside');
  assert.match(r.parking.condition,/不是.*免费公告/);assert.equal(r.isolated,false);
  assert.equal(r.photos.length,0);assert.equal(r.photoMissing,3);
  for(const edge of p.segments){
   assert.ok(s.allowedWays.includes(edge.way));assert.ok(!s.excludeWays.includes(edge.way));
   const w=ways.get(edge.way);assert.ok(w);assert.ok(!['motorway','trunk','footway','path','track'].includes(w.tags.highway));
   assert.ok(!['no','private'].includes(w.tags.bicycle));assert.ok(!['no','private'].includes(w.tags.access));
  }
  const clue=r.researchExtensions.find(c=>c.id==='xingzhe-'+s.originalId+'-research');
  assert.ok(clue.sources.some(([label,url])=>url.endsWith('/routes/'+s.originalId)));
  assert.ok(!data.EXPANSION_CANDIDATES.some(c=>r.researchExtensions.some(e=>e.id===c.id)));
 }
 assert.match(data.ROUTES.find(r=>r.id==='lijiaxiang-guangfu').notes.join(''),/104|G104/);
 assert.match(data.ROUTES.find(r=>r.id==='hefu-digang-road').laneDetail,/252.*504/);
});
