"""Build independently checked alternatives to historical Xingzhe route clues."""
import json
import runpy
from pathlib import Path
from lib.geometry import update_geometry
ROOT = Path(__file__).resolve().parents[1]
h = runpy.run_path(str(ROOT / 'scripts/build-verified-maps.py'))
specs = json.loads((ROOT / 'research/hangzhou-expansion-specs.json').read_text())
maps, paths, plans = {}, {}, {}
for spec in specs:
    data = h['snapshot'](spec['region'])
    coords, graph, turns, roads, water = h['network'](data)
    allowed = set(spec['allowedWays'])
    tags = {e['id']: e.get('tags', {}) for e in data['elements'] if e['type'] == 'way'}
    for way in allowed:
        assert h['permitted'](tags[way])
        assert tags[way]['highway'] in ('cycleway', 'secondary', 'tertiary', 'unclassified', 'residential')
    graph = {n: [(v, e) for v, e in edges if e['way'] in allowed] for n, edges in graph.items()}
    graph = {n: edges for n, edges in graph.items() if edges}
    points, segments, actual = h['route_path'](coords, graph, turns, spec['anchors'])
    parking = h['regional'].wgs(list(map(float, spec['parking']['location'].split(','))))
    snap = round(h['regional'].km(parking, points[0])*1000, 1)
    assert snap < 40, ('parking snap, not measured approach', spec['id'], snap)
    assert points[0] == points[-1]
    plans[spec['id']] = {'distance': round(sum(s['km'] for s in segments), 1),
        'cyclewayKm': round(sum(s['km'] for s in segments if s['kind'] == 'cycleway'), 2),
        'anchors': actual, 'segments': segments, 'wayIds': list(dict.fromkeys(s['way'] for s in segments)),
        'checked': '2026-10-23', 'coordinateSystem': 'WGS84', 'snapshot': spec['region'],
        'geometrySource': data['source']['url'], 'parkingPoint': parking, 'parkingSnapMetres': snap,
        'scope': '独立OSM道路规划；不是原行者轨迹，原路书里程/爬升仅保留来源研究；完整去回已存储'}
    paths[spec['id']] = points
    bounds = [min(p[i] for p in points)-.004 for i in (0, 1)] + [max(p[i] for p in points)+.004 for i in (0, 1)]
    inside = lambda p: bounds[0] <= p[0] <= bounds[2] and bounds[1] <= p[1] <= bounds[3]
    areas = []
    for e in data['elements']:
        if e['type'] == 'relation' and e.get('tags', {}).get('natural') == 'water':
            rings = h['regional'].joined_rings(e['members'], 'outer') + h['regional'].joined_rings(e['members'], 'inner')
            rings = [h['regional'].clipped_ring(r, bounds) for r in rings]
            rings = [r for r in rings if r]
            if rings: areas.append({'source': e['id'], 'name': e.get('tags', {}).get('name', ''), 'rings': rings})
    if spec['region'] == 'xiasha-riverside':
        # Reuse the retained full OSM river polygon; the new small bbox lacks it.
        areas += h['regional'].water_areas('qiantang-night', bounds)
        plans[spec['id']]['backgroundWaterSnapshot'] = 'qiantang-night-water.json.gz'
    maps[spec['region']] = {'roads': [r for r in roads if any(inside(p) for p in r['points'])],
        'water': [w for w in water if any(inside(p) for p in w)], 'waterAreas': areas}
    print(spec['id'], plans[spec['id']]['distance'], 'km;', snap, 'm parking/node difference')
update_geometry(ROOT, maps=maps, paths=paths, plans=plans)
