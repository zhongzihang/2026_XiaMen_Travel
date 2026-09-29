"""Check source coverage, page indexes, embedded fonts and PDF download payload."""
import importlib.util
import json
import re
from pathlib import Path
from pypdf import PdfReader
import pdfplumber

ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT/'.cache/pdf'
spec=importlib.util.spec_from_file_location('guide',ROOT/'scripts/build-complete-pdf.py')
guide=importlib.util.module_from_spec(spec);spec.loader.exec_module(guide)
data=json.loads((CACHE/'data.json').read_text(encoding='utf8'))
manifest=json.loads((CACHE/'manifest.json').read_text(encoding='utf8'))
reader=PdfReader(guide.OUTPUT)
normalize=lambda value:re.sub(r'\s+','',guide.clean(value))
pages=[normalize(p.extract_text()) for p in reader.pages]
text=''.join(pages)
required=[]
expected_images={'assets/sunlight_rock.jpg'}
def add_image(value):expected_images.add(value if value.startswith('assets/') else 'assets/'+value)
def fields(record,keys):required.extend(record[k] for k in keys if record.get(k))
for day in data['days']:
    fields(day,['title','summary','note'])
    for row in day['schedule']+day.get('rainSchedule',[]):required.extend(row)
    fields(day['transport'],['title','detail'])
    if day['transport'].get('ticket'):add_image(day['transport']['ticket'])
    for image,caption in day['photos']:add_image(image);required.append(caption)
for point in data['map']['points']:
    fields(point,['name','address','note']);add_image(point['photo'])
    fields(data['stories'].get(point['id'],{}),['intro','time','focus'])
    for photo in data['research'].get(point['id'],{}).get('localPhotos',[]):add_image(photo['path'])
    review=data['experiences'].get(point['id'])
    if review:
        for item in [review,*review.get('related',[])]:fields(item,['title','summary','date'])
for food in data['foods']:
    fields(food,['name','address','summary','pair','tip'])
    required.extend(food['dishes'])
    for photo in food['pdfPhotos']:add_image(photo['src']);fields(photo,['caption'])
    for review in food.get('reviews',[]):fields(review,['title','summary','date','rating'])
for tip in data['pageCopy']['tips']:fields(tip,['title','text'])
for edges in data['routes']+[data['skipRoute'],data['map']['rainRoutes']['2026-10-02']]:
    for edge in edges:
        leg=data['transit']['legs'][edge['from']+'-'+edge['to']]
        fields(leg,['path','time'])
        if leg.get('alternative'):required.append(leg['alternative'].replace('点击上方按钮切换为白城备选路线。','采用本日“未入校备选”路线。'))
missing=[s for s in required if normalize(s) not in text]
assert not missing, f'Missing source content: {missing}'
assert expected_images==set(manifest['images']),f'Image coverage mismatch: {expected_images.symmetric_difference(manifest["images"])}'
assert not any(p.get('/Annots') for p in reader.pages),'PDF has interactive annotations'
assert not reader.trailer['/Root'].get('/AcroForm'),'PDF has a form'
assert not reader.trailer['/Root'].get('/OpenAction'),'PDF has an automatic action'
for f in data['foods']:
    page=manifest['pageIndex']['food-'+f['id']]
    assert normalize(f['name']) in pages[page-1],f'Wrong food index: {f["name"]}'
for point in data['map']['points']:
    page=manifest['pageIndex']['point-'+point['id']]
    assert normalize(point['name']) in pages[page-1],f'Wrong place index: {point["name"]}'
fonts=set()
for page in reader.pages:
    for fontref in page['/Resources'].get('/Font',{}).values():
        font=fontref.get_object();name=str(font.get('/BaseFont',''));fonts.add(name)
        if 'Guide' in name or 'Microsoft' in name:
            assert font.get('/FontDescriptor',{}).get('/FontFile2'),'CJK font not embedded'
overflow=[]
with pdfplumber.open(guide.OUTPUT) as pdf:
    for n,page in enumerate(pdf.pages,1):
        for ch in page.chars:
            if ch['x0'] < 25 or ch['x1'] > page.width-25 or ch['top'] < 12 or ch['bottom'] > page.height-12:overflow.append((n,ch['text']))
assert not overflow,f'Text outside page safe bounds: {overflow[:20]}'
report={'pages':len(pages),'sourceTextChecks':len(required),'uniquePhotos':len(expected_images),'foodCards':len(data['foods']),'foodReviews':sum(len(f.get('reviews',[])) for f in data['foods']),'placeExperienceRecords':sum(1+len(v.get('related',[])) for v in data['experiences'].values()),'mapViews':9,'annotations':0,'textOverflow':0,'fonts':sorted(fonts),'bytes':guide.OUTPUT.stat().st_size}
(CACHE/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(report,ensure_ascii=True))
