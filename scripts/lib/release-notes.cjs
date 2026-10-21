const fs = require('node:fs');
const begin = '<!-- ride-atlas:code-update:start -->';
const end = '<!-- ride-atlas:code-update:end -->';

function composeReleaseNotes(existing, maintained, repo, sha) {
  const start = maintained.indexOf(begin);
  const finish = maintained.indexOf(end, start);
  if (start < 0 || finish < 0) throw new Error('Missing managed code-update section');
  const section = maintained.slice(start + begin.length, finish).trim();
  const block = `${begin}\n${section}\n\n维护说明对应提交：[${sha}](https://github.com/${repo}/commit/${sha})。原版本标签保持不变。\n${end}`;
  if (!existing.trim()) return maintained.slice(0, start).trimEnd() + '\n\n' + block + '\n';
  const previous = existing.indexOf(begin);
  if (previous >= 0) {
    const last = existing.indexOf(end, previous);
    if (last < 0) throw new Error('Existing managed release section is incomplete');
    return existing.slice(0, previous) + block + existing.slice(last + end.length);
  }
  return existing.trimEnd() + '\n\n' + block + '\n';
}

module.exports = { composeReleaseNotes };
if (require.main === module) {
  const [existing, maintained, repo, sha, output] = process.argv.slice(2);
  fs.writeFileSync(output, composeReleaseNotes(fs.readFileSync(existing, 'utf8'), fs.readFileSync(maintained, 'utf8'), repo, sha));
}
