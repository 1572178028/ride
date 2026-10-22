"""Rebuild only the evidence-backed southern out-and-back, not the 7.58 km ring."""
import copy
import json
import runpy
from pathlib import Path
from lib.geometry import update_geometry
ROOT = Path(__file__).resolve().parents[1]
h = runpy.run_path(str(ROOT / 'scripts/build-verified-maps.py'))
data = h['snapshot']('tongjianhu')
# OSM has no bicycle tag here. Retain the original snapshot and scope the
# separately evidenced cycling allowance to this one matched southern way.
evidence = json.loads((ROOT / 'research/tongjianhu-access.json').read_text())
work = copy.deepcopy(data)
allowed = {1049568289, 1049568302, 1049568290, 1180699649}
for way in work['elements']:
    if way['type'] == 'way' and str(way['id']) in evidence['ways']:
        assert way['id'] in allowed and way['tags']['highway'] == 'footway'
        assert not any(way['tags'].get(k) in ('no', 'private') for k in ('bicycle', 'access', 'vehicle'))
        way['tags']['bicycle'] = 'yes'
c, graph, turns, roads, water = h['network'](work)
graph = {n: [(v, e) for v, e in edges if e['way'] in allowed] for n, edges in graph.items()}
graph = {n: edges for n, edges in graph.items() if edges}
parking = h['regional'].wgs([120.072434, 30.117177])
points, segments, anchors = h['route_path'](c, graph, turns, [parking, [120.0534351, 30.1188359], parking])
assert points[0] == points[-1]
plan = {'distance': round(sum(s['km'] for s in segments), 1), 'cyclewayKm': 0,
        'anchors': anchors, 'segments': segments, 'wayIds': list(dict.fromkeys(s['way'] for s in segments)),
        'checked': '2026-10-22', 'coordinateSystem': 'WGS84', 'snapshot': 'tongjianhu',
        'geometrySource': data['source']['url'], 'parkingPoint': parking,
        'parkingSnapMetres': round(h['regional'].km(parking, points[0])*1000, 1),
        'accessEvidence': 'research/tongjianhu-access.json',
        'scope': 'P1附近服务道路—东南岸—九曲梅轩附近南岸折返；完整双程，不环湖，不含到店绕行'}
bounds = [min(p[i] for p in points)-.003 for i in (0,1)] + [max(p[i] for p in points)+.003 for i in (0,1)]
inside = lambda p: bounds[0] <= p[0] <= bounds[2] and bounds[1] <= p[1] <= bounds[3]
areas = []
for e in data['elements']:
    if e['type'] == 'relation' and e.get('tags', {}).get('natural') == 'water':
        rings = h['regional'].joined_rings(e['members'], 'outer') + h['regional'].joined_rings(e['members'], 'inner')
        if rings:
            areas.append({'source': e['id'], 'name': e.get('tags', {}).get('name', ''), 'rings': rings})
background = {'roads': [r for r in roads if any(inside(p) for p in r['points'])], 'water': water, 'waterAreas': areas}
update_geometry(ROOT, maps={'tongjianhu': background}, paths={'tongjianhu-south': points}, plans={'tongjianhu-south': plan})
print('tongjianhu-south', plan['distance'], 'km;', len(points), 'nodes;', plan['parkingSnapMetres'], 'm parking snap')
