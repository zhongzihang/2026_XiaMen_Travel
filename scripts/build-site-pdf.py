"""Compatibility entry point: always build the complete website guide."""
import runpy
from pathlib import Path

if __name__ == '__main__':
    runpy.run_path(str(Path(__file__).with_name('build-complete-pdf.py')), run_name='__main__')
