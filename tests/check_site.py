"""Dependency-free HTML, stylesheet and asset validation."""
from html.parser import HTMLParser
from pathlib import Path
from collections import Counter
import re
import json

ROOT = Path(__file__).resolve().parent.parent
class Inspector(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=[]; self.elements=[]; self.heading=[]
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs); self.elements.append((tag,attrs))
        if 'id' in attrs: self.ids.append(attrs['id'])
        if re.fullmatch(r'h[1-6]',tag): self.heading.append(tag)

page = Inspector(); page.feed((ROOT/'dist/index.html').read_text())
assert not [k for k,v in Counter(page.ids).items() if v>1], 'Duplicate IDs'
assert page.heading.count('h1') == 1
for tag,a in page.elements:
    for attr in ['aria-controls','aria-labelledby']:
        for ref in a.get(attr,'').split(): assert ref in page.ids, (attr,ref)
    if tag=='img':
        assert a.get('alt'), a
        assert a.get('width') and a.get('height'), a
    if tag=='input':
        assert a.get('name') or a.get('aria-label'), a
        assert a.get('type') in ['checkbox','range'] or 'required' in a, a
    if tag=='a' and a.get('href','').startswith('#') and len(a['href'])>1:
        assert a['href'][1:] in page.ids

css = (ROOT/'dist/style.css').read_text()
# Strip string literals before balancing blocks.
plain=re.sub(r"'(?:[^'\\]|\\.)*'|\"(?:[^\"\\]|\\.)*\"",'',css)
depth=0
for c in plain:
    if c=='{': depth+=1
    if c=='}': depth-=1; assert depth>=0
assert depth==0, 'Unbalanced CSS'
for guard in ['max-width:740px','max-width:380px','min-width:1600px','prefers-reduced-motion:reduce',':focus-visible']:
    assert guard in css, guard
manifest_path=ROOT/'.openai/hosting.json'
if manifest_path.exists():
    manifest=json.loads(manifest_path.read_text())
    assert manifest['static']['directory']=='dist'
    assert manifest['project_id']
else:
    assert (ROOT/'dist/index.html').exists()
js=(ROOT/'dist/app.js').read_text()
for selector in re.findall(r"\$\('#([^']+)'",js):
    assert selector in page.ids, selector
print(f'PASS: {len(page.elements)} HTML elements; {len(page.ids)} unique IDs; CSS blocks, responsive fallbacks, JS targets and deployment entry point verified.')
