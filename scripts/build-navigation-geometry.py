"""Build only the direction-aware navigation reference for legacy Hegong.

The published SVG path and historical distance are deliberately not rewritten.
Existing route footways keep their inherited scope; raw OSM tags stay intact.
"""
import gzip
import importlib.util
import json
import subprocess
from pathlib import Path
from lib.geometry import update_geometry

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('verified', ROOT / 'scripts/build-verified-maps.py')
verified = importlib.util.module_from_spec(spec)
spec.loader.exec_module(verified)
records = json.loads(subprocess.check_output(['node', '--input-type=module', '-e',
    'import {ROUTES,MAP_DATA} from "./src/data/index.js"; console.log(JSON.stringify(ROUTES.filter(r=>["xianghu-shanshan","xianghu-hegong"].includes(r.id)).map(r=>({...r,path:MAP_DATA.paths[r.id]}))));'], cwd=ROOT))
snapshot = 'navigation-xianghu-20261026'
data = json.load(gzip.open(ROOT / 'research' / (snapshot + '-osm.json.gz'), 'rt'))
keys = {tuple(p) for r in records for p in r['path']}
inherited_ids = {e['id'] for e in data['elements'] if e['type'] == 'way'
                 and e.get('tags', {}).get('highway') == 'footway'
                 and sum((p['lon'], p['lat']) in keys for p in e.get('geometry', [])) >= 2}
inherited_tags = {id(e['tags']) for e in data['elements'] if e['type'] == 'way' and e['id'] in inherited_ids}
normal = verified.permitted
verified.permitted = lambda t: normal(t) or (id(t) in inherited_tags
    and t.get('bicycle') not in ('no', 'private') and t.get('access') not in ('no', 'private'))
coords, graph, turns, *_ = verified.network(data)
route = next(r for r in records if r['id'] == 'xianghu-hegong')
preferred = {frozenset((tuple(a), tuple(b))) for a, b in zip(route['path'], route['path'][1:])}
# Prefer the established corridor, but never add a prohibited reverse edge.
weighted = {n: [(to, {**e, 'km': e['km'] * (1 if frozenset((tuple(coords[n]), tuple(coords[to]))) in preferred else 20)})
                for to, e in edges] for n, edges in graph.items()}
anchors = [route['path'][0]] + [s['point'] for s in route['stops'][1:-1]] + [route['path'][-1]]
path, segments, snapped = verified.route_path(coords, weighted, turns, anchors + anchors[-2::-1])
turn_index = path.index(snapped[len(anchors) - 1])
for i, segment in enumerate(segments):
    segment['km'] = verified.regional.km(path[i], path[i + 1])
record = {'path': path, 'turnIndex': turn_index, 'segments': segments, 'snapshot': snapshot,
          'inheritedFootwayIds': sorted(inherited_ids), 'checked': '2026-10-26',
          'note': '单行接驳按方向调整，导航参考与本站原地图略有不同；百度仍会重新规划。'}
update_geometry(ROOT, navigation={route['id']: record})
print(route['id'], len(path), 'nodes', round(sum(s['km'] for s in segments), 3), 'km')
