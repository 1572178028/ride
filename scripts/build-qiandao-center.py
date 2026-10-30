"""Build two complete Qiandao center variants from the reviewed OSM snapshot."""
import json
import runpy
from pathlib import Path
from lib.geometry import update_geometry

ROOT = Path(__file__).resolve().parents[1]
h = runpy.run_path(str(ROOT / 'scripts/build-verified-maps.py'))
specs = json.loads((ROOT / 'research/qiandao-center-specs-20261030.json').read_text())
data = h['snapshot']('qiandao-center-20261030')
coords, network, turns, roads, water = h['network'](data)
ways = {e['id']: e for e in data['elements'] if e['type'] == 'way'}
nodes = {e['id']: e for e in data['elements'] if e['type'] == 'node'}
paths, plans = {}, {}
for spec in specs:
    allowed = set(spec['allowedWays'])
    for wid in allowed:
        way = ways[wid]
        tags = way['tags']
        assert not any(tags.get(k) in ('no', 'private', 'customers', 'residents', 'destination', 'delivery', 'permit') for k in ('access', 'vehicle'))
        if tags.get('tunnel') == 'yes':
            assert tags['highway'] == 'cycleway' or (tags.get('bicycle') == 'yes' and tags.get('motor_vehicle') == 'no')
        for nid in way['nodes']:
            tag = nodes.get(nid, {}).get('tags', {})
            assert not tag.get('barrier') and not tag.get('ford'), (wid, nid, tag)
            assert not any(tag.get(k) in ('no', 'private', 'customers', 'residents', 'destination', 'delivery', 'permit') for k in ('access', 'vehicle', 'bicycle'))
    graph = {n: [(v, e) for v, e in edges if e['way'] in allowed] for n, edges in network.items()}
    graph = {n: edges for n, edges in graph.items() if edges}
    points, segments, anchors = h['route_path'](coords, graph, turns, spec['anchors'])
    assert points[0] == points[-1]
    paths[spec['id']] = points
    plans[spec['id']] = {
        'distance': round(sum(e['km'] for e in segments), 1),
        'cyclewayKm': round(sum(e['km'] for e in segments if e['kind'] == 'cycleway'), 2),
        'anchors': anchors, 'segments': segments,
        'wayIds': list(dict.fromkeys(e['way'] for e in segments)),
        'checked': '2026-10-30', 'coordinateSystem': 'WGS84',
        'snapshot': spec['snapshot'], 'geometrySource': data['source']['url'],
        'scope': '公开道路独立规划，非原帖轨迹复刻；完整去回及停车道路接驳已计程。',
    }
    print(spec['id'], plans[spec['id']]['distance'], 'km')
all_points = [p for route in paths.values() for p in route]
bounds = [min(p[i] for p in all_points) - .004 for i in (0, 1)] + [max(p[i] for p in all_points) + .004 for i in (0, 1)]
inside = lambda p: bounds[0] <= p[0] <= bounds[2] and bounds[1] <= p[1] <= bounds[3]
maps = {'qiandao-center': {
    'roads': [r for r in roads if any(inside(p) for p in r['points'])],
    'water': [w for w in water if any(inside(p) for p in w)],
    # Landscape maps of this north–south corridor need water beyond the narrow
    # road bbox; retain the existing full shoreline instead of a cut rectangle.
    'waterAreas': h['regional'].water_areas('qiandao', [bounds[0] - .08, bounds[1] - .08, bounds[2] + .08, bounds[3] + .08]),
}}
update_geometry(ROOT, maps=maps, paths=paths, plans=plans)
