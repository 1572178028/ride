"""Build the reviewed center/southwest lake circuit; preserve all other keys."""
import json
import runpy
from pathlib import Path
from lib.geometry import update_geometry

ROOT = Path(__file__).resolve().parents[1]
h = runpy.run_path(str(ROOT / 'scripts/build-verified-maps.py'))
spec = json.loads((ROOT / 'research/qiandao-loop-spec-20261030.json').read_text())
data = h['snapshot'](spec['snapshot'])
ways = {e['id']: e for e in data['elements'] if e['type'] == 'way'}
nodes = {e['id']: e for e in data['elements'] if e['type'] == 'node'}
push = set(spec['pushWays'])
connectors = set(spec['reviewedConnectors'])
normal = h['network'].__globals__['permitted']
push_tags = {id(ways[w]['tags']) for w in push}
connector_tags = {id(ways[w]['tags']) for w in connectors}
# OSM trunk is not a legal motorroad designation. This single city connector
# is reviewed separately against its exact directional cycling response.
# Do not generalize it to other trunk roads or the bridge motor carriageway.
evidence = json.loads((ROOT / spec['connectorEvidence']).read_text())
assert evidence['data']['status'] == '1'
assert 1500 < int(evidence['data']['route']['paths'][0]['distance']) < 1700
h['network'].__globals__['permitted'] = lambda t: normal(t) or id(t) in push_tags or id(t) in connector_tags
coords, network, turns, roads, water = h['network'](data)
allowed = set(spec['allowedWays'])
blocked = ('no', 'private', 'customers', 'residents', 'destination', 'delivery', 'permit')
for wid in allowed:
    w = ways[wid]
    tags = w['tags']
    assert tags['highway'] not in ('motorway', 'motorway_link', 'trunk_link', 'steps', 'construction')
    assert not any(tags.get(k) in blocked for k in ('access', 'vehicle', 'bicycle'))
    if tags['highway'] == 'trunk':
        assert wid in connectors and tags.get('name') == '集贤路' and tags.get('motorroad') != 'yes'
    if wid in push:
        assert tags['highway'] == 'footway' and tags.get('footway') == 'sidewalk'
        assert tags.get('foot') not in blocked
    elif tags.get('tunnel') == 'yes':
        assert tags['highway'] == 'cycleway' or tags.get('cycleway') == 'lane' or (tags.get('bicycle') == 'yes' and tags.get('motor_vehicle') == 'no')
    for nid in w['nodes']:
        n = nodes.get(nid, {}).get('tags', {})
        assert not any(n.get(k) in blocked for k in ('access', 'vehicle', 'bicycle'))
        assert not n.get('ford')
        assert n.get('barrier') not in ('gate', 'lift_gate', 'chain', 'block') or n.get('bicycle') in ('yes', 'designated')
graph = {n: [(v, e) for v, e in edges if e['way'] in allowed] for n, edges in network.items()}
graph = {n: edges for n, edges in graph.items() if edges}
points, segments, anchors = h['route_path'](coords, graph, turns, spec['anchors'])
assert points[0] == points[-1]
for segment in segments:
    if segment['way'] in push:
        segment['mode'] = 'push'
plan = {
    'distance': round(sum(s['km'] for s in segments), 1),
    'cyclewayKm': round(sum(s['km'] for s in segments if s['kind'] == 'cycleway'), 2),
    'paintedLaneKm': round(sum(s['km'] for s in segments if ways[s['way']]['tags'].get('cycleway') == 'lane'), 2),
    'pushKm': round(sum(s['km'] for s in segments if s.get('mode') == 'push'), 2),
    'mixedConnectorKm': round(sum(s['km'] for s in segments if s['way'] in connectors), 2),
    'pushWays': sorted(push), 'reviewedConnectors': sorted(connectors),
    'anchors': anchors, 'segments': segments,
    'wayIds': list(dict.fromkeys(s['way'] for s in segments)),
    'checked': '2026-10-30', 'coordinateSystem': 'WGS84',
    'snapshot': spec['snapshot'], 'geometrySource': 'https://www.openstreetmap.org/',
    'scope': '完整公开道路独立规划；含县城与乡镇道路接驳、桥侧推行，不是平台GPX复刻。',
}
assert 140 < plan['distance'] < 175
bounds = [min(p[i] for p in points) - .025 for i in (0, 1)] + [max(p[i] for p in points) + .025 for i in (0, 1)]
inside = lambda p: bounds[0] <= p[0] <= bounds[2] and bounds[1] <= p[1] <= bounds[3]
maps = {spec['region']: {
    'roads': [r for r in roads if any(inside(p) for p in r['points'])],
    'water': water,
    'waterAreas': h['regional'].water_areas('qiandao', [bounds[0] - .08, bounds[1] - .08, bounds[2] + .08, bounds[3] + .08]),
}}
update_geometry(ROOT, maps=maps, paths={spec['id']: points}, plans={spec['id']: plan})
print(spec['id'], plan['distance'], 'km; cycleway', plan['cyclewayKm'], 'lane', plan['paintedLaneKm'], 'push', plan['pushKm'], 'connector', plan['mixedConnectorKm'])
