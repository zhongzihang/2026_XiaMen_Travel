"""Build the complete static guide; no remote content or interactive PDF controls."""
import argparse
import html
import io
import json
import re
import subprocess
from pathlib import Path

from PIL import Image as PILImage, ImageOps
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, Flowable
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / '.cache/pdf'
OUTPUT = ROOT / 'assets/xiamen-itinerary-2026.pdf'
W, H = A4
MARGIN = 38
WIDTH = W - MARGIN * 2
INK, TEAL, MUTED, PAPER, LINE, ACCENT = [colors.HexColor(c) for c in ['#103845','#277d7e','#546b70','#faf8f2','#d8e4df','#ca7653']]
STYLES, PAGE_LOOKUP, CHAPTERS = {}, {}, {}
USED_IMAGES, EXPECTED_TEXT = set(), set()


def clean(value):
    # Only decorative emoji are omitted; body text stays searchable and selectable.
    value = re.sub(r'[\U0001f000-\U0001ffff\u2600-\u27ff\ufe0f\u200d]', '', str(value))
    return value.replace('\u2011','-').replace('–','-').strip()


def p(value, kind='body', check=True):
    text = clean(value)
    if check and text: EXPECTED_TEXT.add(text)
    return Paragraph(html.escape(text), STYLES[kind])


class Mark(Flowable):
    def __init__(self,key,title):
        super().__init__(); self.key=key; self.title=title; self.width=0; self.height=0
    def draw(self): CHAPTERS[self.key] = self.canv.getPageNumber()


def page_frame(c,doc):
    c.saveState()
    c.setFillColor(PAPER);c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(INK);c.rect(0,H-9,W,9,fill=1,stroke=0)
    c.setFont('Guide',8);c.setFillColor(MUTED)
    c.drawString(MARGIN,H-29,'XIAMEN / 2026     两人 · 五天四晚')
    c.drawRightString(W-MARGIN,H-29,'景点地图与每日行程 / 09.30 - 10.04')
    c.setStrokeColor(LINE);c.line(MARGIN,36,W-MARGIN,36)
    c.drawString(MARGIN,23,'厦门景点地图 · 离线行程版')
    c.drawRightString(W-MARGIN,23,f'{doc.page:02d}')
    c.restoreState()


def image(path,width,max_height):
    source = Path(path)
    if not source.is_absolute(): source = ROOT / (str(path) if str(path).startswith('assets/') else 'assets/'+str(path))
    if not source.is_file(): raise FileNotFoundError(f'Missing PDF image: {source}')
    if ROOT/'assets' in source.parents: USED_IMAGES.add(source.relative_to(ROOT).as_posix())
    with PILImage.open(source) as original:
        im=ImageOps.exif_transpose(original).convert('RGB')
        ratio=min(width/im.width,max_height/im.height)
        iw,ih=im.width*ratio,im.height*ratio
        im.thumbnail((round(iw*2.3),round(ih*2.3)),PILImage.Resampling.LANCZOS)
        buf=io.BytesIO();im.save(buf,'JPEG',quality=86,optimize=True);buf.seek(0)
    return Image(buf,width=iw,height=ih,hAlign='CENTER')


def gallery(items,height=148,columns=2):
    result=[]
    for offset in range(0,len(items),columns):
        group=items[offset:offset+columns]; cellwidth=WIDTH/len(group)
        cells=[[image(item['src'],cellwidth-12,height),Spacer(1,5),p(item.get('caption') or item.get('alt') or '','caption')] for item in group]
        row=Table([cells],colWidths=[cellwidth]*len(group),hAlign='LEFT')
        row.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),9),('BACKGROUND',(0,0),(-1,-1),colors.white)]))
        result.extend([row,Spacer(1,7)])
    return result


def label(text): return p(text,'section')


def box(title,text):
    tab=Table([[[p(title,'smalltitle'),p(text)]]],colWidths=[WIDTH])
    tab.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),colors.HexColor('#eaf0e9')),('BOX',(0,0),(-1,-1),.5,LINE),('LEFTPADDING',(0,0),(-1,-1),12),('RIGHTPADDING',(0,0),(-1,-1),12),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),9)]))
    return [tab,Spacer(1,9)]


def heading(key,eyebrow,title,subtitle='',newpage=True):
    seq=([PageBreak()] if newpage else [])+[Mark(key,title),p(eyebrow,'eyebrow'),p(title,'title')]
    if subtitle:seq.append(p(subtitle,'intro'))
    return seq


def table_index(rows,widths):
    tab=Table(rows,colWidths=widths,hAlign='LEFT')
    tab.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,-1),.4,LINE),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),('LEFTPADDING',(0,0),(-1,-1),2)]))
    return tab


def timeline(schedule):
    return table_index([[p(when,'time'),[p(title,'smalltitle'),p(detail)]] for when,title,detail in schedule],[85,WIDTH-85])


def page_ref(key):return str(PAGE_LOOKUP.get(key,'000'))


SCENIC_POINTS = {
    1: ['longtou','shuzhuang','rock','bashi'],
    2: ['nanputuo','xmu','baicheng','shapowei'],
    3: ['botanic','cable','bashi','zhongshan'],
    4: ['baijia'],
}


def scenic_notes(data, day_index):
    ids=['yujian'] if day_index==99 else SCENIC_POINTS.get(day_index,[])
    if not ids:return []
    points={point['id']:point for point in data['map']['points']}
    def card(key):
        point=points[key];story=data['stories'].get(key,{})
        description=story.get('intro',point['note'])
        return [p(point['name'],'smalltitle'),p(description,'note')]
    rows=[]
    for n in range(0,len(ids),2):
        cells=[card(key) for key in ids[n:n+2]]
        if len(cells)==1:cells.append('')
        rows.append(cells)
    tab=Table(rows,colWidths=[WIDTH/2]*2,hAlign='LEFT')
    tab.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),7),('LINEBELOW',(0,0),(-1,-1),.4,LINE)]))
    return [label('景点简介'),tab,Spacer(1,6)]


def build_story(data):
    seq=heading('cover','TWO PEOPLE · FIVE DAYS · XIAMEN','厦门景点地图与每日行程','按日期查看景点分布、每日安排与景点简介。',False)
    seq+=[Spacer(1,12),image('sunlight_rock.jpg',WIDTH,335),p('鼓浪屿 · 日光岩','caption'),Spacer(1,16),p('09.30 - 10.04','coverdate'),p('从鼓浪屿到老城，沿山海景点展开五日行程。','intro'),p('景点地图与每日行程 · 2026年9月30日整理','meta')]
    seq+=box('阅读说明','先看五日地图，再按日期查看当日地图、时间线和景点简介。地图与手绘地标为插画示意，不作导航。')
    seq+=heading('contents','CONTENTS / 阅读目录','五日景点与安排','按日期查看地图和每日行程。')
    toc=[('overview','五日路线总览'),*[(f'day{i}',d['date']+' · '+d['short']) for i,d in enumerate(data['days'])]]
    seq+=[table_index([[p(title),p(page_ref(key),'time',False)] for key,title in toc],[WIDTH-45,45]),Spacer(1,18)]
    seq+=heading('overview','01 / THE CITY AT A GLANCE','五日路线总览','五天山海慢游，沿着颜色发现每天的风景。')
    seq+=[image(data['maps']['overview'],WIDTH,345),p('手绘地图与地标为插画，非实拍；实线为陆上接驳，虚线为轮渡。方位与比例为示意。','caption')]
    seq+=[table_index([[p(d['date'],'time'),[p(d['short'],'smalltitle'),p(d['detail'],'note')],p(d['badge'],'meta')] for d in data['days']],[62,WIDTH-157,95])]
    for i,day in enumerate(data['days']):
        seq+=heading(f'day{i}',f"02 / DAILY ITINERARY · 第{i+1}天 · {day['date']} {day['weekday']}",day['title'],day['summary'])
        seq+=[p(day['badge'],'meta'),label('当天行程'),timeline(day['schedule']),Spacer(1,10)]
        seq+=heading(f'day{i}-map',day['date']+' / SCENIC MAP','当天景点地图与游览顺序','地图标出当日景点与游览顺序；同一地点的双编号表示两次到访。')
        for n,mp in enumerate(data['maps'][str(i)]):
            seq+=[image(mp,WIDTH,240 if len(data['maps'][str(i)])>1 else 280 if i in [0,4] else 350),p('鼓浪屿岛上路线 · 插画示意' if n else '当天路线 · 插画示意，非导航地图','caption'),Spacer(1,8)]
        seq+=[p('景点顺序：'+' → '.join(r['place'] for r in day['route']),'note')]
        seq+=scenic_notes(data,i)
        if i==2:
            seq+=heading('skip-xmu','10.02 / PLAN B','未入校备选：白城沙滩','仅预约成功且时段合适时入校；未成功时按备选行程游览。')
            seq+=[image(data['maps']['skip'],WIDTH,295),p('未入校备选景点顺序 · 插画示意','caption'),Spacer(1,12)]
            seq+=heading('rain','10.02 / RAINY DAY','雨天备选安排：屿见闽南')
            seq+=[timeline(day['rainSchedule']),Spacer(1,12),image(data['maps']['rain'],WIDTH,240),p('雨天备选路线 · 插画示意','caption')]
            seq+=scenic_notes(data,99)
        seq+=heading(f'day{i}-photos',day['date']+' / PHOTO JOURNAL','当天景点实景图','随当日行程查看景点照片。')
        seq+=gallery([{'src':src,'caption':caption} for src,caption in day['photos']],height=170 if len(day['photos'])<=4 else 120 if len(day['photos'])>6 else 143)
    return seq


def init_fonts():
    fonts=Path('C:/Windows/Fonts')
    pdfmetrics.registerFont(TTFont('Guide',str(fonts/'msyh.ttc'),subfontIndex=0))
    pdfmetrics.registerFont(TTFont('GuideBold',str(fonts/'msyhbd.ttc'),subfontIndex=0))
    sizes={'body':(9.5,15,INK),'intro':(10.5,17,MUTED),'title':(23,31,INK),'eyebrow':(8.5,14,TEAL),'section':(12,18,TEAL),'smalltitle':(10,16,INK),'time':(10,16,TEAL),'note':(9,14,MUTED),'meta':(8,13,TEAL),'caption':(7.5,11,MUTED),'coverdate':(25,34,ACCENT)}
    for kind,(size,leading,color) in sizes.items():
        STYLES[kind]=ParagraphStyle(kind,fontName='GuideBold' if kind in ['title','section','smalltitle','time','coverdate'] else 'Guide',fontSize=size,leading=leading,textColor=color,spaceAfter=5 if kind not in ['title','intro'] else 10,spaceBefore=9 if kind=='section' else 0,wordWrap='CJK',keepWithNext=kind in ['eyebrow','title','section','smalltitle'],allowWidows=0,allowOrphans=0)


def run(reuse=False):
    global PAGE_LOOKUP, CHAPTERS
    if not reuse:subprocess.run(['node',str(ROOT/'scripts/export-pdf-data.cjs')],cwd=ROOT,check=True)
    USED_IMAGES.clear();EXPECTED_TEXT.clear();PAGE_LOOKUP.clear()
    data=json.loads((CACHE/'data.json').read_text(encoding='utf8'));init_fonts()
    for iteration in range(3):
        CHAPTERS={}
        doc=SimpleDocTemplate(str(OUTPUT),pagesize=A4,leftMargin=MARGIN,rightMargin=MARGIN,topMargin=48,bottomMargin=48,title='2026国庆厦门景点地图与每日行程',author='厦门五日行程',pageCompression=1)
        doc.build(build_story(data),onFirstPage=page_frame,onLaterPages=page_frame)
        if CHAPTERS==PAGE_LOOKUP:break
        PAGE_LOOKUP=dict(CHAPTERS)
    else:raise RuntimeError('PDF page index did not converge')
    reader=PdfReader(OUTPUT)
    if any(page.get('/Annots') for page in reader.pages):raise RuntimeError('Unexpected PDF interaction annotations')
    manifest={'pages':len(reader.pages),'pageIndex':PAGE_LOOKUP,'images':sorted(USED_IMAGES),'text':sorted(EXPECTED_TEXT),'days':len(data['days']),'scenicDescriptions':sum(len(items) for items in SCENIC_POINTS.values())+1,'maps':9,'fileBytes':OUTPUT.stat().st_size}
    (CACHE/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8')
    print(json.dumps({k:v for k,v in manifest.items() if k not in ['text','images','pageIndex']}))


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--reuse-data',action='store_true');args=parser.parse_args();run(args.reuse_data)
