// Reconcile reviewed photo fields in the current regional catalogue.
// Research/source records remain authoritative; never creates a runtime patch.
const fs = require("node:fs");
const path = require("node:path");
const { ROUTES, EXPANSION_CANDIDATES } = require("../src/data/index.js");
const root = path.resolve(__dirname, "..");
const photos = JSON.parse(
  fs.readFileSync(path.join(root, "research/photo-licenses.json"), "utf8"),
).filter(
  (p) =>
    (Array.isArray(p.routeIds) || Array.isArray(p.candidateIds)) &&
    p.kind === "road" &&
    !String(p.publicationStatus || "").startsWith("excluded-"),
);
const score = (p) => {
  const m = p.matchAssessment;
  return m ? m.source + m.location + m.track + m.visual : null;
};
const eligible = (p) =>
  !p.matchAssessment || (!p.matchAssessment.conflict && score(p) >= 60);
for (const r of ROUTES) {
  r.photos = photos.filter(
    (p) => (p.routeIds || []).includes(r.id) && eligible(p),
  );
  r.photoTarget = 3;
  r.photoMissing = Math.max(
    0,
    3 - r.photos.filter((p) => p.scope !== "detour").length,
  );
  r.photoGap = r.photoMissing
    ? r.photos.length
      ? "道路图目标3张，仍待补" +
        r.photoMissing +
        "张。已展示图片含关联参考，详见评分依据。"
      : "暂无达到60%关联评分的道路实拍；保留缺口，不用同片区景点替代。"
    : "";
  r.notes = r.notes.filter(
    (n) =>
      !n.startsWith("对应本方案的道路实拍") &&
      !n.startsWith("已补两张2026年报道"),
  );
}
for (const r of [
  ...EXPANSION_CANDIDATES,
  ...ROUTES.flatMap((r) => r.researchExtensions || []),
]) {
  const assigned = photos.filter(
    (p) => (p.candidateIds || []).includes(r.id) && eligible(p),
  );
  // Records without explicit assignments retain the pre-existing landscape reference.
  if (
    assigned.length ||
    (r.photos || []).some((p) => Array.isArray(p.candidateIds))
  )
    r.photos = assigned;
}
const writeData = (file, value) =>
  fs.writeFileSync(
    path.join(root, file),
    "export default " + JSON.stringify(value, null, 2) + ";\n",
  );
for (const region of new Set(ROUTES.map((r) => r.region)))
  writeData(
    "src/data/routes/" + region + ".js",
    ROUTES.filter((r) => r.region === region),
  );
writeData("src/data/candidates/index.js", EXPANSION_CANDIDATES);
console.log("Updated photo assignments for " + ROUTES.length + " plans.");
