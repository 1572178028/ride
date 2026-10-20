// Generate the unpublished Puyang draft with the site's map renderer.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),c={};c.window=c;vm.createContext(c);
for(const file of ['map-data.js','catalog.js','planning-data.js','regional-map-data.js','verified-map-data.js','puyang-map-data.js','puyang-catalog.js','map-renderer.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c,{filename:file});
const svg=c.makeMapSVG(c.PUYANG_ROUTE_DRAFT,{export:true}),base=path.join(root,'maps/puyang-greenway-draft');
fs.writeFileSync(base+'.svg',svg);
require('sharp')(Buffer.from(svg)).png().toFile(base+'.png').then(()=>console.log('Puyang draft SVG/PNG generated'));
