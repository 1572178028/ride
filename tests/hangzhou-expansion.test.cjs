const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const data=require('../src/data/index.js');
const specs=JSON.parse(fs.readFileSync('research/hangzhou-expansion-specs.json'));
const clues=JSON.parse(fs.readFileSync('research/hangzhou-xingzhe-clues-20261023.json'));
test('all eight historical route clues remain traceable without claiming their complete tracks were rebuilt',()=>{
 assert.deepEqual(clues.map(c=>c.id),[3202398,3023203,509517,3735646,1414856,1011632,859931,2720833]);
 const extensions=data.ROUTES.flatMap(r=>r.researchExtensions||[]);
 for(const c of clues){
  const record=c.id===2720833?data.EXPANSION_CANDIDATES.find(r=>r.id===c.target):extensions.find(r=>r.id==='xingzhe-'+c.id+'-research');
  assert.ok(record,c.id);assert.match(record.status,/待核查/);
  assert.ok(record.sources.some(s=>s[1]==='https://www.imxingzhe.com/routes/'+c.id));
  assert.match(record.note,/不计入正式里程/);
  assert.ok(!data.ROUTES.some(r=>r.id===record.id));
 }
 assert.equal(clues.find(c=>c.id===2720833).ascentMetres,1236);
 assert.equal(clues.find(c=>c.id===1011632).ascentMetres,48);
});
test('new plans retain explicit roadside defaults and only use separately snapshotted public road edges',()=>{
 for(const s of specs){
  const r=data.ROUTES.find(r=>r.id===s.id),p=data.REGIONAL_PLANS[s.id];
  assert.equal(r.parking.poiid,s.parking.id);assert.deepEqual(r.parking.gcj,s.parking.location.split(',').map(Number));
  assert.equal(r.parking.feeBasis,'user-default-roadside');assert.match(r.parking.rule,/实际收费及禁停/);
  assert.match(r.parking.precision,/不是实测/);assert.ok(p.parkingSnapMetres<40);
  assert.ok(p.segments.every(e=>['cycleway','tertiary','secondary','residential','unclassified'].includes(e.kind)));
  assert.equal(r.dedicated,false);assert.equal(r.window,'day');assert.equal(r.photoMissing,Math.max(0,3-r.photos.length));
  assert.match(r.notes.join(''),/原行者路书里程.*不沿用/);
  const points=data.MAP_DATA.paths[s.id];assert.deepEqual(points[0],points.at(-1));
 }
 const river=data.MAP_DATA.maps['xiasha-riverside'];assert.ok(river.waterAreas.some(a=>a.source===8227206));
 const xiasha=data.MAP_DATA.paths['xiasha-greenway'],wetland=data.MAP_DATA.paths['qiantang-seawall'];
 assert.ok(Math.max(...xiasha.map(p=>p[0]))<Math.min(...wetland.map(p=>p[0]))-.2,'Xiasha and Linjiang wetland are distinct corridors');
});

test('new Hangzhou road photographs retain provenance, honest reference scope and remaining gaps',()=>{
 const counts={'jingshan-shuangxi-short':3,'liangzhu-village-streets':1,'chaoshan-roads':1,'xiasha-greenway':2};
 const registry=JSON.parse(fs.readFileSync('research/photo-licenses.json'));
 for(const [id,count] of Object.entries(counts)){
  const r=data.ROUTES.find(r=>r.id===id);assert.equal(r.photos.length,count);assert.equal(r.photoMissing,3-count);
  for(const p of r.photos){
   assert.deepEqual(p,registry.find(x=>x.id===p.id));assert.ok(fs.existsSync(p.src));
   assert.ok(p.author&&p.source&&p.originalUrl&&p.license&&p.date);assert.equal(p.checked,'2026-10-23');
   assert.equal(p.referenceOnly,true);assert.match(p.relation,/未.*定位|未确认|缺少逐图/);
   assert.ok(p.pixelWidth>=720&&p.pixelHeight>=539);assert.ok(!p.license.includes('CC BY'));
   const m=p.matchAssessment;assert.ok(m.source+m.location+m.track+m.visual>=60);assert.ok(m.location<40);
  }
 }
 assert.equal(Object.values(counts).reduce((a,n)=>a+n,0),7);
});
