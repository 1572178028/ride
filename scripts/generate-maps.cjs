// Rebuild portable SVG assets using the same renderer as the website.
// Run: node scripts/generate-maps.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = {};
context.window = context;
vm.createContext(context);
for (const file of ['map-data.js', 'catalog.js', 'planning-data.js', 'regional-map-data.js', 'regional-catalog.js', 'huzhou-research.js', 'verified-map-data.js', 'verified-catalog.js', 'map-renderer.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
for (const route of context.ROUTES) {
  const svg = context.makeMapSVG(route, { export: true });
  fs.writeFileSync(path.join(root, 'maps', `${route.id}.svg`), svg);
  console.log(`${route.id}: ${route.distance} km, ${route.supply.length} supply markers`);
}

for (const route of context.RESEARCH_MAPS) fs.writeFileSync(path.join(root, 'maps', `${route.id}.svg`), context.makeMapSVG(route, { export: true }));
