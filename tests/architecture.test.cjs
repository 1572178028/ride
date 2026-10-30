const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");

test("catalogue has one importable entry without browser globals", () => {
  const data = require("../src/data/index.js");
  assert.equal(data.ROUTES.length, 68);
  assert.equal(data.ROUTE_METADATA.familyCount, 48);
  assert.equal(globalThis.ROUTES, undefined);
  assert.equal(new Set(data.ROUTES.map((r) => r.id)).size, data.ROUTES.length);
});

test("page and map generator consume modules instead of ordered global scripts", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(html, /<script type="module" src="src\/main.js"><\/script>/);
  assert.equal([...html.matchAll(/<script\b/g)].length, 1);
  const generator = fs.readFileSync(
    path.join(root, "scripts/generate-maps.cjs"),
    "utf8",
  );
  assert.match(generator, /src\/data\/index.js/);
  assert.doesNotMatch(generator, /node:vm|runInContext/);
});

test("migration retains catalogue order, geometry, sources and evidence", () => {
  const crypto = require("node:crypto");
  const data = require("../src/data/index.js");
  const expected = require("./fixtures/catalog-migration-sha256.json");
  const canonical = (value) => {
    if (typeof value === "string")
      return value.replace(/^assets\/(maps|photos)\//, "$1/");
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.keys(value)
          .sort()
          .map((key) => [key, canonical(value[key])]),
      );
    return value;
  };
  for (const [key, digest] of Object.entries(expected)) {
    const actual = crypto
      .createHash("sha256")
      .update(JSON.stringify(canonical(data[key])))
      .digest("hex");
    assert.equal(
      actual,
      digest,
      key +
        ": update this migration baseline only after reviewing intentional data changes",
    );
  }
});

test("favorites preserve old route aliases and recover from unavailable storage", () => {
  const {
    loadFavorites,
    saveFavorites,
  } = require("../src/features/favorites/storage.js");
  const { ROUTES, ROUTE_ALIASES } = require("../src/data/index.js");
  const aliases = (id) => ROUTE_ALIASES[id] || id;
  let stored = JSON.stringify([
    "westlake-20261018",
    "removed-route",
    "puyang-greenway",
  ]);
  const storage = () => ({
    getItem: () => stored,
    setItem: (key, value) => {
      assert.equal(key, "ride-atlas-favorites");
      stored = value;
    },
  });
  const saved = loadFavorites(ROUTES, aliases, storage);
  assert.deepEqual(
    [...saved],
    [aliases("westlake-20261018"), "puyang-greenway"],
  );
  saveFavorites(saved, storage);
  assert.deepEqual(JSON.parse(stored), [...saved]);
  assert.equal(
    loadFavorites(ROUTES, aliases, () => {
      throw new Error("blocked");
    }).size,
    0,
  );
  stored = "{invalid";
  assert.equal(loadFavorites(ROUTES, aliases, storage).size, 0);
});

test("filters keep fee categories, search and favorites independent", () => {
  const { matchesRoute } = require("../src/domain/route-filters.js");
  const { ROUTES } = require("../src/data/index.js");
  const filters = {
    search: "",
    city: "all",
    region: "all",
    lane: "all",
    distance: "all",
    parking: "all",
    favoritesOnly: false,
  };
  const route = ROUTES.find((r) => r.id === "puyang-greenway");
  assert.equal(
    matchesRoute(route, { ...filters, parking: "free" }, new Set()),
    false,
  );
  assert.equal(
    matchesRoute(route, { ...filters, parking: "unknown" }, new Set()),
    true,
  );
  assert.equal(
    matchesRoute(route, { ...filters, search: "浦阳江" }, new Set()),
    true,
  );
  assert.equal(
    matchesRoute(route, { ...filters, search: "不存在的路线" }, new Set()),
    false,
  );
  assert.equal(
    matchesRoute(route, { ...filters, favoritesOnly: true }, new Set()),
    false,
  );
  assert.equal(
    matchesRoute(
      route,
      { ...filters, favoritesOnly: true },
      new Set([route.id]),
    ),
    true,
  );
});
