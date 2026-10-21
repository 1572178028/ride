const {test}=require('node:test');
const assert=require('node:assert/strict');
const {composeReleaseNotes}=require('../scripts/lib/release-notes.cjs');
const begin='<!-- ride-atlas:code-update:start -->',end='<!-- ride-atlas:code-update:end -->';
const maintained=`Original release\n\n${begin}\n## Code update\nDetails\n${end}`;
test('code update preserves existing remote release content',()=>{
 const result=composeReleaseNotes('Remote notes with additional context',maintained,'1572178028/ride','abc123');
 assert.ok(result.startsWith('Remote notes with additional context'));
 assert.ok(result.includes('## Code update'));
 assert.ok(result.includes('/commit/abc123'));
});
test('repeated release reconciliation replaces only the managed code update',()=>{
 const first=composeReleaseNotes('Original remote notes',maintained,'1572178028/ride','old');
 const second=composeReleaseNotes(first,maintained,'1572178028/ride','new');
 assert.equal(second.split(begin).length,2);
 assert.ok(second.startsWith('Original remote notes'));
 assert.ok(second.includes('/commit/new'));
 assert.ok(!second.includes('/commit/old'));
});
