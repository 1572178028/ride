"""Rebuild the reviewed Nanjing public-road rides from their retained OSM ways."""

import runpy
from pathlib import Path

from lib.geometry import update_geometry


ROOT = Path(__file__).resolve().parents[1]
LAOSHAN_START = [118.6543745, 32.1215713]
LAOSHAN_MIDDLE = [118.6352501, 32.11579]
LAOSHAN_TURN = [118.6034274, 32.0971911]
HUANG_LONG_XIAN_START = [118.6853713, 31.781673]
HUANG_LONG_XIAN_MIDDLE = [118.6972554, 31.7784487]
HUANG_LONG_XIAN_TURN = [118.6621161, 31.763305]


def build(region, route_id, reviewed_ways, start, middle, turn):
    routing = runpy.run_path(str(ROOT / "scripts/build-verified-maps.py"))
    snapshot = routing["snapshot"](region)
    coords, network, restrictions, roads, water = routing["network"](snapshot)
    checked_roads = {
        node: [(target, edge) for target, edge in edges if edge["way"] in reviewed_ways]
        for node, edges in network.items()
    }
    checked_roads = {node: edges for node, edges in checked_roads.items() if edges}
    requested = [start, middle, turn, middle, start]
    path, segments, anchors = routing["route_path"](coords, checked_roads, restrictions, requested)
    way_ids = list(dict.fromkeys(segment["way"] for segment in segments))
    if anchors != requested or set(way_ids) != reviewed_ways:
        raise ValueError("The retained snapshot no longer reproduces the reviewed ride")

    turn_index = path.index(turn)
    source = snapshot["source"]
    plan = {
        "distance": round(sum(edge["km"] for edge in segments), 1),
        "cyclewayKm": round(sum(edge["km"] for edge in segments if edge["kind"] == "cycleway"), 2),
        "outboundKm": round(sum(edge["km"] for edge in segments[:turn_index]), 2),
        "inboundKm": round(sum(edge["km"] for edge in segments[turn_index:]), 2),
        "anchors": anchors,
        "segments": segments,
        "wayIds": way_ids,
        "coordinateSystem": source["coordinateSystem"],
        "snapshot": region,
        "checked": source["checked"],
        "geometrySource": source["url"],
    }
    bounds = [
        (min(p[axis] for p in path) - 0.009, max(p[axis] for p in path) + 0.009)
        for axis in (0, 1)
    ]

    def near_path(points):
        return any(all(lo <= coordinate <= hi
                       for coordinate, (lo, hi) in zip(point, bounds)) for point in points)

    basemap = {
        "roads": [road for road in roads if near_path(road["points"])],
        "water": [ring for ring in water if near_path(ring)],
    }
    update_geometry(ROOT, maps={region: basemap}, paths={route_id: path}, plans={route_id: plan})
    print(f"{route_id}: {plan['distance']} km along {len(path)} road nodes")


if __name__ == "__main__":
    build("nanjing-laoshan", "nanjing-laoshan-qizhen",
          {160627951, 160627949, 160623743, 160623742, 404829121, 312543916, 160623745},
          LAOSHAN_START, LAOSHAN_MIDDLE, LAOSHAN_TURN)
    build("nanjing-huanglongxian", "nanjing-huanglongxian-road",
          {346884356, 1522181378, 346884566, 346884441},
          HUANG_LONG_XIAN_START, HUANG_LONG_XIAN_MIDDLE, HUANG_LONG_XIAN_TURN)
