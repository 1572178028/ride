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
  assert.equal(r.photos.length,s.id==='lijiaxiang-guangfu'?3:1);assert.equal(r.photoMissing,Math.max(0,3-r.photos.length));
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


test('Huzhou road photos retain four-part evidence scores, licenses, capture scope and actual dimensions',()=>{
 const registry=JSON.parse(fs.readFileSync('research/photo-licenses.json'));
 const selected=registry.filter(p=>p.routeIds?.some(id=>['lijiaxiang-guangfu','hefu-digang-road'].includes(id)));
 assert.equal(selected.length,4);
 assert.deepEqual(selected.map(p=>Object.values(p.matchAssessment).filter(v=>typeof v==='number').reduce((a,b)=>a+b,0)),[60,60,80,70]);
 for(const p of selected){
  assert.equal(p.checked,'2026-10-23');assert.ok(p.referenceOnly);assert.ok(p.matchAssessment.reason);
  assert.ok(fs.existsSync(p.src));assert.ok(p.author&&p.source&&p.originalUrl&&p.date&&p.modification);
  assert.ok(p.pixelWidth>=1512&&p.pixelHeight>=790);assert.equal(p.matchAssessment.track,0);
 }
 const commons=selected.filter(p=>p.sourceType==='commons-original-image');
 assert.equal(commons.length,3);assert.ok(commons.every(p=>p.license.includes('CC BY-SA 4.0')&&p.originalPixelWidth===4032&&p.pixelWidth===1600));
 const frame=selected.find(p=>p.sourceType==='social-video-frame');assert.equal(frame.frameTime,'00:29');
 assert.doesNotMatch(frame.license,/CC BY/);assert.match(frame.verification,/1080P/);assert.match(frame.modification,/裁去黑边/);
});
