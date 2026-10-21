// Rebuild SVG assets with the website's data and renderer.
const fs = require("node:fs");
const path = require("node:path");
const { ROUTES, RESEARCH_MAPS } = require("../src/data/index.js");
const { makeMapSVG } = require("../src/features/map/renderer.js");
const output = path.resolve(__dirname, "../assets/maps");
fs.mkdirSync(output, { recursive: true });
for (const route of [...ROUTES, ...RESEARCH_MAPS]) {
  fs.writeFileSync(
    path.join(output, route.id + ".svg"),
    makeMapSVG(route, { export: true }),
  );
  console.log(route.id + ": " + route.distance + " km");
}
