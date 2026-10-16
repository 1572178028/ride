"""Compatibility entry point for the shared Node/Playwright browser checks."""
from pathlib import Path
import subprocess
import sys

sys.exit(subprocess.call(['node', str(Path(__file__).with_suffix('.cjs'))]))
