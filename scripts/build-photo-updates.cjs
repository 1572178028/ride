// Rebuild attributed photo assignments from the reviewed license registry.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const photos=JSON.parse(fs.readFileSync(path.join(root,'research/photo-licenses.json'),'utf8')).filter(p=>Array.isArray(p.routeIds)&&p.kind==='road'&&p.publicationStatus!=='excluded-landscape');
const tail="  for(const r of ROUTES){\n    r.photos=additions.filter(p=>p.kind==='road'&&p.publicationStatus!=='excluded-landscape'&&p.routeIds.includes(r.id));\n    if(!r.photos.length)r.photoGap='道路实拍待补：仅收录展示骑行路面且能核对路段的图片。';\n  }\n})();\n";
fs.writeFileSync(path.join(root,'photo-updates.js'),'/* Reviewed real photographs. No AI-generated substitutes or unrelated place images. */\n(() => {\n  const additions = '+JSON.stringify(photos,null,2)+';\n'+tail);
