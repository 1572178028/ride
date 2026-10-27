"""Rebuild only this batch's Jiaxing plans from saved public OSM snapshots."""
import json
import runpy
from pathlib import Path
from lib.geometry import update_geometry

ROOT = Path(__file__).resolve().parents[1]
h = runpy.run_path(str(ROOT / 'scripts/build-verified-maps.py'))
specs = json.loads((ROOT / 'research/jiaxing-expansion-20261027/specs.json').read_text())


def public_way(tags):
    if not h['permitted'](tags):
        return False
    if tags.get('bicycle', '') not in ('', 'yes', 'designated', 'permissive', 'official'):
        return False
    if tags.get('bicycle') not in ('yes', 'designated'):
        if any(tags.get(key, '') not in ('', 'yes', 'permissive', 'official', 'designated')
               for key in ('access', 'vehicle')):
            return False
    return True


maps, paths, plans = {}, {}, {}
for spec in specs:
    data = h['snapshot'](spec['snapshot'])
    ways = {e['id']: e for e in data['elements'] if e['type'] == 'way'}
    allowed = set(spec['allowedWays'])
    for way in allowed:
        tags = ways[way]['tags']
        assert public_way(tags), (spec['id'], way, tags)
        assert tags.get('highway') not in ('path', 'footway', 'pedestrian', 'steps', 'service')
        assert tags.get('tunnel') != 'yes'
    coords, graph, turns, roads, water = h['network'](data)
    blocked_nodes = {e['id'] for e in data['elements'] if e['type'] == 'node' and
                     (e.get('tags', {}).get('ford') in ('yes', 'stepping_stones') or
                      e.get('tags', {}).get('bicycle') in ('no', 'private') or
                      (e.get('tags', {}).get('barrier') in ('gate', 'lift_gate', 'kissing_gate', 'turnstile') and
                       e.get('tags', {}).get('bicycle') not in ('yes', 'designated')))}
    graph = {n: [(v, e) for v, e in edges if e['way'] in allowed and v not in blocked_nodes]
             for n, edges in graph.items() if n not in blocked_nodes}
    graph = {n: edges for n, edges in graph.items() if edges}
    points, segments, anchors = h['route_path'](coords, graph, turns, spec['anchors'])
    assert points[0] == points[-1]
    parking = h['regional'].wgs(spec['parkingGcj'])
    snap = h['regional'].km(parking, points[0]) * 1000
    assert snap < 120, (spec['id'], snap)
    plans[spec['id']] = {
        'distance': round(sum(s['km'] for s in segments), 1),
        'cyclewayKm': round(sum(s['km'] for s in segments if s['kind'] == 'cycleway'), 2),
        'anchors': anchors, 'segments': segments,
        'wayIds': list(dict.fromkeys(s['way'] for s in segments)),
        'snapshot': spec['snapshot'], 'geometrySource': data['source']['url'],
        'checked': '2026-10-27', 'coordinateSystem': 'WGS84',
        'parkingPoint': parking, 'parkingSnapMetres': round(snap, 1),
        'scope': '公开道路独立规划，非平台原轨迹；保存实际去回方向。P/S坐标差不是出口接驳实测。',
    }
    paths[spec['id']] = points
    bounds = [min(p[i] for p in points) - .004 for i in (0, 1)] + [max(p[i] for p in points) + .004 for i in (0, 1)]
    inside = lambda p: bounds[0] <= p[0] <= bounds[2] and bounds[1] <= p[1] <= bounds[3]
    areas = []
    for e in data['elements']:
        if e['type'] == 'relation' and e.get('tags', {}).get('natural') == 'water':
            rings = h['regional'].joined_rings(e['members'], 'outer') + h['regional'].joined_rings(e['members'], 'inner')
            rings = [h['regional'].clipped_ring(r, bounds) for r in rings]
            if any(rings):
                areas.append({'source': e['id'], 'name': e.get('tags', {}).get('name', ''), 'rings': [r for r in rings if r]})
    maps[spec['region']] = {'roads': [r for r in roads if any(inside(p) for p in r['points'])],
                            'water': [w for w in water if any(inside(p) for p in w)], 'waterAreas': areas}
    print(spec['id'], plans[spec['id']]['distance'], 'km;', round(snap, 1), 'm P/S coordinate difference')
update_geometry(ROOT, maps=maps, paths=paths, plans=plans)
