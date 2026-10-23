const {test}=require('node:test');
const assert=require('node:assert/strict');
const {ROUTES}=require('../src/data/index.js');
const {baidu,baiduNamed,baiduSearch,placeLinks,navCity}=require('../src/shared/navigation.js');
test('Baidu coordinate links show a target marker without unsupported web cycling or a fake current-location place search',()=>{
 for(const r of ROUTES){
  for(const [gcj,name]of [[r.parking.gcj,r.parking.name],[r.start.gcj,r.start.name]]){
   const u=new URL(baidu(gcj,name));assert.equal(u.pathname,'/marker');
   assert.equal(u.searchParams.get('location'),gcj[1]+','+gcj[0]);assert.equal(u.searchParams.get('title'),name);
   assert.equal(u.searchParams.get('coord_type'),'gcj02');assert.equal(u.searchParams.get('output'),'html');
   assert.ok(!u.searchParams.has('origin'));assert.ok(!u.searchParams.has('mode'));
  }
 }
});
test('approximate Baidu parking retains named city search and encodes spaces for the legacy URI parser',()=>{
 const r=ROUTES.find(r=>r.id==='lijiaxiang-guangfu');
 const link=baiduNamed(r.parking.query,r),u=new URL(link);
 assert.equal(u.pathname,'/place/search');assert.equal(u.searchParams.get('region'),navCity(r));
 assert.equal(u.searchParams.get('query'),r.parking.query);assert.ok(!link.includes('+'));
 const literal=baiduSearch('A+B 路侧泊位','湖州市');assert.equal(new URL(literal).searchParams.get('query'),'A+B 路侧泊位');assert.match(literal,/%2BB%20/);
 const f={name:'道路片区',gcj:r.start.gcj};assert.equal(new URL(placeLinks(f,r).baidu).pathname,'/marker');
});
