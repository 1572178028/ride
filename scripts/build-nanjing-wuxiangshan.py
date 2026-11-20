"""Rebuild the Wuxiangshan public-road route from its retained OSM snapshot."""

import runpy
from pathlib import Path

from lib.geometry import update_geometry


ROOT = Path(__file__).resolve().parents[1]
REGION = "nanjing-wuxiangshan"
ROUTE = "nanjing-wuxiangshan-road"
REVIEWED_WAYS = {
    909515700, 626346770, 1227579042, 1321466640, 1321466641, 1413488328,
    1413488329, 1103157658, 1103110571, 1103109336, 1034840477, 1103157657,
    1413488331, 1413488330, 260971755,
}
START = [119.0343761, 31.5798792]
MEILING_JUNCTION = [119.0302093, 31.5783161]
TOWN_TURN = [119.0356111, 31.6224699]
JINJING_WESTBOUND = [119.0353765, 31.6224738]


def build():
    helpers = runpy.run_path(str(ROOT / "scripts/build-verified-maps.py"))
    data = helpers["snapshot"](REGION)
    coords, graph, turns, roads, water = helpers["network"](data)
    blocked_nodes = {
        item["id"] for item in data["elements"]
        if item["type"] == "node" and (
            item.get("tags", {}).get("bicycle") == "no"
            or item.get("tags", {}).get("access") in {"no", "private"}
            or "barrier" in item.get("tags", {})
        )
    }
    reviewed = {
        start: [(end, edge) for end, edge in edges
                if end not in blocked_nodes and edge["way"] in REVIEWED_WAYS]
        for start, edges in graph.items() if start not in blocked_nodes
    }
    reviewed = {node: edges for node, edges in reviewed.items() if edges}
    requested = [START, MEILING_JUNCTION, TOWN_TURN, JINJING_WESTBOUND,
                 MEILING_JUNCTION, START]
    path, segments, anchors = helpers["route_path"](coords, reviewed, turns, requested)
    if anchors != requested or path[0] != path[-1]:
        raise ValueError("The expected road nodes no longer make a closed route")
    way_ids = list(dict.fromkeys(segment["way"] for segment in segments))
    if set(way_ids) != REVIEWED_WAYS:
        raise ValueError("Route changed its reviewed roads")
    source = data["source"]
    turn_index = path.index(TOWN_TURN)
    plan = {
        "distance": round(sum(segment["km"] for segment in segments), 1),
        "cyclewayKm": round(sum(segment["km"] for segment in segments
                                if segment["kind"] == "cycleway"), 2),
        "outboundKm": round(sum(segment["km"] for segment in segments[:turn_index]), 2),
        "inboundKm": round(sum(segment["km"] for segment in segments[turn_index:]), 2),
        "anchors": anchors,
        "segments": segments,
        "wayIds": way_ids,
        "coordinateSystem": source["coordinateSystem"],
        "snapshot": REGION,
        "checked": source["retrieved"],
        "geometrySource": source["url"],
    }
    bounds = [(min(point[axis] for point in path) - .015,
               max(point[axis] for point in path) + .015) for axis in (0, 1)]

    def near_route(points):
        return any(all(low <= value <= high
                       for value, (low, high) in zip(point, bounds)) for point in points)

    road_map = {
        "roads": [road for road in roads if near_route(road["points"])],
        "water": [ring for ring in water if near_route(ring)],
    }
    update_geometry(ROOT, maps={REGION: road_map}, paths={ROUTE: path}, plans={ROUTE: plan})
    print(f"{ROUTE}: {plan['distance']} km, {len(path)} road nodes")


if __name__ == "__main__":
    build()
