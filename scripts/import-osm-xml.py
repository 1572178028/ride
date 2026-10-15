"""Convert a saved public OSM API response into a reproducible local snapshot.

The map API is a regular fallback when Overpass is unavailable. Download small
bboxes (the API limits node count), then pass the actual URL and retrieval date.
Contributor account details are omitted; element IDs, geometry, tags, versions
and modification timestamps are retained. Incomplete rings are never closed.
"""
import argparse
import gzip
import json
import xml.etree.ElementTree as ET
from pathlib import Path


def convert(filename, source, checked):
    root = ET.parse(filename).getroot()
    if root.tag != 'osm':
        raise ValueError('Not an OSM API document')
    nodes = {int(e.attrib['id']): e for e in root.findall('node')}
    ways = {int(e.attrib['id']): e for e in root.findall('way')}

    def geometry(way):
        refs = [int(e.attrib['ref']) for e in way.findall('nd')]
        if any(ref not in nodes for ref in refs):
            raise ValueError('Incomplete way: ' + way.attrib['id'])
        return [{'lon': float(nodes[n].attrib['lon']), 'lat': float(nodes[n].attrib['lat'])} for n in refs]

    elements = []
    for element in root:
        if element.tag not in ('node', 'way', 'relation'):
            continue
        record = {'type': element.tag, 'id': int(element.attrib['id'])}
        record['tags'] = {t.attrib['k']: t.attrib['v'] for t in element.findall('tag')}
        for key in ('timestamp', 'version'):
            if key in element.attrib:
                record[key] = element.attrib[key]
        if element.tag == 'node':
            record.update(lon=float(element.attrib['lon']), lat=float(element.attrib['lat']))
        elif element.tag == 'way':
            record['nodes'] = [int(e.attrib['ref']) for e in element.findall('nd')]
            record['geometry'] = geometry(element)
        else:
            record['members'] = []
            for member in element.findall('member'):
                item = {'type': member.attrib['type'], 'ref': int(member.attrib['ref']), 'role': member.attrib.get('role', '')}
                if item['type'] == 'way' and item['ref'] in ways:
                    item['geometry'] = geometry(ways[item['ref']])
                record['members'].append(item)
        elements.append(record)
    return {'version': 0.6, 'generator': root.attrib.get('generator'),
            'source': {'url': source, 'checked': checked, 'coordinateSystem': 'WGS84'},
            'osm3s': {'copyright': '© OpenStreetMap contributors · ODbL'}, 'elements': elements}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input', type=Path)
    parser.add_argument('output', type=Path)
    parser.add_argument('--source', required=True)
    parser.add_argument('--checked', required=True)
    args = parser.parse_args()
    snapshot = convert(args.input, args.source, args.checked)
    with gzip.open(args.output, 'wt', encoding='utf8') as out:
        json.dump(snapshot, out, ensure_ascii=False, separators=(',', ':'))
    print(args.output.name, len(snapshot['elements']), 'OSM elements')
