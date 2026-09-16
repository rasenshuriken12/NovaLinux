#!/usr/bin/env python3
"""Rebuild the single-file NovaLinuxOS.html from this folder."""
import re, os

root = os.path.dirname(os.path.abspath(__file__))
index = open(os.path.join(root, 'index.html')).read()

def inline_css(m):
    p = os.path.join(root, m.group(1))
    return '<style>\n' + open(p).read().rstrip('\n') + '\n</style>'

def inline_js(m):
    p = os.path.join(root, m.group(1))
    return '<script>\n' + open(p).read().rstrip('\n') + '\n</script>'

out = re.sub(r'<link rel="stylesheet" href="([^"]+)">', inline_css, index)
out = re.sub(r'<script src="([^"]+)"></script>', inline_js, out)
assert '<link rel="stylesheet"' not in out and '<script src=' not in out

dest = os.path.join(root, '..', 'NovaLinuxOS.html')
open(dest, 'w').write(out)
print('wrote', os.path.abspath(dest), len(out), 'bytes')
