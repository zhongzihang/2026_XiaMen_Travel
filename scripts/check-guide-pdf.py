"""Verify the reduced PDF keeps only the requested map and itinerary content."""
import importlib.util
import json
import re
from pathlib import Path

import pdfplumber
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / '.cache/pdf'
spec = importlib.util.spec_from_file_location('guide', ROOT / 'scripts/build-complete-pdf.py')
guide = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guide)
data = json.loads((CACHE / 'data.json').read_text(encoding='utf-8'))
manifest = json.loads((CACHE / 'manifest.json').read_text(encoding='utf-8'))
reader = PdfReader(guide.OUTPUT)
normalize = lambda value: re.sub(r'\s+', '', guide.clean(value))
pages = [normalize(page.extract_text() or '') for page in reader.pages]
text = ''.join(pages)

required = list(manifest['text'])
expected_images = {'assets/sunlight_rock.jpg'}
for day in data['days']:
    required.extend([day['title'], day['summary'], day['badge']])
    for row in day['schedule']:
        required.extend(row)
    for src, caption in day['photos']:
        expected_images.add(src if src.startswith('assets/') else 'assets/' + src)
        required.append(caption)
    required.extend(item['place'] for item in day['route'])
required.extend(row_value for row in data['days'][2]['rainSchedule'] for row_value in row)
points = {point['id']: point for point in data['map']['points']}
scenic_keys = [key for keys in guide.SCENIC_POINTS.values() for key in keys] + ['yujian']
for key in scenic_keys:
    point = points[key]
    required.extend([point['name'], data['stories'].get(key, {}).get('intro') or point['note']])
missing = sorted({value for value in required if normalize(value) and normalize(value) not in text})
assert not missing, f'Missing itinerary/scenic source content: {missing[:20]}'
assert expected_images == set(manifest['images']), f'Photo coverage mismatch: {expected_images.symmetric_difference(manifest["images"])}'

map_files = [data['maps']['overview'], *[path for i in range(len(data['days'])) for path in data['maps'][str(i)]], data['maps']['skip'], data['maps']['rain']]
assert len(map_files) == 9, f'Expected 9 rendered maps, got {len(map_files)}'
for value in map_files:
    path = Path(value)
    if not path.is_absolute():
        path = ROOT / path
    assert path.is_file(), f'Missing map image: {path}'
assert manifest['maps'] == 9
assert manifest['scenicDescriptions'] == len(scenic_keys)

expected_sections = {'cover', 'contents', 'overview'}
for i in range(len(data['days'])):
    expected_sections.update({f'day{i}', f'day{i}-map', f'day{i}-photos'})
expected_sections.update({'skip-xmu', 'rain'})
assert expected_sections <= set(manifest['pageIndex'])
assert not any(name.startswith(('food-', 'point-')) or name.endswith('-transit') for name in manifest['pageIndex']), 'An excluded section remains indexed'
for label in ['美食图鉴', 'LOCAL FLAVOURS', '食客体验', '摄影署名', '这一段，怎么走']:
    assert normalize(label) not in text, f'Excluded section label remains: {label}'
food_names = [normalize(food['name']) for food in data['foods']]
food_card_matches = [name for name in food_names if name and name in text]
assert not food_card_matches, 'A food card title remains in the PDF'
review_phrases = []
for key in set(scenic_keys):
    review = data['experiences'].get(key)
    if review:
        for item in [review, *review.get('related', [])]:
            review_phrases.extend(normalize(item.get(field, '')) for field in ('title', 'summary'))
review_matches = [phrase for phrase in review_phrases if len(phrase) >= 10 and phrase in text]
assert not review_matches, f'A scenic visitor review remains in the PDF: {review_matches[:5]}'
assert not any(page.get('/Annots') for page in reader.pages), 'PDF contains annotations or links'
root = reader.trailer['/Root']
assert not root.get('/AcroForm'), 'PDF contains a form'
assert not root.get('/OpenAction'), 'PDF contains an automatic action'

fonts = set()
for page in reader.pages:
    for font_ref in page['/Resources'].get('/Font', {}).values():
        font = font_ref.get_object()
        name = str(font.get('/BaseFont', ''))
        fonts.add(name)
        if 'Guide' in name or 'Microsoft' in name:
            assert font.get('/FontDescriptor', {}).get('/FontFile2'), 'CJK font is not embedded'
overflow = []
with pdfplumber.open(guide.OUTPUT) as pdf:
    for number, page in enumerate(pdf.pages, 1):
        for char in page.chars:
            if char['x0'] < 25 or char['x1'] > page.width - 25 or char['top'] < 12 or char['bottom'] > page.height - 12:
                overflow.append((number, char['text']))
assert not overflow, f'Text outside page safe bounds: {overflow[:20]}'
report = {
    'pages': len(pages), 'sourceTextChecks': len(required), 'uniquePhotos': len(expected_images),
    'foodCards': len(food_card_matches), 'scenicVisitorReviews': len(review_matches), 'maps': len(map_files),
    'annotations': 0, 'textOverflow': 0, 'fonts': sorted(fonts), 'bytes': guide.OUTPUT.stat().st_size
}
(CACHE / 'verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(report, ensure_ascii=True))
