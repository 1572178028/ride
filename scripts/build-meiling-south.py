"""Rebuild Meiling South from the dated OSM API snapshot (WGS84, ODbL)."""
import gzip
import json
import runpy
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
helpers = runpy.run_path(str(ROOT / 'scripts/build-verified-maps.py'))
data = json.load(gzip.open(ROOT / 'research/meiling-south-osm.json.gz', 'rt'))
coords, graph, turns, roads, water = helpers['network'](data)
tags = {e['id']: e.get('tags', {}) for e in data['elements'] if e['type'] == 'way'}
# Stay entirely on the two-way surface road; never route through the tunnel,
# parking aisles or the tea village's stairs and walking paths.
graph = {n: [(to, edge) for to, edge in edges if tags[edge['way']].get('name') == '梅灵南路' and tags[edge['way']].get('tunnel') != 'yes'] for n, edges in graph.items()}
graph = {n: edges for n, edges in graph.items() if edges}
anchors = [[120.0835362, 30.2072162], [120.0824675, 30.1912208], [120.0938297, 30.1761651], [120.0835362, 30.2072162], [120.0811866, 30.2207], [120.0835362, 30.2072162]]
points, segments, anchors = helpers['route_path'](coords, graph, turns, anchors)
plan = {'distance': round(sum(s['km'] for s in segments), 1), 'cyclewayKm': 0, 'anchors': anchors, 'segments': segments, 'wayIds': list(dict.fromkeys(s['way'] for s in segments)), 'checked': '2026-10-19', 'coordinateSystem': 'WGS84', 'snapshot': 'meiling-south', 'geometrySource': data['source']['url']}
mapdata = {'roads': roads, 'water': water, 'waterAreas': []}
out = 'Object.assign(MAP_DATA.maps,' + json.dumps({'meiling-south': mapdata},ensure_ascii=False,separators=(',',':')) + ');\n'
out += 'Object.assign(MAP_DATA.paths,' + json.dumps({'meiling-south-road': points},separators=(',',':')) + ');\n'
out += 'Object.assign(REGIONAL_PLANS,' + json.dumps({'meiling-south-road': plan},ensure_ascii=False,separators=(',',':')) + ');\n'
(ROOT / 'meiling-map-data.js').write_text(out)
print(plan['distance'], 'km;', len(points), 'road nodes;', plan['wayIds'])
