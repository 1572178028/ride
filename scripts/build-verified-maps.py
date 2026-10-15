"""Build the newly checked directions without overwriting regional-map-data.js."""
import collections
import gzip
import heapq
import importlib.util
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('regional', ROOT / 'scripts/build-regional-maps.py')
regional = importlib.util.module_from_spec(spec)
spec.loader.exec_module(regional)


def snapshot(region):
    return json.load(gzip.open(ROOT / 'research' / (region + '-osm.json.gz'), 'rt'))


def permitted(tags):
    if tags.get('highway') in ('motorway', 'motorway_link', 'trunk', 'trunk_link', 'steps', 'construction', 'proposed', 'raceway', 'services', 'rest_area', 'platform', 'elevator', 'corridor'):
        return False
    if tags.get('bicycle') in ('no', 'private', 'use_sidepath'):
        return False
    if any(tags.get(k) in ('no', 'private', 'customers') for k in ('access', 'vehicle')) and tags.get('bicycle') not in ('yes', 'designated'):
        return False
    if any(k in tags for k in ('bicycle:conditional', 'access:conditional', 'vehicle:conditional', 'oneway:conditional', 'oneway:bicycle:conditional')):
        return False
    if tags.get('highway') in ('path', 'footway', 'pedestrian') and tags.get('bicycle') not in ('yes', 'designated'):
        return False
    return bool(tags.get('highway'))


def network(data):
    coords, graph, roads, water = {}, collections.defaultdict(list), [], []
    restrictions = []
    for e in data['elements']:
        if e['type'] != 'relation' or e.get('tags', {}).get('type') != 'restriction':
            continue
        tags = e['tags']
        if 'bicycle' in tags.get('except', '').split(';'):
            continue
        rule = tags.get('restriction:bicycle') or tags.get('restriction')
        if rule:
            restrictions.append((rule, e.get('members', [])))
    # Exclude ways participating in via-way restrictions. For via-node restrictions
    # the route search checks incoming/outgoing way IDs below.
    blocked = set()
    turns = collections.defaultdict(list)
    for rule, members in restrictions:
        if any(m['role'] == 'via' and m['type'] == 'way' for m in members):
            blocked.update(m['ref'] for m in members if m['type'] == 'way')
            continue
        frm = next((m['ref'] for m in members if m['role'] == 'from'), None)
        to = next((m['ref'] for m in members if m['role'] == 'to'), None)
        via = next((m['ref'] for m in members if m['role'] == 'via' and m['type'] == 'node'), None)
        if None not in (frm, to, via):
            turns[via].append((rule, frm, to))
    for e in data['elements']:
        t, geo = e.get('tags', {}), e.get('geometry', [])
        if e['type'] == 'way' and (t.get('natural') == 'water' or t.get('landuse') == 'reservoir') and geo:
            pts = [[p['lon'], p['lat']] for p in geo]
            if pts[0] == pts[-1]:
                water.append(pts)
        if e['type'] != 'way' or not t.get('highway') or not geo:
            continue
        pts = [[p['lon'], p['lat']] for p in geo]
        roads.append({'id': e['id'], 'name': t.get('name', ''), 'kind': t['highway'], 'points': pts})
        if not permitted(t) or e['id'] in blocked:
            continue
        nodes = e['nodes']
        coords.update(zip(nodes, pts))
        direction = t.get('oneway:bicycle', t.get('oneway', 'yes' if t.get('junction') == 'roundabout' else 'no'))
        for a, b in zip(nodes, nodes[1:]):
            km = regional.km(coords[a], coords[b])
            meta = {'way': e['id'], 'kind': t['highway'], 'name': t.get('name', ''),
                    'shared': t.get('foot') in ('yes', 'designated'), 'km': km}
            if direction != '-1':
                graph[a].append((b, meta))
            if direction not in ('yes', '1', 'true'):
                graph[b].append((a, meta))
    return coords, graph, turns, roads, water


def route_path(coords, graph, turns, anchors):
    ids = [min(graph, key=lambda n: regional.km(coords[n], p)) for p in anchors]
    for n, p in zip(ids, anchors):
        if regional.km(coords[n], p) > .35:
            raise ValueError(('anchor too far from a permitted road', p, coords[n]))
    result, segments = [], []
    incoming, previous_node = 0, 0
    for start, end in zip(ids, ids[1:]):
        initial = (start, incoming, previous_node)
        queue, cost, prev = [(0, initial)], {initial: 0}, {}
        final = None
        while queue:
            distance, state = heapq.heappop(queue)
            node, before, previous_node = state
            if distance != cost[state]:
                continue
            if node == end:
                final = state
                break
            for after, meta in graph[node]:
                if any(frm == before and ((rule == 'no_u_turn' and to == meta['way'] and after == previous_node) or (rule.startswith('no_') and rule != 'no_u_turn' and to == meta['way']) or (rule.startswith('only_') and to != meta['way'])) for rule, frm, to in turns[node]):
                    continue
                nxt = (after, meta['way'], node)
                candidate = distance + meta['km'] * (.8 if meta['kind'] == 'cycleway' else 1)
                if candidate < cost.get(nxt, math.inf):
                    cost[nxt], prev[nxt] = candidate, (state, meta)
                    heapq.heappush(queue, (candidate, nxt))
        if final is None:
            raise ValueError(('no permitted connection', coords[start], coords[end]))
        chain, edges = [final[0]], []
        cursor = final
        while cursor != initial:
            cursor, meta = prev[cursor]
            chain.append(cursor[0])
            edges.append(meta)
        result.extend(list(reversed(chain)) if not result else list(reversed(chain))[1:])
        segments.extend(reversed(edges))
        incoming, previous_node = final[1], final[2]
    return [coords[n] for n in result], segments, [coords[n] for n in ids]


def build(specs):
    maps, paths, plans = {}, {}, {}
    groups = collections.defaultdict(list)
    for item in specs:
        groups[item['region']].append(item)
    for region, items in groups.items():
        source_region = items[0].get('snapshot', region)
        data = snapshot(source_region)
        coords, graph, turns, roads, water = network(data)
        for item in items:
            points, segments, anchors = route_path(coords, graph, turns, item['anchors'])
            multiplier = 2 if item.get('return') else 1
            paths[item['id']] = points
            plans[item['id']] = {'distance': round(sum(s['km'] for s in segments) * multiplier, 1),
                                 'cyclewayKm': round(sum(s['km'] for s in segments if s['kind'] == 'cycleway') * multiplier, 2),
                                 'anchors': anchors, 'segments': segments, 'wayIds': list(dict.fromkeys(s['way'] for s in segments)),
                                 'checked': data.get('source', {}).get('checked', '2026-10-15'), 'coordinateSystem': 'WGS84',
                                 'snapshot': source_region, 'geometrySource': data.get('source', {}).get('url', 'Overpass saved snapshot')}
            print(item['id'], plans[item['id']]['distance'], 'km', len(points), 'points')
        # Use the combined extent, retaining context for every plan in this area.
        all_points = [p for item in items for p in paths[item['id']]]
        bounds = [min(p[i] for p in all_points) - .015 for i in (0, 1)] + [max(p[i] for p in all_points) + .015 for i in (0, 1)]
        within = lambda p: bounds[0] <= p[0] <= bounds[2] and bounds[1] <= p[1] <= bounds[3]
        maps[region] = {'roads': [r for r in roads if any(within(p) for p in r['points'])],
                        'water': [w for w in water if any(within(p) for p in w)],
                        'waterAreas': regional.water_areas(region, bounds)}
    out = 'Object.assign(MAP_DATA.maps,' + json.dumps(maps, ensure_ascii=False, separators=(',', ':')) + ');\n'
    out += 'Object.assign(MAP_DATA.paths,' + json.dumps(paths, ensure_ascii=False, separators=(',', ':')) + ');\n'
    out += 'Object.assign(REGIONAL_PLANS,' + json.dumps(plans, ensure_ascii=False, separators=(',', ':')) + ');\n'
    (ROOT / 'verified-map-data.js').write_text(out)


if __name__ == '__main__':
    build(json.loads((ROOT / 'research/verified-plan-specs.json').read_text()))
