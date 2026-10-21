"""Render generated SVG maps to PNG; development tool, not a site dependency.

Run node scripts/generate-maps.cjs first, then python scripts/export-maps.py.
Requires Python Playwright and a Chromium installation.
"""
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
executable = shutil.which('chromium') or shutil.which('chromium-browser')
with sync_playwright() as playwright:
    options = {'headless': True, 'args': ['--no-sandbox']}
    if executable:
        options['executable_path'] = executable
    browser = playwright.chromium.launch(**options)
    page = browser.new_page(viewport={'width': 1000, 'height': 610}, device_scale_factor=2)
    for source in sorted((root / 'assets/maps').glob('*.svg')):
        page.set_content('<style>body{margin:0}svg{display:block}</style>' + source.read_text())
        page.evaluate('document.fonts.ready')
        target = source.with_suffix('.png')
        page.locator('svg').screenshot(path=str(target))
        print(target.name)
    browser.close()
