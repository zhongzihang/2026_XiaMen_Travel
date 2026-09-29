"""Build the complete static guide; no remote content or interactive PDF controls."""
import argparse
import html
import io
import json
import re
import subprocess
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlparse, unquote

from PIL import Image as PILImage, ImageOps
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, KeepTogether, Flowable
from reportlab.platypus.flowables import _listWrapOn
from reportlab.pdfgen.canvas import Canvas
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


def source_id(url):
    parsed = urlparse(url)
    if 'xiaohongshu' in parsed.netloc:
        note = re.search(r'/(?:explore|search_result)/([a-zA-Z0-9]+)',parsed.path)
        return '小红书笔记 ' + (note.group(1) if note else '（按标题查找）')
    if 'commons.wikimedia' in parsed.netloc:
        return 'Wikimedia Commons · ' + unquote(parsed.path.rsplit('/',1)[-1]).replace('File:','')
    return parsed.netloc + unquote(parsed.path)


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
    c.drawRightString(W-MARGIN,H-29,'完整图文攻略 / 09.30 - 10.04')
    c.setStrokeColor(LINE);c.line(MARGIN,36,W-MARGIN,36)
    c.drawString(MARGIN,23,'厦门五日游 · 离线阅读版')
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


def reviews(items,kind='食客测评'):
    seq=[label(kind)] if items else []
    for review in items:
        meta=' · '.join(clean(review.get(k,'')) for k in ['source','date','rating','engagement'] if review.get(k))
        seq.append(KeepTogether([p(meta,'meta'),p(review.get('title','到店体验'),'smalltitle'),p(review['summary']),Spacer(1,5)]))
    return seq


def table_index(rows,widths):
    tab=Table(rows,colWidths=widths,hAlign='LEFT')
    tab.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,-1),.4,LINE),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),('LEFTPADDING',(0,0),(-1,-1),2)]))
    return tab


def timeline(schedule):
    return table_index([[p(when,'time'),[p(title,'smalltitle'),p(detail)]] for when,title,detail in schedule],[85,WIDTH-85])


def transit(data,edges,dayindex):
    points={point['id']:point for point in data['map']['points']};seq=[]
    for n,edge in enumerate(edges):
        leg=data['transit']['legs'][edge['from']+'-'+edge['to']]
        start=0 if points[edges[0]['from']]['locationType']=='hotel' else 1
        alt=leg.get('alternative','').replace('点击上方按钮切换为白城备选路线。','采用本日“未入校备选”路线。')
        seq.append(KeepTogether([p(f"{n+start:02d} → {n+start+1:02d}  {points[edge['from']]['name']} → {points[edge['to']]['name']}",'smalltitle'),p(data['transit']['modes'][leg['mode']]+' · '+leg['time'],'meta'),p(leg['path']),*([p(alt,'note')] if alt else []),Spacer(1,9)]))
    seq.append(p(data['transit']['notes'][dayindex],'note'))
    return seq


def point_photos(data,point):
    story=data['stories'].get(point['id'],{});research=data['research'].get(point['id'],{})
    caption=story.get('originalCaption',point['name']+' · 实景照片')
    if point['photo']=='shapowei.jpg':caption='沙坡尾避风坞 · 历史影像'
    if point['photo']=='new_baicheng.jpg':caption='白城沙滩 · 实拍旧照'
    photos=[{'src':point['photo'],'caption':caption}]
    for n,photo in enumerate(research.get('localPhotos',[])):
        captions=story.get('captions',[])
        photos.append({'src':photo['path'],'caption':captions[n] if n<len(captions) else point['name']+f' · 实景视角 {n+1}'})
    return photos


def page_ref(key):return str(PAGE_LOOKUP.get(key,'000'))


def measure(items):
    def flatten(seq):
        for item in seq:
            if isinstance(item,KeepTogether):yield from flatten(item._content)
            else:yield item
    return _listWrapOn(list(flatten(items)),WIDTH-12,Canvas(io.BytesIO()))[1]


def food_page(food,n):
    def content(photo_height):
        block=heading('food-'+food['id'],f"LOCAL FLAVOURS / {n:02d} · {food['area']} · {food['category']}",food['name'],food['address'],False)
        details=[p(food['summary']),label('点什么 · 两人怎么点'),*[p('• '+dish) for dish in food['dishes']],p(food['pair'],'note'),p(food['tip'],'note')]
        if len(food['pdfPhotos'])==1:
            item=food['pdfPhotos'][0]
            left=[image(item['src'],185,photo_height+65),Spacer(1,6),p(item.get('caption') or item.get('alt') or food['photoLabel'],'caption')]
            tab=Table([[left,details]],colWidths=[200,WIDTH-200],hAlign='LEFT')
            tab.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),('BACKGROUND',(0,0),(0,0),colors.white)]))
            block.extend([tab,Spacer(1,8)])
        else:
            block+=[p(food['summary'])]
            block+=gallery(food['pdfPhotos'],height=photo_height,columns=len(food['pdfPhotos']) if len(food['pdfPhotos']) in [3,4] else 2)
            block+=details[1:]
        block+=[p(food.get('photoNote') or food['photoLabel'],'caption')]
        block+=reviews(food.get('reviews',[]))
        if food.get('reviews'):block+=[p('个人体验与平台评分分开展示；实际口味、排队与营业情况以到店为准。','caption')]
        return block
    for h in [173,155,140,125,110,95]:
        block=content(h)
        if measure(block)<=726:return block
    # Very detailed entries get a deliberate second page, never an orphaned review.
    for h in [173,155,140,125,110,95]:
        block=content(h)
        review_start=next(i for i,f in enumerate(block) if isinstance(f,Paragraph) and f.getPlainText()=='食客测评')
        if measure(block[:review_start])<=726:break
    return block[:review_start]+heading('food-review-'+food['id'],'LOCAL FLAVOURS / 食客测评',food['name']+' · 体验记录')+block[review_start+1:]


def build_story(data):
    seq=heading('cover','TWO PEOPLE · FIVE DAYS · ONE ISLAND CITY','2026 国庆 · 厦门游玩规划',data['pageCopy']['intro'],False)
    seq+=[Spacer(1,12),image('sunlight_rock.jpg',WIDTH,335),p('鼓浪屿 · 日光岩实拍','caption'),Spacer(1,16),p('09.30 - 10.04','coverdate'),p('海岛到老城，山海路线顺路游。','intro'),p('完整图文版 · 2026年9月30日整理','meta')]
    seq+=box('这本攻略怎么用','按日期阅读行程与交通，按页码查景点和门店。所有相册、雨天备选与测评已展开为静态内容；照片不依赖网络加载。地图为插画方位示意，不能作为精确导航。')
    seq+=heading('contents','CONTENTS / 阅读目录','把整趟旅行放进口袋','时间是建议节奏，节假日交通和排队随当天情况调整。')
    toc=[('overview','五日路线总览'),*[(f'day{i}',d['date']+' · '+d['short']) for i,d in enumerate(data['days'])],('places','景点、码头与住宿详情'),('food-index','美食索引'),('food','美食图鉴 · 全部57家'),('tips','出门小抄'),('sources','资料来源与摄影署名')]
    seq+=[table_index([[p(title),p(page_ref(key),'time',False)] for key,title in toc],[WIDTH-45,45]),Spacer(1,18)]
    seq+=box('随手翻到','先看每天的时间线，再看分段交通。10月2日的未入校与雨天方案单独展开；景点与美食详情集中收录，重复到访的地点无需来回寻找。')
    seq+=heading('overview','01 / THE CITY AT A GLANCE','五日路线总览','五天山海慢游，沿着颜色发现每天的风景。')
    seq+=[image(data['maps']['overview'],WIDTH,345),p('手绘地图与地标为插画，非实拍；实线为陆上接驳，虚线为轮渡。方位与比例为示意。','caption')]
    seq+=[table_index([[p(d['date'],'time'),[p(d['short'],'smalltitle'),p(d['detail'],'note')],p(d['badge'],'meta')] for d in data['days']],[62,WIDTH-157,95])]
    for i,day in enumerate(data['days']):
        seq+=heading(f'day{i}',f"02 / DAILY ROUTE · 第{i+1}天 · {day['date']} {day['weekday']}",day['title'],day['summary'])
        seq+=[p(day['badge'],'meta'),label('当天时间线'),timeline(day['schedule']),Spacer(1,10)]
        seq+=box('当天提示',day['note'])
        tr=day['transport']
        seq+=heading(f'day{i}-map',day['date']+' / ROUTE MAP','当天地图与游览顺序','数字对应当天交通段；同一地点的双编号表示两次到访。')
        for n,mp in enumerate(data['maps'][str(i)]):
            seq+=[image(mp,WIDTH,240 if len(data['maps'][str(i)])>1 else 280 if i in [0,4] else 350),p('鼓浪屿岛上路线 · 插画示意' if n else '当天路线 · 插画示意，非导航地图','caption'),Spacer(1,8)]
        seq+=[p('路线速记：'+' → '.join(r['place'] for r in day['route']),'note')]
        seq+=box(tr['title'],tr['detail'])
        if i in [0,4]:seq+=[label('这一段，怎么走')]
        else:seq+=heading(f'day{i}-transit',day['date']+' / STEP BY STEP','这一段，怎么走','耗时为规划参考；步行不含游览停留，打车不含等车，地铁包含出入口步行。')
        if i==0:seq+=box('深圳北 → 厦门站 · 动车 D672 · 3小时54分钟','15:55 从深圳北站发车，19:49 抵达厦门站。按车票车厢号上车，到站后沿出站指引进入站前交通区。')
        seq+=transit(data,data['routes'][i],i)
        if i==2:
            seq+=heading('skip-xmu','10.02 / PLAN B','未入校时，直接走白城','仅预约成功且时段合适时入校。未成功时走校外道路，不在校门口等待。')
            seq+=[image(data['maps']['skip'],WIDTH,295),p('未入校备选路线 · 插画示意','caption'),Spacer(1,12)]
            seq+=transit(data,[e for e in data['skipRoute'] if e['from']=='nanputuo' and e['to']=='baicheng'],2)
            seq+=heading('rain','10.02 / RAINY DAY','雨天这样走：屿见闽南',data['transit']['rainNote'])
            seq+=[timeline(day['rainSchedule']),Spacer(1,12),image(data['maps']['rain'],WIDTH,240),p('雨天备选路线 · 插画示意','caption')]
            seq+=heading('rain-transit','10.02 / RAINY DAY TRANSIT','雨天接驳与晚间返程')
            seq+=transit(data,data['map']['rainRoutes']['2026-10-02'],2)
            seq+=box('夜游后回文灶',data['transit']['legs']['heping-hotel']['path']+' '+data['transit']['legs']['heping-hotel']['alternative'])
        seq+=heading(f'day{i}-photos',day['date']+' / PHOTO JOURNAL','当天实景图','相册中的每个视角均已展开；照片性质沿用网站说明。')
        seq+=gallery([{'src':src,'caption':caption} for src,caption in day['photos']],height=140 if tr.get('ticket') else 170 if len(day['photos'])<=4 else 120 if len(day['photos'])>6 else 143)
        if tr.get('ticket'):seq+=[label(tr['caption']),image(tr['ticket'],WIDTH,215),p(tr['alt'],'caption')]
    seq+=heading('places','03 / PLACES & STORIES','景点、码头与住宿','地址、游览提示、完整相册与游客体验，按首次到访顺序查阅。')
    order=[]
    for edges in data['routes']:
        for edge in edges:
            for key in [edge['from'],edge['to']]:
                if key not in order:order.append(key)
    order.append('yujian');points={v['id']:v for v in data['map']['points']}
    seq+=[table_index([[p(points[key]['name']),p(page_ref('point-'+key),'time',False)] for key in order],[WIDTH-45,45])]
    for key in order:
        point=points[key];story=data['stories'].get(key,{})
        seq+=heading('point-'+key,'PLACES / 沿途听一段',point['name'],point['address'])
        seq+=[p(point['note'],'note')]
        if story:seq+=[p(story['intro']),p(story['time'],'meta'),p(story['focus'],'note')]
        items=point_photos(data,point);seq+=gallery(items,height=130 if len(items)>4 or key in ['shapowei','shuzhuang'] else 152)
        review=data['experiences'].get(key)
        if review:seq+=reviews([review,*review.get('related',[])],'游客体验')
    seq+=heading('food-index','04 / FIND YOUR NEXT MEAL','按片区找一餐','页码对应完整门店卡片。前八家沿用网站指定顺序，其余沿用生成时的网站排序。')
    grouped=defaultdict(list)
    for n,food in enumerate(data['foods'],1):grouped[food['area']].append((n,food))
    for area,items in grouped.items():
        seq+=[label(area),table_index([[p(f'{n:02d}','meta'),p(f['name']),p(f['category'],'meta'),p(page_ref('food-'+f['id']),'time',False)] for n,f in items],[27,WIDTH-139,76,36])]
    for n,food in enumerate(data['foods'],1):
        if n==1:seq.extend([PageBreak(),Mark('food','美食图鉴')])
        else:seq.append(PageBreak())
        seq+=food_page(food,n)
    seq+=heading('tips','05 / POCKET NOTES','出门小抄','路线留有弹性，天气、排队和体力比打卡更重要。')
    for tip in data['pageCopy']['tips']:seq+=box(tip['title'],tip['text'])
    seq+=[label('先鲜后逛'),p(data['pageCopy']['foodIntro']),p(data['pageCopy']['foodNote']),Spacer(1,10)]
    seq+=box('离线版说明','本册按照已验收的网站内容整理，收录五日行程、晴雨备选、点位详情和全部美食。测评为已收录的个人体验或平台评分，不代表当前营业与出品。运营信息以出行当日公告和订单为准。')
    seq+=heading('sources','06 / SOURCES & CREDITS','资料来源与摄影署名','以下为网站已收录的来源记录。保留作者、平台、日期与可检索标识；本册不设置超链接或跳转按钮。')
    seq+=[label('官方信息与旅行资料')]
    for record in data['officialSources']+data['socialSources']:
        seq.append(KeepTogether([p(record[0],'smalltitle'),p(record[2] if len(record)>2 else '','note'),p(source_id(record[1]),'source'),Spacer(1,4)]))
    seq+=[label('门店测评出处')]
    for food in data['foods']:
        seq+=[p(food['name'],'smalltitle')]
        for review in food.get('reviews',[]):
            seq+=[p(' · '.join(str(review.get(k,'')) for k in ['source','date','title'] if review.get(k)),'note')]
            if review.get('url'):seq+=[p(source_id(review['url']),'source')]
        if food.get('source'):seq+=[p('门店资料：'+source_id(food['source']),'source')]
    seq+=[label('景点体验出处')]
    for key in order:
        review=data['experiences'].get(key)
        if not review:continue
        seq+=[p(points[key]['name'],'smalltitle')]
        for item in [review,*review.get('related',[])]:
            seq+=[p(' · '.join(item.get(k,'') for k in ['source','date','title'] if item.get(k)),'note'),p(source_id(item['url']),'source')]
    seq+=[label('摄影与插画署名')]
    for credit in data['credits']:
        seq+=[p(credit['text'],'note')]
        for link in credit['links']:
            if 'creativecommons.org' not in link['url']:seq+=[p(source_id(link['url']),'source')]
    seq+=[p('照片按原比例排入版面，未做生成式修改。网站中重复出现的照片保留各自图注；地图和地标为插画，不能称为实拍。用户提供的动车票原图随对应日期收录。','note')]
    return seq


def init_fonts():
    fonts=Path('C:/Windows/Fonts')
    pdfmetrics.registerFont(TTFont('Guide',str(fonts/'msyh.ttc'),subfontIndex=0))
    pdfmetrics.registerFont(TTFont('GuideBold',str(fonts/'msyhbd.ttc'),subfontIndex=0))
    sizes={'body':(9.5,15,INK),'intro':(10.5,17,MUTED),'title':(23,31,INK),'eyebrow':(8.5,14,TEAL),'section':(12,18,TEAL),'smalltitle':(10,16,INK),'time':(10,16,TEAL),'note':(9,14,MUTED),'meta':(8,13,TEAL),'caption':(7.5,11,MUTED),'source':(7,10,MUTED),'coverdate':(25,34,ACCENT)}
    for kind,(size,leading,color) in sizes.items():
        STYLES[kind]=ParagraphStyle(kind,fontName='GuideBold' if kind in ['title','section','smalltitle','time','coverdate'] else 'Guide',fontSize=size,leading=leading,textColor=color,spaceAfter=5 if kind not in ['title','intro'] else 10,spaceBefore=9 if kind=='section' else 0,wordWrap='CJK',keepWithNext=kind in ['eyebrow','title','section','smalltitle'],allowWidows=0,allowOrphans=0)


def run(reuse=False):
    if not reuse:subprocess.run(['node',str(ROOT/'scripts/export-pdf-data.cjs')],cwd=ROOT,check=True)
    data=json.loads((CACHE/'data.json').read_text(encoding='utf8'));init_fonts()
    global PAGE_LOOKUP, CHAPTERS
    for iteration in range(3):
        CHAPTERS={}
        doc=SimpleDocTemplate(str(OUTPUT),pagesize=A4,leftMargin=MARGIN,rightMargin=MARGIN,topMargin=48,bottomMargin=48,title='2026国庆厦门五日游 · 完整图文攻略',author='厦门五日游路线网站',pageCompression=1)
        doc.build(build_story(data),onFirstPage=page_frame,onLaterPages=page_frame)
        if CHAPTERS==PAGE_LOOKUP:break
        PAGE_LOOKUP=dict(CHAPTERS)
    else:raise RuntimeError('PDF page index did not converge')
    reader=PdfReader(OUTPUT)
    if any(page.get('/Annots') for page in reader.pages):raise RuntimeError('Unexpected PDF interaction annotations')
    manifest={'pages':len(reader.pages),'pageIndex':PAGE_LOOKUP,'images':sorted(USED_IMAGES),'text':sorted(EXPECTED_TEXT),'days':len(data['days']),'places':len(data['map']['points']),'foods':len(data['foods']),'foodReviews':sum(len(f.get('reviews',[])) for f in data['foods']),'fileBytes':OUTPUT.stat().st_size}
    (CACHE/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8')
    print(json.dumps({k:v for k,v in manifest.items() if k not in ['text','images','pageIndex']}))


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--reuse-data',action='store_true');args=parser.parse_args();run(args.reuse_data)
