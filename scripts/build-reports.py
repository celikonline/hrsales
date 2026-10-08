"""Generate original SenseIK guides from shared/content.js. Needs reportlab.
Research copies of third-party reports are never embedded in these publications.
"""
import json, os, subprocess, re
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT=Path(__file__).resolve().parent.parent
node=os.environ.get('NODE_BINARY','node')
reports=json.loads(subprocess.check_output([node,'--input-type=module','-e',"import {reports} from './shared/content.js'; process.stdout.write(JSON.stringify(reports));"],cwd=ROOT).decode('utf-8'))
fonts=[(Path('C:/Windows/Fonts/segoeui.ttf'),Path('C:/Windows/Fonts/segoeuib.ttf')),(Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'),Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))]
normal,bold=next((a,b) for a,b in fonts if a.exists() and b.exists())
pdfmetrics.registerFont(TTFont('Sense',str(normal)))
pdfmetrics.registerFont(TTFont('SenseBold',str(bold)))
W,H=A4;purple=colors.HexColor('#362dae');teal=colors.HexColor('#08b9b1');ink=colors.HexColor('#202348');muted=colors.HexColor('#525b73')
out=ROOT/'public'/'rehberler';out.mkdir(parents=True,exist_ok=True)
P=ParagraphStyle('body',fontName='Sense',fontSize=11,leading=17,textColor=ink,spaceAfter=10)
B=ParagraphStyle('heading',fontName='SenseBold',fontSize=25,leading=32,textColor=ink)
def para(c,text,x,y,width,style=P):
    p=Paragraph(escape(text),style);_,height=p.wrap(width,H);p.drawOn(c,x,y-height);return y-height-14
def frame(c,title,page):
    c.setFillColor(purple);c.rect(0,H-7,W,7,fill=1,stroke=0)
    c.setFont('SenseBold',15);c.drawString(44,H-42,'senseik')
    c.setFont('Sense',9);c.setFillColor(muted);c.drawRightString(W-44,H-40,'SENSEIK UYGULAMA REHBERİ · 2026')
    c.setStrokeColor(colors.HexColor('#e8eaf1'));c.line(44,43,W-44,43)
    c.setFont('Sense',8);c.drawString(44,28,'AlgoSense · İnsana zaman ayırın.')
    c.drawRightString(W-44,28,f'{page} / 6')
    return H-85
for r in reports:
    dest=out/f"senseik-{r['id']}.pdf"
    c=canvas.Canvas(str(dest),pagesize=A4,invariant=1)
    c.setTitle(r['title']);c.setAuthor('SenseIK · AlgoSense');c.setSubject(r['subtitle'])
    color={'purple':'#362dae','teal':'#037f7e','navy':'#21274b'}[r['color']]
    c.setFillColor(colors.HexColor(color));c.rect(0,0,W,H,fill=1,stroke=0)
    c.setStrokeColor(colors.HexColor('#ffffff'));c.setStrokeAlpha(.12)
    for rad in [160,205,250,295]:c.circle(W-25,180,rad,stroke=1,fill=0)
    c.setStrokeAlpha(1);c.setFillColor(colors.white);c.setFont('SenseBold',28);c.drawString(48,H-72,'senseik')
    c.setFont('Sense',11);c.drawRightString(W-48,H-66,'ALGOSENSE')
    c.setFillColor(colors.HexColor('#82edd9'));c.setFont('SenseBold',11);c.drawString(48,H-238,r['tag'])
    white=ParagraphStyle('cover',fontName='SenseBold',fontSize=40,leading=48,textColor=colors.white)
    y=para(c,r['title'],48,H-270,W-110,white)
    desc=ParagraphStyle('cover_desc',fontName='Sense',fontSize=17,leading=25,textColor=colors.HexColor('#ebe8ff'))
    para(c,r['subtitle'],48,y-13,W-110,desc)
    c.setFillColor(colors.white);c.setFont('Sense',12);c.drawString(48,96,'Özgün uygulama planı + ekip çalışma sayfası')
    c.setFont('SenseBold',23);c.drawString(48,55,'2026')
    c.setFont('Sense',10);c.drawRightString(W-48,55,'İnsana zaman ayırın.')
    c.showPage()
    for i,ch in enumerate(r['chapters'],2):
        y=frame(c,r['title'],i);y=para(c,ch['title'],44,y,W-88,B);y=para(c,ch['intro'],44,y-5,W-88)
        for idx,p in enumerate(ch['points'],1):
            c.setFillColor(teal);c.roundRect(44,y-20,23,23,7,fill=1,stroke=0);c.setFillColor(colors.white);c.setFont('SenseBold',10);c.drawCentredString(55.5,y-12,str(idx))
            y=para(c,p,80,y,W-124)-4
        ex=Paragraph(escape(ch['exercise']),ParagraphStyle('ex',parent=P,fontSize=11,leading=17))
        _,ph=ex.wrap(W-116,H);boxh=ph+30
        c.setFillColor(colors.HexColor('#eef8f6'));c.roundRect(44,y-boxh-10,W-88,boxh,8,fill=1,stroke=0);ex.drawOn(c,58,y-ph-24)
        if y-boxh-10<60:raise RuntimeError(f"Page overflow: {r['id']} {i}")
        c.showPage()
    y=frame(c,r['title'],5);y=para(c,'Ekibinizin çalışma sayfası',44,y,W-88,B)
    y=para(c,'Bu sayfayı ekip toplantınızda doldurun. Her madde için bir karar, sorumlu ve kontrol tarihi belirleyin. Kişisel veya hassas verileri bu çalışma sayfasına yazmayın.',44,y,W-88)
    for idx,w in enumerate(r['worksheet'],1):
        c.setFillColor(ink);c.setFont('SenseBold',11);c.drawString(44,y,f'{idx:02d}  {w}')
        c.setStrokeColor(colors.HexColor('#d8dbe7'));c.line(44,y-29,W-44,y-29)
        c.setFont('Sense',8);c.setFillColor(muted);c.drawString(44,y-44,'Sorumlu:');c.drawString(270,y-44,'Kontrol tarihi:');y-=78
    c.showPage()
    y=frame(c,r['title'],6);y=para(c,'Bir sonraki adımınızı seçin.',44,y,W-88,B)
    for t in ['1 · Küçük bir pilot seçin','2 · Başlangıç durumunu ölçün','3 · Sorumlulukları netleştirin','4 · Bir ay sonra değerlendirin']:
        y=para(c,t,44,y,W-88,ParagraphStyle('step',fontName='SenseBold',fontSize=16,leading=22,textColor=purple))
    y=para(c,'Bu rehber, SenseIK içerik ekibi için hazırlanmış özgün bir uygulama metnidir. Araştırma verisi veya müşteri başarı iddiası içermez. Önerileri kurumunuzun iş yapısına göre uyarlayın; hukuki veya vergi kararlarını ilgili uzmanınızla değerlendirin.',44,y-10,W-88)
    if r['sources']:
        y=para(c,'İlgili birincil kaynaklar',44,y,W-88,ParagraphStyle('source_title',fontName='SenseBold',fontSize=15,leading=21,textColor=ink))
        for s in r['sources']:
            y=para(c,s['name'],44,y,W-88)
            y=para(c,s['url'],44,y+8,W-88,ParagraphStyle('url',fontName='Sense',fontSize=8,leading=12,textColor=purple))
    y=para(c,'SenseHR ile uygulamaya geçin',44,y-10,W-88,ParagraphStyle('cta',fontName='SenseBold',fontSize=19,leading=25,textColor=purple))
    y=para(c,'Çalışan sayınızı ve ihtiyaç duyduğunuz modülleri paylaşın. Yönetici onayı sonrası süreli demo alanınızı keşfedin; lisans kapsamınızı birlikte planlayın.',44,y,W-88)
    c.setFillColor(teal);c.roundRect(44,y-42,W-88,42,8,fill=1,stroke=0);c.setFont('SenseBold',13);c.setFillColor(colors.white);c.drawString(60,y-27,'SenseIK · Demo talep edin')
    c.save()
print(f'{len(reports)} original PDF guides generated, 6 pages each.')
