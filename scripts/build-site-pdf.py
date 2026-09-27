"""Build the picture-rich offline edition of the Xiamen travel website."""

import html
import io
import json
import subprocess
from collections import defaultdict
from pathlib import Path

from PIL import Image as PILImage, ImageOps
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import CondPageBreak, Flowable, HRFlowable, Image, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from reportlab.lib.utils import ImageReader

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets/xiamen-itinerary-2026.pdf"
INK, TEAL, MUTED, LINE = [colors.HexColor(s) for s in ("#203e48", "#2b777c", "#617a78", "#dae7df")]
DAY_COLORS = ["#648d80", "#d66f56", "#1767bf", "#4b8031", "#8a72a2"]
POINTS = {"酒店":(1025,355),"厦门站":(1200,350),"东渡":(520,185),"三丘田":(510,540),
          "最美转角":(470,555),"龙头路":(440,595),"菽庄":(425,712),"日光岩":(348,637),
          "南普陀":(1050,645),"厦大":(990,715),"白城":(1100,778),"演武":(1010,760),
          "沙坡尾":(790,666),"和平":(680,555),"植物园":(1020,535),"索道":(1050,575),
          "八市":(640,380),"百家村":(865,444),"中山路":(745,465)}
PATHS = [["厦门站","酒店"],
         ["酒店","东渡","三丘田","最美转角","龙头路","菽庄","日光岩","八市"],
         ["酒店","南普陀","厦大","白城","演武","沙坡尾","和平"],
         ["酒店","植物园","索道","八市","中山路"],
         ["酒店","百家村","厦门站"]]


def site_data():
    script = r"""const fs=require('fs'),vm=require('vm');const box={window:{}};
vm.runInNewContext(fs.readFileSync('place-photo-data.js','utf8'),box);
vm.runInNewContext(fs.readFileSync('place-photo-additions.js','utf8'),box);
vm.runInNewContext(fs.readFileSync('travel-enrichment.js','utf8'),box);
const s=fs.readFileSync('app.js','utf8');
vm.runInNewContext(s.slice(0,s.indexOf('const officialSources ='))+'\nthis.data={days,foods}',box);
process.stdout.write(JSON.stringify(box.data));"""
    result = subprocess.run(["node", "-e", script], cwd=ROOT, capture_output=True,
                            check=True, text=True, encoding="utf-8")
    return json.loads(result.stdout)


def p(text, style):
    return Paragraph(html.escape(str(text)), style)


def photo(path, width, height):
    path = str(path)
    source = ROOT / (path if path.startswith("assets/") else "assets/" + path)
    if not source.is_file():
        return None
    with PILImage.open(source) as im:
        im = ImageOps.fit(im.convert("RGB"), (round(width*2), round(height*2)), PILImage.Resampling.LANCZOS)
        buffer = io.BytesIO()
        im.save(buffer, "JPEG", quality=80, optimize=True)
    buffer.seek(0)
    return Image(buffer, width=width, height=height)


class RouteMap(Flowable):
    def __init__(self, width, height, paths, focus=None):
        super().__init__()
        self.width, self.height, self.paths = width, height, paths
        if focus:
            coords = [POINTS[name] for name in focus]
            x0, x1 = max(0,min(x for x,_ in coords)-145), min(1536,max(x for x,_ in coords)+145)
            y0, y1 = max(0,min(y for _,y in coords)-115), min(1024,max(y for _,y in coords)+115)
            ratio = width/height
            if (x1-x0)/(y1-y0) < ratio:
                extra = (y1-y0)*ratio-(x1-x0)
                x0,x1 = max(0,x0-extra/2),min(1536,x1+extra/2)
            else:
                extra = (x1-x0)/ratio-(y1-y0)
                y0,y1 = max(0,y0-extra/2),min(1024,y1+extra/2)
            self.crop = (x0,y0,x1,y1)
        else:
            self.crop = (0,0,1536,1024)
        with PILImage.open(ROOT/"assets/xiamen-overview-watercolor-v2.png") as im:
            im = im.convert("RGB").crop(tuple(map(round,self.crop)))
            im = im.resize((round(width*2),round(height*2)),PILImage.Resampling.LANCZOS)
            self.buffer = io.BytesIO()
            im.save(self.buffer,"JPEG",quality=82,optimize=True)
            self.buffer.seek(0)

    def draw(self):
        c = self.canv
        c.drawImage(ImageReader(self.buffer),0,0,self.width,self.height)
        x0,y0,x1,y1 = self.crop
        def xy(name):
            x,y = POINTS[name]
            return (x-x0)/(x1-x0)*self.width,self.height-(y-y0)/(y1-y0)*self.height
        for day,path in self.paths:
            c.setStrokeColor(colors.HexColor(DAY_COLORS[day]))
            c.setFillColor(colors.HexColor(DAY_COLORS[day]))
            c.setLineWidth(1.8 if len(self.paths)==1 else 1.2)
            for a,b in zip(path,path[1:]):
                ax,ay=xy(a);bx,by=xy(b)
                c.line(ax,ay,bx,by)
            for number,name in enumerate(path,1):
                x,y=xy(name)
                c.setFillColor(colors.white);c.circle(x,y,7 if len(self.paths)==1 else 4.2,fill=1,stroke=0)
                c.setFillColor(colors.HexColor(DAY_COLORS[day]));c.circle(x,y,5.7 if len(self.paths)==1 else 3.2,fill=1,stroke=0)
                if len(self.paths)==1:
                    c.setFillColor(colors.white);c.setFont("Helvetica-Bold",6.7)
                    c.drawCentredString(x,y-2,str(number))
        c.setStrokeColor(LINE);c.rect(0,0,self.width,self.height)


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE);canvas.line(42,38,A4[0]-42,38)
    canvas.setFillColor(MUTED);canvas.setFont("SimHei",8)
    canvas.drawString(42,25,"2026 国庆厦门五日游 · 图文随身版")
    canvas.drawRightString(A4[0]-42,25,str(doc.page))
    canvas.restoreState()


def build():
    pdfmetrics.registerFont(TTFont("SimHei","C:/Windows/Fonts/simhei.ttf"))
    data=site_data(); days=data["days"]; foods=data["foods"]
    s={
        "eyebrow":ParagraphStyle("eyebrow",fontName="SimHei",fontSize=9,leading=14,textColor=TEAL),
        "title":ParagraphStyle("title",fontName="SimHei",fontSize=22,leading=29,textColor=INK,spaceAfter=8),
        "summary":ParagraphStyle("summary",fontName="SimHei",fontSize=9.5,leading=16,textColor=MUTED,spaceAfter=10),
        "section":ParagraphStyle("section",fontName="SimHei",fontSize=11,leading=17,textColor=INK,spaceBefore=8,spaceAfter=5),
        "time":ParagraphStyle("time",fontName="SimHei",fontSize=8.5,leading=13,textColor=TEAL),
        "stop":ParagraphStyle("stop",fontName="SimHei",fontSize=9.3,leading=14,textColor=INK),
        "detail":ParagraphStyle("detail",fontName="SimHei",fontSize=8,leading=12,textColor=MUTED),
        "note":ParagraphStyle("note",fontName="SimHei",fontSize=8.5,leading=14,textColor=MUTED),
        "food":ParagraphStyle("food",fontName="SimHei",fontSize=8.5,leading=12.5,textColor=INK),
        "meta":ParagraphStyle("meta",fontName="SimHei",fontSize=7.4,leading=11,textColor=TEAL),
    }
    doc=SimpleDocTemplate(str(OUTPUT),pagesize=A4,leftMargin=42,rightMargin=42,topMargin=45,
                          bottomMargin=50,title="2026国庆厦门五日游 · 图文随身版",author="厦门五日游路线网站")
    story=[Spacer(1,30),p("XIAMEN / 2026 · 09.30—10.04",s["eyebrow"]),Spacer(1,12),
           p("国庆厦门五日游",s["title"]),p("两人从文灶出发，慢慢走过海岛、老城、山海与夜色。",s["summary"])]
    hero=photo("sunlight_rock.jpg",doc.width,285)
    if hero: story += [hero,Spacer(1,5),p("鼓浪屿日光岩 · 景点实拍",s["detail"])]
    story += [Spacer(1,21),p("09.30 抵达文灶　·　10.01 鼓浪屿　·　10.02 人文海岸",s["note"]),
              p("10.03 植物园与骑楼　·　10.04 百家村返程",s["note"]),PageBreak(),
              p("01 / ROUTE OVERVIEW",s["eyebrow"]),Spacer(1,5),p("五日路线总览",s["title"]),
              p("用颜色找到每天的去程。详细顺序、时间、实景照片和餐饮建议见后页。",s["summary"]),
              RouteMap(doc.width,340,list(enumerate(PATHS))),Spacer(1,12)]
    rows=[[p(days[i]["date"],s["stop"]),p(days[i]["short"],s["stop"]),p(" → ".join(path),s["detail"])] for i,path in enumerate(PATHS)]
    overview=Table(rows,colWidths=[56,82,doc.width-138],hAlign="LEFT")
    overview.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"MIDDLE"),("LINEBELOW",(0,0),(-1,-2),.4,LINE),
                                  ("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7)]))
    story += [overview,PageBreak()]
    for i,day in enumerate(days):
        if i: story.append(PageBreak())
        story += [p(f"02 / DAILY ROUTE · {day['date']} {day['weekday']}",s["eyebrow"]),Spacer(1,5),
                  p(day["title"],s["title"]),p(day["summary"],s["summary"]),
                  RouteMap(doc.width,105 if day.get("rainSchedule") else 138,[(i,PATHS[i])],PATHS[i]),Spacer(1,4),
                  p("编号对应当天站点；底图为手绘路线图。",s["detail"]),p("沿途实景",s["section"])]
        gallery=[]
        for path,caption in day.get("photos",[])[:3]:
            image=photo(path,(doc.width-12)/3,53 if day.get("rainSchedule") else 64)
            if image: gallery.append((image,p(caption,s["detail"])))
        if gallery:
            table=Table([[x[0] for x in gallery],[x[1] for x in gallery]],
                        colWidths=[doc.width/3]*len(gallery),hAlign="LEFT")
            table.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),0),
                                       ("RIGHTPADDING",(0,0),(-1,-1),4)]))
            story.append(table)
        story.append(p("当天时间线",s["section"]))
        rows=[[p(time,s["time"]),[p(title,s["stop"]),p(detail,s["detail"])]] for time,title,detail in day["schedule"]]
        timeline=Table(rows,colWidths=[78,doc.width-78],hAlign="LEFT")
        timeline.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LINEBELOW",(0,0),(-1,-2),.4,LINE),
                                      ("TOPPADDING",(0,0),(-1,-1),2.5),("BOTTOMPADDING",(0,0),(-1,-1),2.5),
                                      ("LEFTPADDING",(0,0),(0,-1),0),("RIGHTPADDING",(-1,0),(-1,-1),0)]))
        story += [timeline,p("当天提示",s["section"]),p(day["note"],s["note"])]
    story += [PageBreak(),p("03 / LOCAL FLAVOURS",s["eyebrow"]),Spacer(1,5),p("厦门美食图鉴",s["title"]),
              p("按地点浏览，再按口味挑一餐。图片标签沿用网站说明；营业、时价和分店以现场为准。",s["summary"])]
    grouped=defaultdict(list)
    for food in foods: grouped[food["area"]].append(food)
    for area in ["八市","中山路","鼓浪屿","沙坡尾","文灶","万象城","百家村"]:
        items=grouped.get(area,[])
        if not items: continue
        story.append(p(f"{area} · {len(items)} 家选择",s["section"]))
        cards=[]
        for item in items:
            image=photo(item.get("image",""),78,64) or p("暂无配图",s["detail"])
            copy=[p(item["name"],s["food"]),p(item["category"]+" · "+item.get("photoLabel","图片参考"),s["meta"]),
                  p(item["summary"],s["detail"])]
            card=Table([[image,copy]],colWidths=[85,doc.width/2-96],hAlign="LEFT")
            card.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#f8f7ef")),
                                      ("BOX",(0,0),(-1,-1),.5,LINE),("LEFTPADDING",(0,0),(-1,-1),5),
                                      ("RIGHTPADDING",(0,0),(-1,-1),4),("TOPPADDING",(0,0),(-1,-1),5),
                                      ("BOTTOMPADDING",(0,0),(-1,-1),5)]))
            cards.append(card)
        for n in range(0,len(cards),2):
            grid=Table([[cards[n],cards[n+1] if n+1<len(cards) else ""]],colWidths=[doc.width/2]*2,hAlign="LEFT")
            grid.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),0),
                                      ("RIGHTPADDING",(0,0),(-1,-1),3),("TOPPADDING",(0,0),(-1,-1),3),
                                      ("BOTTOMPADDING",(0,0),(-1,-1),3)]))
            story.append(grid)
    story += [CondPageBreak(250),p("04 / POCKET NOTES",s["eyebrow"]),Spacer(1,5),p("出门小抄",s["title"])]
    notes=[("随身轻装","身份证、充电宝、运动鞋、帽子、防晒、折叠伞、水杯和薄外套。鼓浪屿当天把大件行李留在酒店。"),
           ("雨天这样改","缩短海边停留；10月2日可改屿见闽南。植物园与索道看天气调整，返程日下雨可取消老城步行。"),
           ("吃饭不赶场","两人先点一份主菜再加小菜。海鲜下单前问清按斤或按只、重量与加工费。"),
           ("出发前核对","鼓浪屿船票码头、厦大预约、植物园雾森时段、索道运行与鹭江夜游检票口，以订单和当日公告为准。")]
    for title,body in notes: story += [p(title,s["section"]),p(body,s["note"]),Spacer(1,8)]
    farewell=[]
    for path,caption in [("assets/gallery/zhongshan-1.jpg","中山路骑楼夜景实拍"),
                         ("assets/gallery/heping-cruise-1.jpg","鹭江夜色实拍")]:
        image=photo(path,doc.width/2-5,150)
        if image: farewell.append((image,p(caption,s["detail"])))
    if len(farewell)==2:
        story += [p("把夜色留给厦门",s["section"]),
                  Table([[farewell[0][0],farewell[1][0]],[farewell[0][1],farewell[1][1]]],
                        colWidths=[doc.width/2]*2,hAlign="LEFT"),Spacer(1,8)]
    story += [Spacer(1,10),HRFlowable(width="100%",thickness=1,color=LINE),Spacer(1,8),
              p("完整可交互地图、景点多视角照片与美食点单详情，请浏览配套网站。",s["note"])]
    doc.build(story,onFirstPage=footer,onLaterPages=footer)
    print(OUTPUT)


if __name__ == "__main__": build()
