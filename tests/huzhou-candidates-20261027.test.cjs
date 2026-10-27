const { test } = require('node:test');
const assert = require('node:assert/strict');
const { ROUTES, EXPANSION_CANDIDATES } = require('../src/data/index.js');

test('new Huzhou leads preserve evidence gaps and stay out of the formal catalogue', () => {
  const candidates = EXPANSION_CANDIDATES.filter(c => c.researchCity === 'huzhou');
  assert.equal(candidates.length, 7);
  for (const candidate of candidates) {
    assert.equal(candidate.checked, '2026-10-27');
    assert.ok(candidate.sources.length && candidate.missing && candidate.roadNote && candidate.parkingNote);
    assert.ok(!candidate.parking && !candidate.preview);
    assert.ok(!ROUTES.some(route => route.id === candidate.id));
  }
  assert.match(candidates.find(c => c.id.includes('yucun')).note, /已有余村/);
  assert.match(candidates.find(c => c.id.includes('taihu')).note, /已有夹浦/);
});
