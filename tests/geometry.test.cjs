const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

test("regional geometry merge preserves unrelated maps, paths and plans", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ride-geometry-"));
  const output = path.join(root, "src/data/generated");
  const prefix =
    "// Generated geometry; use scripts/build-*.py to update.\nexport default ";
  fs.mkdirSync(output, { recursive: true });
  try {
    for (const name of ["maps", "paths", "plans"])
      fs.writeFileSync(
        path.join(output, name + ".js"),
        prefix +
          JSON.stringify({
            existing: { source: "keep" },
            target: { source: "old" },
          }) +
          ";\n",
      );
    execFileSync(
      "python3",
      [
        "-c",
        "from lib.geometry import update_geometry; import sys; update_geometry(sys.argv[1], paths={'target': {'source': 'new'}})",
        root,
      ],
      {
        cwd: path.resolve(__dirname, "../scripts"),
        env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
      },
    );
    const read = (name) =>
      JSON.parse(
        fs
          .readFileSync(path.join(output, name + ".js"), "utf8")
          .slice(prefix.length, -2),
      );
    assert.deepEqual(read("paths"), {
      existing: { source: "keep" },
      target: { source: "new" },
    });
    assert.deepEqual(read("maps"), {
      existing: { source: "keep" },
      target: { source: "old" },
    });
    assert.deepEqual(read("plans"), {
      existing: { source: "keep" },
      target: { source: "old" },
    });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
