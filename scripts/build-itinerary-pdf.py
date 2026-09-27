"""Build the downloadable five-day itinerary from the website's day data."""

import html
import json
import subprocess
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import HRFlowable, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "xiamen-itinerary-2026.pdf"


def load_days():
    js = (
        "const fs=require('fs'),vm=require('vm');"
        "const source=fs.readFileSync('app.js','utf8');"
        "const prefix=source.slice(0,source.indexOf('const foods ='));"
        "const box={};vm.runInNewContext(prefix+'\\nthis.exportedDays=days;',box);"
        "process.stdout.write(JSON.stringify(box.exportedDays));"
    )
    result = subprocess.run(["node", "-e", js], cwd=ROOT, check=True, capture_output=True, text=True, encoding="utf-8")
    return json.loads(result.stdout)


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("SimHei", 8)
    canvas.setFillColor(colors.HexColor("#60747A"))
    canvas.drawString(42, 28, "2026 国庆厦门五日游 · 行程速览")
    canvas.drawRightString(A4[0] - 42, 28, str(doc.page))
    canvas.restoreState()


def build():
    pdfmetrics.registerFont(TTFont("SimHei", "C:/Windows/Fonts/simhei.ttf"))
    ink, teal, muted, line = [colors.HexColor(value) for value in ("#173C48", "#1E777D", "#536C71", "#D8E8E5")]
    styles = {
        "eyebrow": ParagraphStyle("eyebrow", fontName="SimHei", fontSize=9, leading=14, textColor=teal),
        "title": ParagraphStyle("title", fontName="SimHei", fontSize=22, leading=29, textColor=ink, spaceAfter=9),
        "summary": ParagraphStyle("summary", fontName="SimHei", fontSize=10, leading=17, textColor=muted, spaceAfter=12),
        "section": ParagraphStyle("section", fontName="SimHei", fontSize=12, leading=19, textColor=ink, spaceBefore=10, spaceAfter=7),
        "time": ParagraphStyle("time", fontName="SimHei", fontSize=9, leading=15, textColor=teal),
        "stop": ParagraphStyle("stop", fontName="SimHei", fontSize=10, leading=16, textColor=ink),
        "detail": ParagraphStyle("detail", fontName="SimHei", fontSize=8.7, leading=14, textColor=muted),
        "note": ParagraphStyle("note", fontName="SimHei", fontSize=9, leading=16, textColor=muted),
    }
    doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, leftMargin=42, rightMargin=42, topMargin=42, bottomMargin=45, title="2026 国庆厦门五日游行程", author="厦门五日游路线网站")
    story = []
    for index, day in enumerate(load_days()):
        if index:
            story.append(PageBreak())
        story.extend([
            Paragraph(f"2026 · {html.escape(day['date'])} {html.escape(day['weekday'])} / 第 {index + 1} 天", styles["eyebrow"]),
            Spacer(1, 6), Paragraph(html.escape(day["title"]), styles["title"]),
            Paragraph(html.escape(day["summary"]), styles["summary"]),
            HRFlowable(width="100%", thickness=1, color=line),
            Paragraph("当天时间线", styles["section"]),
        ])
        rows = []
        for time, title, detail in day["schedule"]:
            rows.append([
                Paragraph(html.escape(time), styles["time"]),
                [Paragraph(html.escape(title), styles["stop"]), Paragraph(html.escape(detail), styles["detail"])],
            ])
        table = Table(rows, colWidths=[80, doc.width - 80], hAlign="LEFT")
        table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LINEBELOW", (0, 0), (-1, -2), .5, line),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("LEFTPADDING", (0, 0), (0, -1), 0),
            ("RIGHTPADDING", (-1, 0), (-1, -1), 0),
        ]))
        story.append(table)
        story.extend([Paragraph("当天提醒", styles["section"]), Paragraph(html.escape(day["note"]), styles["note"])])
        if day.get("transport", {}).get("kind") == "rail":
            story.extend([
                Paragraph("关键交通", styles["section"]),
                Paragraph(html.escape(day["transport"]["title"] + " · " + day["transport"]["detail"]), styles["note"]),
            ])
        if day.get("rainSchedule"):
            story.append(Paragraph("雨天备选 · 屿见闽南", styles["section"]))
            for time, title, detail in day["rainSchedule"]:
                story.append(Paragraph(f"<font color='#1E777D'>{html.escape(time)}</font>　{html.escape(title)} · {html.escape(detail)}", styles["note"]))
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(OUTPUT)


if __name__ == "__main__":
    subprocess.run([sys.executable, str(Path(__file__).with_name("build-site-pdf.py"))], check=True)
