"""Build the unified West Lake/Meiling circuit from dated, saved road snapshots."""
import gzip
import json
import runpy
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
h = runpy.run_path(str(ROOT / 'scripts/build-verified-maps.py'))
data = json.load(gzip.open(ROOT / 'research/westlake-unified-osm.json.gz', 'rt'))
coords, graph, turns, roads, water = h['network'](data)
tags = {e['id']: e.get('tags', {}) for e in data['elements'] if e['type'] == 'way'}
# Only the Meiling tunnel has route-specific slow-lane evidence. All other
# tunnels, service aisles, forbidden paths and steps stay excluded.
graph = {n: [(to, edge) for to, edge in edges if edge['kind'] != 'service' and (tags[edge['way']].get('tunnel') != 'yes' or edge['way'] == 4352782)] for n, edges in graph.items()}
graph = {n: edges for n, edges in graph.items() if edges}
anchors = [[120.1302,30.2545],[120.1192911,30.2420108],[120.1031,30.24245],[120.0906555,30.2270121],[120.0811866,30.2214484],[120.0835362,30.2072162],[120.0824675,30.1912208],[120.0946834,30.1754184],[120.124,30.197],[120.1319674,30.2069551],[120.1336732,30.2267312],[120.1528705,30.239921],[120.1476357,30.2616005],[120.1302,30.2545]]
points, segments, anchors = h['route_path'](coords, graph, turns, anchors)
plan = {'distance': round(sum(s['km'] for s in segments),1), 'cyclewayKm': round(sum(s['km'] for s in segments if s['kind']=='cycleway'),2), 'anchors': anchors, 'segments': segments, 'wayIds': list(dict.fromkeys(s['way'] for s in segments)), 'checked': '2026-10-19', 'coordinateSystem':'WGS84', 'snapshot':'westlake-unified', 'geometrySource':'https://www.openstreetmap.org/api/0.6/map?bbox=120.09,30.17,120.145,30.23'}
bounds = [min(p[i] for p in points)-.02 for i in (0,1)] + [max(p[i] for p in points)+.02 for i in (0,1)]
inside = lambda p: bounds[0]<=p[0]<=bounds[2] and bounds[1]<=p[1]<=bounds[3]
areas = h['regional'].water_areas('westlake',bounds) + h['regional'].water_areas('qiantang-night',bounds)
mapdata = {'roads':[r for r in roads if any(inside(p) for p in r['points'])], 'water':[w for w in water if any(inside(p) for p in w)], 'waterAreas':areas}
out = 'Object.assign(MAP_DATA.maps,' + json.dumps({'westlake':mapdata},ensure_ascii=False,separators=(',',':')) + ');\n'
out += 'Object.assign(MAP_DATA.paths,' + json.dumps({'westlake-hills-loop':points},separators=(',',':')) + ');\n'
out += 'Object.assign(REGIONAL_PLANS,' + json.dumps({'westlake-hills-loop':plan},ensure_ascii=False,separators=(',',':')) + ');\n'
(ROOT/'westlake-circuit-map-data.js').write_text(out)
print(plan['distance'],'km;',plan['cyclewayKm'],'km highway=cycleway;',len(points),'road nodes')
