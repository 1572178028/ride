// Rebuild attributed photo assignments from the reviewed license registry.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const photos=JSON.parse(fs.readFileSync(path.join(root,'research/photo-licenses.json'),'utf8')).filter(p=>Array.isArray(p.routeIds));
const tail="  for(const r of ROUTES){\n    const existing=r.photos||[];\n    r.photos=[...existing,...additions.filter(p=>p.routeIds.includes(r.id))];\n    if(r.region==='xianghu'&&!r.photos.length)r.photos=PHOTO_CATALOG.filter(p=>p.group==='xianghu');\n    if(['westlake-nanshan-night','westlake-hills-loop'].includes(r.id))r.photos=[...r.photos,...PHOTO_CATALOG.filter(p=>p.group==='beishan-road')];\n    r.photos=[...new Map(r.photos.map(p=>[p.id,p])).values()];\n    if(!r.photos.length)r.photoGap='暂无已核对的本线路段实拍；已查照片的拍摄位置、画面质量或使用许可仍不符合收录条件。';\n  }\n})();\n";
fs.writeFileSync(path.join(root,'photo-updates.js'),'/* Reviewed real photographs. No AI-generated substitutes or unrelated place images. */\n(() => {\n  const additions = '+JSON.stringify(photos,null,2)+';\n'+tail);
