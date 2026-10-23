"""SIYANO product pages and shared product contact entry points."""
from pathlib import Path
from html import escape
import json
import re
from build_erp import COPY as ERP_COPY, LOGO

DIST = Path(__file__).resolve().parents[1] / 'dist'
ORIGIN = 'https://brainfor.net'
HOME = {'fr':'/', 'en':'/en/', 'ar':'/ar/'}
PATHS = {lang: home + 'siyano/' for lang,home in HOME.items()}
COPY = {
 'fr': {
  'title':'SIYANO — GMAO et maintenance industrielle | Brainfor',
  'desc':'SIYANO, logiciel de maintenance industrielle édité par Brainfor : équipements, interventions, préventif, stocks et coûts. Installation cloud ou serveur client, offre sur devis.',
  'tag':'GMAO · MAINTENANCE INDUSTRIELLE', 'heading':'Vos équipements.\nVotre maintenance, maîtrisée.',
  'intro':'Du signalement d’une panne au suivi de son coût, SIYANO réunit les équipes, les équipements et les interventions dans un même logiciel.',
  'demo':'Demander une démonstration', 'more':'Découvrir SIYANO', 'modules':'Les fonctions essentielles, au même endroit.',
  'cards':[
   ['Équipements & historique','Structurez votre parc, vos sites et vos emplacements. Retrouvez les dossiers techniques, documents et interventions par équipement.'],
   ['Demandes & interventions','Qualifiez les demandes, créez les bons de travail, affectez les intervenants et suivez les checklists, temps et pièces.'],
   ['Maintenance préventive','Planifiez des interventions calendaires ou sur compteur, avec des gammes réutilisables et un suivi des échéances.'],
   ['Planning & équipes','Organisez les affectations et repérez les chevauchements et les absences avant intervention.'],
   ['Stocks & approvisionnements','Suivez les pièces, magasins, réservations, transferts, besoins d’achat et réceptions partielles.'],
   ['Coûts & rapports','Rassemblez temps, pièces et prestations. Consultez les historiques, rapports PDF et exports CSV ou Excel.']],
  'deploy':'Cloud ou serveur dans votre entreprise.',
  'deploy_text':'Le même logiciel peut être installé sur un hébergement cloud ou sur un serveur chez le client. L’accès se fait depuis le navigateur ; une connexion au serveur est nécessaire pour enregistrer les opérations.',
  'offer':'Une offre adaptée à votre parc.', 'quote':'Licence et déploiement sur devis',
  'offer_text':'Nous définissons ensemble les utilisateurs, les sites, les modules, l’installation et l’accompagnement. SIYANO prend en charge les licences signées vérifiables hors ligne. Les conditions de licence et de maintenance sont précisées dans votre offre.',
  'note':'L’offre porte sur la V1 disponible. Le mobile déconnecté, les intégrations en écriture et certaines fonctions industrielles avancées restent à développer. Le périmètre est confirmé pendant la démonstration.',
  'brief':'Je souhaite une démonstration et une proposition commerciale pour SIYANO.\nEntreprise : \nNombre de sites et d’utilisateurs : \nParc d’équipements : \nCloud ou serveur local : ',
  'home_desc':'Notre GMAO pour organiser les équipements, le préventif, les interventions, les pièces et leurs coûts.',
  'cloud':'Cloud ou serveur client', 'langs':'Interface française et arabe', 'products':'NOS LOGICIELS · ÉDITÉS PAR BRAINFOR',
 },
 'en': {
  'title':'SIYANO — Industrial maintenance software | Brainfor',
  'desc':'SIYANO by Brainfor: equipment, work orders, preventive maintenance, inventory and costs. Cloud or customer-server deployment, with a tailored quotation.',
  'tag':'CMMS · INDUSTRIAL MAINTENANCE', 'heading':'Your equipment.\nMaintenance under control.',
  'intro':'From reporting a breakdown to tracking its cost, SIYANO brings teams, equipment and maintenance work together in one application.',
  'demo':'Request a demonstration', 'more':'Discover SIYANO', 'modules':'Essential functions, all in one place.',
  'cards':[
   ['Equipment & history','Organise equipment, sites and locations. Find technical records, documents and maintenance history for each asset.'],
   ['Requests & work orders','Review requests, create work orders, assign technicians and track checklists, time and parts.'],
   ['Preventive maintenance','Schedule calendar-based or meter-based maintenance with reusable procedures and due-date tracking.'],
   ['Planning & teams','Organise assignments and identify overlapping schedules and absences before work begins.'],
   ['Inventory & procurement','Track parts, stores, reservations, transfers, purchase requests and partial receipts.'],
   ['Costs & reports','Bring together labour, parts and services. Access history, PDF reports and CSV or Excel exports.']],
  'deploy':'Cloud or a server at your company.',
  'deploy_text':'The same software can run on cloud hosting or a customer server. Users connect through a browser; a connection to the server is required to save operations.',
  'offer':'An offer tailored to your equipment fleet.', 'quote':'Licensing and deployment by quotation',
  'offer_text':'We define users, sites, modules, installation and support together. SIYANO supports signed licences that can be verified offline. Licence and maintenance terms are detailed in your offer.',
  'note':'The offer covers the available V1. Offline mobile use, write integrations and some advanced industrial functions remain in development. Scope is confirmed during the demonstration.',
  'brief':'I would like a SIYANO demonstration and commercial proposal.\nCompany: \nNumber of sites and users: \nEquipment fleet: \nCloud or local server: ',
  'home_desc':'Our CMMS for organising equipment, preventive maintenance, work orders, parts and costs.',
  'cloud':'Cloud or customer server', 'langs':'French and Arabic interface', 'products':'OUR SOFTWARE · PUBLISHED BY BRAINFOR',
 },
 'ar': {
  'title':'SIYANO — برنامج إدارة الصيانة الصناعية | Brainfor',
  'desc':'SIYANO من Brainfor لإدارة المعدات والتدخلات والصيانة الوقائية والمخزون والتكاليف. تثبيت سحابي أو على خادم العميل، بعرض سعر مخصص.',
  'tag':'إدارة الصيانة · الصيانة الصناعية', 'heading':'معداتك.\nصيانة تحت السيطرة.',
  'intro':'من الإبلاغ عن العطل إلى متابعة تكلفته، يجمع SIYANO الفرق والمعدات والتدخلات في برنامج واحد.',
  'demo':'طلب عرض توضيحي', 'more':'اكتشف SIYANO', 'modules':'الوظائف الأساسية في مكان واحد.',
  'cards':[
   ['المعدات والسجل','نظّم معداتك ومواقعك وأماكنها، واطّلع على الملفات التقنية والوثائق وسجل التدخلات لكل معدة.'],
   ['الطلبات وأوامر العمل','راجع الطلبات وأنشئ أوامر العمل وعيّن المتدخلين وتابع قوائم التحقق والأوقات وقطع الغيار.'],
   ['الصيانة الوقائية','برمج الصيانة حسب التقويم أو العداد مع إجراءات قابلة لإعادة الاستخدام ومتابعة الاستحقاقات.'],
   ['التخطيط والفرق','نظّم التعيينات وحدّد تداخلات المواعيد والغيابات قبل التدخل.'],
   ['المخزون والتموين','تابع القطع والمخازن والحجوزات والتحويلات واحتياجات الشراء والاستلام الجزئي.'],
   ['التكاليف والتقارير','اجمع تكاليف الوقت والقطع والخدمات، واطّلع على السجل وتقارير PDF وتصدير CSV أو Excel.']],
  'deploy':'في السحابة أو على خادم مؤسستك.',
  'deploy_text':'يمكن تثبيت البرنامج نفسه على استضافة سحابية أو على خادم لدى العميل. يتم الوصول عبر المتصفح، ويلزم الاتصال بالخادم لحفظ العمليات.',
  'offer':'عرض يناسب حظيرة معداتك.', 'quote':'الترخيص والتثبيت حسب عرض سعر',
  'offer_text':'نحدّد معك المستخدمين والمواقع والوحدات والتثبيت والمرافقة. يدعم SIYANO تراخيص موقّعة يمكن التحقق منها دون اتصال. تُوضّح شروط الترخيص والصيانة في العرض المقدم لك.',
  'note':'يشمل العرض الإصدار الأول المتاح. لا يزال العمل على الهاتف دون اتصال والتكاملات التي تكتب البيانات وبعض الوظائف الصناعية المتقدمة قيد التطوير. يُحدّد النطاق خلال العرض التوضيحي.',
  'brief':'أرغب في عرض توضيحي واقتراح تجاري لبرنامج SIYANO.\nالمؤسسة: \nعدد المواقع والمستخدمين: \nحظيرة المعدات: \nسحابة أو خادم محلي: ',
  'home_desc':'برنامجنا لإدارة المعدات والصيانة الوقائية والتدخلات وقطع الغيار وتكاليفها.',
  'cloud':'سحابة أو خادم العميل', 'langs':'واجهة بالفرنسية والعربية', 'products':'برمجياتنا · من تطوير BRAINFOR',
 },
}

def build():
 for lang,c in COPY.items():
  e=lambda key: escape(c[key])
  home,path=HOME[lang],PATHS[lang]
  demo=home+'?product=siyano#contact'
  old=ERP_COPY[lang]
  nav='<nav class="language-switch" aria-label="'+escape(old['language'])+'" dir="ltr">'+''.join('<a href="'+p+'" lang="'+l+'" hreflang="'+l+'"'+(' aria-current="page"' if l==lang else '')+'>'+{'fr':'FR','en':'EN','ar':'العربية'}[l]+'</a>' for l,p in PATHS.items())+'</nav>'
  alternate=''.join('<link rel="alternate" hreflang="'+l+'" href="'+ORIGIN+p+'">' for l,p in PATHS.items())+'<link rel="alternate" hreflang="x-default" href="'+ORIGIN+'/siyano/">'
  graph={'@context':'https://schema.org','@type':'SoftwareApplication','name':'SIYANO','applicationCategory':'BusinessApplication','operatingSystem':'Web','url':ORIGIN+path,'description':c['desc'],'softwareVersion':'1.0.1','publisher':{'@type':'Organization','name':'Brainfor','url':ORIGIN+'/'}}
  cards=''.join('<article><h3>'+escape(title)+'</h3><p>'+escape(text)+'</p></article>' for title,text in c['cards'])
  html=f'''<!doctype html><html lang="{lang}" dir="{'rtl' if lang=='ar' else 'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e('title')}</title><meta name="description" content="{e('desc')}"><meta name="robots" content="index,follow"><link rel="canonical" href="{ORIGIN}{path}">{alternate}<meta property="og:type" content="website"><meta property="og:site_name" content="Brainfor"><meta property="og:title" content="{e('title')}"><meta property="og:description" content="{e('desc')}"><meta property="og:url" content="{ORIGIN}{path}"><meta property="og:image" content="{ORIGIN}/assets/siyano-logo.png"><meta property="og:image:alt" content="SIYANO by Brainfor"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="{ORIGIN}/assets/siyano-logo.png"><link rel="icon" href="/assets/siyano-icon.png"><link rel="stylesheet" href="/style.css?v=languages-1"><link rel="stylesheet" href="/languages.css?v=numbers-2"><link rel="stylesheet" href="/erp.css?v=products-5"><script type="application/ld+json">{json.dumps(graph,ensure_ascii=False)}</script></head><body class="erp-page siyano-page"><header class="header"><div class="container erp-nav-wrap"><a class="brand" href="{home}">{LOGO}<span>Brainfor<span class="brand-sub">{escape(old['footer'])}</span></span></a><nav class="erp-page-nav" aria-label="SIYANO"><a href="{home}">{escape(old['home'])}</a><a href="{home}erp/">DAZO</a><a href="#offer">{e('quote')}</a></nav>{nav}</div></header><main><section class="hero erp-hero container"><div class="hero-copy"><p class="eyebrow">SIYANO · {e('tag')}</p><h1>{e('heading').replace(chr(10),'<br>')}</h1><p class="hero-description">{e('intro')}</p><div class="hero-actions"><a class="button primary" href="{demo}">{e('demo')} ↗</a><a class="text-link" href="#offer">{e('quote')} ↓</a></div></div><aside class="identity-visual brainfor-visual erp-identity siyano-identity"><div class="identity-top"><span>SIYANO</span><span>GMAO</span></div><div class="identity-logo"><img class="siyano-symbol" src="/assets/siyano-symbol.png" width="1254" height="1254" alt="SIYANO"></div><div class="brainfor-principles"><span>{e('cloud')}</span></div></aside></section><section class="section container" id="modules"><p class="eyebrow">01 / SIYANO</p><h2>{e('modules')}</h2><div class="erp-module-grid">{cards}</div></section><section class="erp-modes"><div class="section container"><h2>{e('deploy')}</h2><p class="erp-section-intro">{e('deploy_text')}</p><p class="eyebrow">{e('langs')}</p></div></section><section id="offer" class="section container"><h2>{e('offer')}</h2><h3>{e('quote')}</h3><p class="erp-section-intro">{e('offer_text')}</p><a class="button primary" href="{demo}">{e('demo')} ↗</a></section><section class="erp-cta"><div class="container"><p class="eyebrow">SIYANO · 1.0.1</p><h2>{e('demo')}</h2><p>{e('note')}</p><a class="button secondary" href="{demo}">{e('demo')} ↗</a></div></section></main><footer class="container erp-footer"><a class="brand" href="{home}">{LOGO}<span>Brainfor</span></a><a href="{home}">{escape(old['back'])} ↗</a></footer></body></html>'''
  dest=DIST/path.strip('/')/'index.html';dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(html,encoding='utf-8')
  index=DIST/home.strip('/')/'index.html';page=index.read_text(encoding='utf-8')
  page=re.sub(r'\s*<!-- siyano-feature -->.*?<!-- /siyano-feature -->','',page,flags=re.S)
  page=re.sub(r'<!-- siyano-nav -->.*?<!-- /siyano-nav -->','',page,flags=re.S)
  section=f'''<!-- siyano-feature --><section class="siyano-spotlight"><div class="container erp-spotlight-grid"><div><p class="eyebrow">{e('products')}</p><h2>SIYANO</h2><p class="erp-section-intro">{e('home_desc')}</p><div class="erp-spotlight-actions"><a class="button primary" href="{path}">{e('more')} ↗</a><a class="text-link" href="{demo}">{e('demo')} ↗</a></div><p class="siyano-offer">{e('quote')}</p></div><a class="siyano-logo-panel" href="{path}" aria-label="SIYANO"><img src="/assets/siyano-logo.png" width="2172" height="724" loading="lazy" alt="SIYANO by Brainfor"><span>{e('cloud')}</span></a></div></section><!-- /siyano-feature -->'''
  page=page.replace('<div class="expertise-strip">',section+'<div class="expertise-strip">',1)
  page=page.replace('<!-- /erp-nav -->','<!-- /erp-nav --><!-- siyano-nav --><a class="erp-nav-link" href="'+path+'">SIYANO</a><!-- /siyano-nav -->',1)
  page=re.sub(r'/erp.css\?v=[\w-]+','/erp.css?v=products-5',page)
  page=page.replace('/erp.css?v=3','/erp.css?v=products-5').replace('/erp-contact.js?v=2','/erp-contact.js?v=products-3')
  index.write_text(page,encoding='utf-8')
 xml=(DIST/'sitemap.xml').read_text(encoding='utf-8')
 links=''.join('<xhtml:link rel="alternate" hreflang="'+l+'" href="'+ORIGIN+p+'"/>' for l,p in PATHS.items())+'<xhtml:link rel="alternate" hreflang="x-default" href="'+ORIGIN+'/siyano/"/>'
 for path in PATHS.values(): xml=xml.replace('</urlset>','<url><loc>'+ORIGIN+path+'</loc>'+links+'</url>\n</urlset>')
 (DIST/'sitemap.xml').write_text(xml,encoding='utf-8')
 briefs={'dazo':{l:c['brief'] for l,c in ERP_COPY.items()},'siyano':{l:c['brief'] for l,c in COPY.items()}}
 (DIST/'erp-contact.js').write_text('''(() => {
 const product = new URLSearchParams(location.search).get('product');
 const messages = '''+json.dumps(briefs,ensure_ascii=False)+''';
 const brief = messages[product === 'brainfor-erp' ? 'dazo' : product];
 const field = document.querySelector('#project-form textarea[name="message"]');
 if (brief && field && !field.value.trim()) {
  field.value = brief[document.documentElement.lang] || brief.fr;
  field.dispatchEvent(new Event('input', { bubbles: true }));
 }
})();
''',encoding='utf-8')
