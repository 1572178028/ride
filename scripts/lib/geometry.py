"""Merge a generator's owned geometry into the shared ESM data modules.

Payloads are JSON literals. This helper never executes JavaScript and preserves
unrelated keys, so a regional rebuild cannot erase another region's plans.
"""
import json
from pathlib import Path

PREFIX = '// Generated geometry; use scripts/build-*.py to update.\nexport default '


def update_geometry(root, *, maps=None, paths=None, plans=None, navigation=None):
    for name, additions in (('maps', maps), ('paths', paths), ('plans', plans), ('navigation', navigation)):
        if additions is None:
            continue
        target = Path(root) / 'src/data/generated' / (name + '.js')
        if target.exists():
            text = target.read_text(encoding='utf-8')
        elif name == 'navigation':
            text = PREFIX + '{};\n'
        else:
            raise FileNotFoundError(target)
        if not text.startswith(PREFIX) or not text.endswith(';\n'):
            raise ValueError(f'Unexpected generated module format: {target}')
        data = json.loads(text[len(PREFIX):-2])
        data.update(additions)
        temporary = target.with_suffix('.js.tmp')
        temporary.write_text(PREFIX + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
        temporary.replace(target)
