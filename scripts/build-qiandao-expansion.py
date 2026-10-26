"""Build only the two Qiandao additions from dated public OSM snapshots."""
import json
import runpy
from pathlib import Path
from lib.geometry import update_geometry

ROOT = Path(__file__).resolve().parents[1]
h = runpy.run_path(str(ROOT / 'scripts/build-verified-maps.py'))
specs = json.loads((ROOT / 'research/qiandao-expansion-specs-20261026.json').read_text())
maps, paths, plans = {}, {}, {}
normal = h['network'].__globals__['permitted']
for spec in specs:
    data = h['snapshot'](spec['snapshot'])
    ways = {e['id']: e for e in data['elements'] if e['type'] == 'way'}
    push = set(spec.get('pushWays', []))
    push_tags = {id(ways[w]['tags']) for w in push}
    for w in push:
        t = ways[w]['tags']
        assert t['highway'] == 'footway' and t.get('footway') == 'sidewalk'
        assert not any(t.get(k) in ('no', 'private') for k in ('access', 'foot'))
    # These two bridge sidewalks are a push-only connection, not a new cycling
    # allowance. Preserve the original OSM tags and exclude motorway/trunk roads.
    h['network'].__globals__['permitted'] = lambda t: normal(t) or id(t) in push_tags
    coords, graph, turns, roads, water = h['network'](data)
    allowed = set(spec['allowedWays'])
    graph = {n: [(v, e) for v, e in edges if e['way'] in allowed] for n, edges in graph.items()}
    graph = {n: edges for n, edges in graph.items() if edges}
    parking = h['regional'].wgs(spec['parkingGcj'])
    anchors = [parking] + spec['anchors']
    if spec['return']:
        anchors += spec['anchors'][-2::-1]
    anchors += [parking]
    points, segments, actual = h['route_path'](coords, graph, turns, anchors)
    assert points[0] == points[-1]
    snap = h['regional'].km(parking, points[0]) * 1000
    assert snap < 50
    for s in segments:
        t = ways[s['way']]['tags']
        assert t['highway'] not in ('motorway', 'trunk', 'trunk_link', 'steps', 'construction')
        if t.get('tunnel') == 'yes':
            assert s['kind'] == 'cycleway' or (t.get('bicycle') == 'yes' and t.get('motor_vehicle') == 'no')
        if s['way'] in push:
            s['mode'] = 'push'
    plans[spec['id']] = {
        'distance': round(sum(s['km'] for s in segments), 1),
        'cyclewayKm': round(sum(s['km'] for s in segments if s['kind'] == 'cycleway'), 2),
        'pushKm': round(sum(s['km'] for s in segments if s.get('mode') == 'push'), 2),
        'pushWays': sorted(push), 'anchors': actual, 'segments': segments,
        'wayIds': list(dict.fromkeys(s['way'] for s in segments)),
        'checked': '2026-10-26', 'coordinateSystem': 'WGS84',
        'snapshot': spec['snapshot'], 'geometrySource': data['source']['url'],
        'parkingPoint': parking, 'parkingSnapMetres': round(snap, 1),
        'scope': '独立公开道路规划，非平台原轨迹；完整行程含道路接驳，桥侧人行通道仅下车推行。',
    }
    paths[spec['id']] = points
    bounds = [min(p[i] for p in points) - .004 for i in (0, 1)] + [max(p[i] for p in points) + .004 for i in (0, 1)]
    inside = lambda p: bounds[0] <= p[0] <= bounds[2] and bounds[1] <= p[1] <= bounds[3]
    maps[spec['region']] = {'roads': [r for r in roads if any(inside(p) for p in r['points'])],
        'water': [w for w in water if any(inside(p) for p in w)],
        'waterAreas': h['regional'].water_areas('qiandao', bounds)}
    print(spec['id'], plans[spec['id']]['distance'], 'km; push', plans[spec['id']]['pushKm'], 'km')
h['network'].__globals__['permitted'] = normal
update_geometry(ROOT, maps=maps, paths=paths, plans=plans)
