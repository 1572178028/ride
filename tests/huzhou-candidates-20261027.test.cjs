const { test } = require('node:test');
const assert = require('node:assert/strict');
const { ROUTES, EXPANSION_CANDIDATES } = require('../src/data/index.js');

test('original Huzhou leads stay traceable beside independent road plans', () => {
  const ids = require('../research/huzhou-expansion-specs-20261027.json').map(s => s.id);
  const candidates = ROUTES.filter(r => ids.includes(r.id)).flatMap(r => r.researchExtensions);
  assert.equal(candidates.length, 7);
  assert.equal(EXPANSION_CANDIDATES.filter(c => c.researchCity === 'huzhou').length, 0);
  for (const candidate of candidates) {
    assert.equal(candidate.checked, '2026-10-27');
    assert.ok(candidate.sources.length && candidate.missing && candidate.roadNote && candidate.parkingNote);
    assert.ok(!candidate.parking && !candidate.preview);
    assert.ok(!ROUTES.some(route => route.id === candidate.id));
  }
  assert.match(candidates.find(c => c.id.includes('yucun')).note, /已有余村/);
  assert.match(candidates.find(c => c.id.includes('taihu')).note, /已有夹浦/);
});
