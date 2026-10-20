"""Generate public ERP presentation pages; never package the ERP or private data."""
from pathlib import Path
from html import escape
import json
import re

DIST = Path(__file__).resolve().parents[1] / 'dist'
ORIGIN = 'https://brainfor.net'
PATHS = {'fr': '/erp/', 'en': '/en/erp/', 'ar': '/ar/erp/'}
HOME = {'fr': '/', 'en': '/en/', 'ar': '/ar/'}
COPY = {
    'fr': {
        'back': 'Retour à Brainfor', 'language': 'Choisir la langue',
        'title': 'Brainfor ERP — Gestion d’entreprise, même hors ligne',
        'description': 'Découvrez Brainfor ERP : ventes, achats, stocks, comptabilité et gestion d’entreprise. Version Windows hors ligne et démonstration accompagnée sur demande.',
        'tag': 'LOGICIEL DE GESTION · VERSION 0.5',
        'headline': 'Votre entreprise.\nUne vision d’ensemble.',
        'intro': 'Des ventes aux stocks, des achats au suivi financier : réunissez vos opérations dans un même outil, avec une édition Windows qui fonctionne sans Internet.',
        'demo': 'Demander une démonstration', 'explore': 'Découvrir les modules',
        'status': 'Pilote accompagné · Démonstration sur demande',
        'modules_title': 'Un socle commun pour votre activité.',
        'modules': [
            ['Ventes & achats', 'Clients, fournisseurs, commandes, livraisons, réceptions, factures, avoirs et règlements.'],
            ['Articles & stocks', 'Catalogue, dépôts, mouvements de stock et suivi des quantités.'],
            ['Finance & comptabilité', 'Caisse, écritures en partie double, suivi des règlements et exports.'],
            ['Votre organisation', 'CRM, ressources humaines, paie paramétrable, projets et fabrication selon vos besoins.'],
            ['Documents & échanges', 'Documents PDF, imports Excel avec aperçu et exports de données.'],
            ['Accès & traçabilité', 'Rôles, permissions, double authentification et journal des opérations.'],
        ],
        'modes_title': 'Une installation adaptée à votre façon de travailler.',
        'modes': [
            ['Windows, même hors ligne', 'Une application autonome avec sa base locale. Sauvegardes chiffrées, restauration et activation hors ligne sont prévues.'],
            ['Serveur partagé', 'Une édition serveur pour travailler depuis le navigateur sur votre réseau ou sur un hébergement dédié. Le SaaS public n’est pas encore ouvert.'],
            ['Plusieurs postes', 'Association à un serveur de référence sur le réseau local ou Internet. En version 0.5, les conflits demandent un rapprochement manuel et les instantanés sont limités à 24 Mio.'],
        ],
        'licence_title': 'Une licence qui suit votre projet.',
        'licence': 'Licence permanente locale ou abonnement mensuel / annuel : nous définissons ensemble les utilisateurs, les modules et l’accompagnement. La licence permanente inclut douze mois de maintenance ; son expiration laisse utilisable la version acquise.',
        'languages': 'Interface disponible en français, anglais et arabe.',
        'note': 'La version 0.5 est proposée pour un pilote accompagné. Les paramètres fiscaux, comptables et de paie doivent être validés pour votre entreprise. La démonstration permet de vérifier l’adéquation du logiciel à vos usages.',
        'cta_title': 'Voyons votre activité de plus près.',
        'cta': 'Présentez votre entreprise, le nombre de postes et les fonctions recherchées. Nous vous recontactons pour organiser une démonstration.',
        'teaser': 'Ventes, achats, stocks et suivi financier dans un même logiciel. Une édition Windows utilisable hors ligne.',
        'more': 'Découvrir Brainfor ERP',
        'brief': 'Je souhaite une démonstration de Brainfor ERP pour mon entreprise.\nNombre de postes : \nModules recherchés : \nDisponibilités : ',
    },
    'en': {
        'back': 'Back to Brainfor', 'language': 'Choose language',
        'title': 'Brainfor ERP — Business management, even offline',
        'description': 'Discover Brainfor ERP: sales, purchasing, inventory, accounting and business management. Offline Windows edition and guided demonstrations on request.',
        'tag': 'BUSINESS SOFTWARE · VERSION 0.5',
        'headline': 'Your business.\nThe whole picture.',
        'intro': 'From sales and inventory to purchasing and financial tracking: bring your operations together, with a Windows edition that works without Internet access.',
        'demo': 'Request a demonstration', 'explore': 'Explore the modules',
        'status': 'Guided pilot · Demonstrations on request',
        'modules_title': 'A shared foundation for your operations.',
        'modules': [
            ['Sales & purchasing', 'Customers, suppliers, orders, deliveries, receipts, invoices, credit notes and payments.'],
            ['Products & inventory', 'Product catalogue, warehouses, stock movements and quantity tracking.'],
            ['Finance & accounting', 'Cash management, double-entry bookkeeping, payment tracking and exports.'],
            ['Your organisation', 'CRM, human resources, configurable payroll, projects and manufacturing to suit your needs.'],
            ['Documents & data', 'PDF documents, Excel imports with previews and data exports.'],
            ['Access & traceability', 'Roles, permissions, two-factor authentication and an operations audit trail.'],
        ],
        'modes_title': 'An installation that fits the way you work.',
        'modes': [
            ['Windows, even offline', 'A standalone application with a local database, encrypted backups, restoration and offline activation.'],
            ['Shared server', 'A server edition for browser access on your network or dedicated hosting. The public SaaS service is not yet available.'],
            ['Multiple workstations', 'Connect to a reference server on your local network or over the Internet. In version 0.5, conflicts require manual reconciliation and snapshots are limited to 24 MiB.'],
        ],
        'licence_title': 'A licence that fits your project.',
        'licence': 'A local perpetual licence or a monthly / annual subscription: we define users, modules and support together. Perpetual licences include twelve months of maintenance; the acquired version remains usable after maintenance expires.',
        'languages': 'Interface available in French, English and Arabic.',
        'note': 'Version 0.5 is offered as a guided pilot. Tax, accounting and payroll settings need validation for your business. The demonstration helps assess whether the software fits your workflows.',
        'cta_title': 'Let’s take a closer look at your business.',
        'cta': 'Tell us about your company, the number of workstations and the features you need. We will contact you to arrange a demonstration.',
        'teaser': 'Sales, purchasing, inventory and financial tracking in one application. A Windows edition that works offline.',
        'more': 'Discover Brainfor ERP',
        'brief': 'I would like a Brainfor ERP demonstration for my company.\nNumber of workstations: \nRequired modules: \nAvailability: ',
    },
    'ar': {
        'back': 'العودة إلى Brainfor', 'language': 'اختيار اللغة',
        'title': 'Brainfor ERP — إدارة أعمالك حتى دون اتصال',
        'description': 'اكتشف Brainfor ERP لإدارة المبيعات والمشتريات والمخزون والمحاسبة. إصدار Windows يعمل دون اتصال وعرض توضيحي بمرافقة فريقنا عند الطلب.',
        'tag': 'برنامج لإدارة الأعمال · الإصدار 0.5',
        'headline': 'مؤسستك.\nرؤية شاملة لنشاطك.',
        'intro': 'من المبيعات والمخزون إلى المشتريات والمتابعة المالية: اجمع عمليات مؤسستك في أداة واحدة، مع إصدار Windows يعمل دون الحاجة إلى الإنترنت.',
        'demo': 'طلب عرض توضيحي', 'explore': 'اكتشف الوحدات',
        'status': 'تجربة ميدانية بمرافقة فريقنا · عرض توضيحي عند الطلب',
        'modules_title': 'قاعدة موحدة لإدارة نشاطك.',
        'modules': [
            ['المبيعات والمشتريات', 'العملاء والموردون والطلبات والتسليم والاستلام والفواتير والإشعارات الدائنة والتسديدات.'],
            ['المنتجات والمخزون', 'دليل المنتجات والمستودعات وحركات المخزون ومتابعة الكميات.'],
            ['المالية والمحاسبة', 'الصندوق والقيود المحاسبية المزدوجة ومتابعة التسديدات وتصدير البيانات.'],
            ['تنظيم مؤسستك', 'إدارة علاقات العملاء والموارد البشرية والأجور القابلة للضبط والمشاريع والتصنيع حسب احتياجاتك.'],
            ['الوثائق والبيانات', 'وثائق PDF واستيراد ملفات Excel مع معاينة وتصدير البيانات.'],
            ['الصلاحيات والتتبع', 'الأدوار والصلاحيات والمصادقة الثنائية وسجل العمليات.'],
        ],
        'modes_title': 'تثبيت يناسب طريقة عملك.',
        'modes': [
            ['Windows حتى دون اتصال', 'تطبيق مستقل بقاعدة بيانات محلية، مع نسخ احتياطية مشفرة واستعادة للبيانات وتفعيل دون اتصال.'],
            ['خادم مشترك', 'إصدار خادم للعمل عبر المتصفح على شبكتك أو استضافة مخصصة. الخدمة السحابية العامة غير متاحة بعد.'],
            ['عدة أجهزة', 'الربط بخادم مرجعي عبر الشبكة المحلية أو الإنترنت. في الإصدار 0.5، تتطلب التعارضات تسوية يدوية ويبلغ الحد الأقصى للقطات البيانات 24 ميبيبايت.'],
        ],
        'licence_title': 'ترخيص يناسب مشروعك.',
        'licence': 'ترخيص محلي دائم أو اشتراك شهري أو سنوي: نحدد معك المستخدمين والوحدات والمرافقة. يشمل الترخيص الدائم اثني عشر شهراً من الصيانة، ويبقى الإصدار المقتنى قابلاً للاستخدام بعد انتهائها.',
        'languages': 'الواجهة متوفرة بالعربية والفرنسية والإنجليزية.',
        'note': 'الإصدار 0.5 متاح كتجربة ميدانية بمرافقة فريقنا. يجب التحقق من إعدادات الضرائب والمحاسبة والأجور بما يناسب مؤسستك. يساعد العرض التوضيحي على تقييم ملاءمة البرنامج لطريقة عملك.',
        'cta_title': 'لنتعرف على نشاط مؤسستك.',
        'cta': 'أخبرنا عن مؤسستك وعدد الأجهزة والوظائف المطلوبة. سنتواصل معك لتنظيم عرض توضيحي.',
        'teaser': 'المبيعات والمشتريات والمخزون والمتابعة المالية في برنامج واحد. إصدار Windows يعمل دون اتصال.',
        'more': 'اكتشف Brainfor ERP',
        'brief': 'أرغب في عرض توضيحي لبرنامج Brainfor ERP لمؤسستي.\nعدد الأجهزة: \nالوحدات المطلوبة: \nالأوقات المناسبة: ',
    },
}

EXTRA = {
    'fr': {
        'offer': 'NOS SOLUTIONS · PRESTATIONS & LOGICIELS',
        'product': 'Un logiciel à nous.\nUn outil pour vous.',
        'product_intro': 'Nous développons vos projets sur mesure. Nous éditons aussi Brainfor ERP : notre solution de gestion proposée sous licence pour accompagner les entreprises au quotidien.',
        'licences': 'Voir les licences', 'perpetual': 'Licence permanente',
        'offline': 'Windows · Hors ligne', 'maintenance': '12 mois de maintenance inclus',
        'plans_title': 'Choisissez votre licence Brainfor ERP.',
        'plans_intro': 'Un achat unique pour utiliser durablement la version acquise. Les modules, l’installation et l’accompagnement sont précisés dans votre proposition.',
        'users3': '3 utilisateurs', 'users10': '10 utilisateurs', 'custom': 'Utilisateurs et modules sur mesure',
        'from': 'À partir de', 'once': 'Achat unique', 'quote': 'Parlons de votre licence',
        'maintenance_detail': 'Après les douze premiers mois, la maintenance peut être renouvelée en option. Sans renouvellement, votre version acquise continue de fonctionner. Les abonnements et l’hébergement font l’objet d’une étude sur demande ; le SaaS public n’est pas encore ouvert.',
        'footer': 'Ingénierie. Fiabilité. Innovation.', 'home': 'Accueil', 'modules_nav': 'Modules',
    },
    'en': {
        'offer': 'OUR SOLUTIONS · SERVICES & SOFTWARE',
        'product': 'Our software.\nYour everyday tool.',
        'product_intro': 'We build custom solutions for your projects. We also publish Brainfor ERP: our licensed business management software for your day-to-day operations.',
        'licences': 'Explore licences', 'perpetual': 'Perpetual licence',
        'offline': 'Windows · Offline', 'maintenance': '12 months of maintenance included',
        'plans_title': 'Choose your Brainfor ERP licence.',
        'plans_intro': 'A one-time purchase to keep using the acquired version. Modules, installation and support are detailed in your proposal.',
        'users3': '3 users', 'users10': '10 users', 'custom': 'Custom users and modules',
        'from': 'From', 'once': 'One-time purchase', 'quote': 'Discuss your licence',
        'maintenance_detail': 'After the first twelve months, maintenance can be renewed optionally. Without renewal, your acquired version keeps working. Subscriptions and hosting are assessed on request; the public SaaS service is not yet available.',
        'footer': 'Engineering. Reliability. Innovation.', 'home': 'Home', 'modules_nav': 'Modules',
    },
    'ar': {
        'offer': 'حلولنا · خدمات وبرمجيات',
        'product': 'برنامج من تطويرنا.\nأداة لخدمة مؤسستك.',
        'product_intro': 'نطوّر حلولاً مخصصة لمشاريعكم، ونقدّم أيضاً Brainfor ERP: برنامجنا المرخّص لإدارة العمليات اليومية للمؤسسات.',
        'licences': 'اكتشف التراخيص', 'perpetual': 'ترخيص دائم',
        'offline': 'Windows · دون اتصال', 'maintenance': 'يشمل 12 شهراً من الصيانة',
        'plans_title': 'اختر ترخيص Brainfor ERP المناسب لك.',
        'plans_intro': 'شراء لمرة واحدة لمواصلة استخدام الإصدار المقتنى. تُحدّد الوحدات والتثبيت والمرافقة في العرض المقدم لك.',
        'users3': '3 مستخدمين', 'users10': '10 مستخدمين', 'custom': 'مستخدمون ووحدات حسب احتياجاتك',
        'from': 'ابتداءً من', 'once': 'شراء لمرة واحدة', 'quote': 'لنتحدث عن ترخيصك',
        'maintenance_detail': 'بعد الاثني عشر شهراً الأولى، يمكن تجديد الصيانة اختيارياً. يواصل الإصدار المقتنى العمل دون تجديدها. تُدرس الاشتراكات والاستضافة عند الطلب؛ الخدمة السحابية العامة غير متاحة بعد.',
        'footer': 'هندسة. موثوقية. ابتكار.', 'home': 'الرئيسية', 'modules_nav': 'الوحدات',
    },
}
for language, values in EXTRA.items():
    COPY[language].update(values)

LOGO = '<span class="brand-mark" aria-hidden="true"><svg class="brainfor-symbol" viewBox="350 315 590 670"><image href="/assets/brainfor-monogram.png" width="1254" height="1254"/></svg></span>'

def build():
    for lang, c in COPY.items():
        e = lambda key: escape(c[key])
        path = PATHS[lang]
        demo = HOME[lang] + '?product=brainfor-erp#contact'
        nav = '<nav class="language-switch" aria-label="' + e('language') + '" dir="ltr">' + ''.join(
            '<a lang="' + code + '" hreflang="' + code + '" href="' + target + '"' + (' aria-current="page"' if code == lang else '') + '>' + {'fr': 'FR', 'en': 'EN', 'ar': 'العربية'}[code] + '</a>' for code, target in PATHS.items()) + '</nav>'
        alternates = ''.join('<link rel="alternate" hreflang="' + code + '" href="' + ORIGIN + target + '">' for code, target in PATHS.items()) + '<link rel="alternate" hreflang="x-default" href="' + ORIGIN + '/erp/">'
        cards = lambda key: ''.join('<article><h3>' + escape(title) + '</h3><p>' + escape(body) + '</p></article>' for title, body in c[key])
        graph = {'@context': 'https://schema.org', '@type': 'WebPage', 'name': c['title'], 'description': c['description'], 'url': ORIGIN + path, 'inLanguage': lang, 'about': {'@type': 'SoftwareApplication', 'name': 'Brainfor ERP', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'Windows, Web', 'softwareVersion': '0.5'}}
        image = '/assets/brainfor-social-' + lang + '-v1.png' if lang != 'fr' else '/assets/brainfor-social-v1.png'
        plans = ''.join('<article class="erp-plan' + (' featured' if name == 'Business' else '') + '"><p class="eyebrow">' + name + '</p><p class="erp-price">' + ('<small>' + e('from') + '</small>' if name == 'Enterprise' else '') + '<bdi>' + price + ' <span>' + ('دج' if lang == 'ar' else 'DA') + '</span></bdi></p><p class="erp-once">' + e('once') + '</p><p>' + e(users) + '</p><p class="erp-included">' + e('maintenance') + '</p><a class="button secondary" href="' + demo + '">' + e('quote') + ' ↗</a></article>' for name,price,users in [('Starter','29 900','users3'),('Business','69 900','users10'),('Enterprise','149 000','custom')])
        html = f'''<!doctype html>
<html lang="{lang}" dir="{'rtl' if lang == 'ar' else 'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e('title')}</title><meta name="description" content="{e('description')}"><meta name="robots" content="index,follow"><link rel="canonical" href="{ORIGIN}{path}">{alternates}
<meta property="og:type" content="website"><meta property="og:site_name" content="Brainfor"><meta property="og:title" content="{e('title')}"><meta property="og:description" content="{e('description')}"><meta property="og:url" content="{ORIGIN}{path}"><meta property="og:locale" content="{dict(fr='fr_DZ',en='en_GB',ar='ar_DZ')[lang]}"><meta property="og:image" content="{ORIGIN}{image}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Brainfor — Ingénierie. Fiabilité. Innovation."><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{e('title')}"><meta name="twitter:description" content="{e('description')}"><meta name="twitter:image" content="{ORIGIN}{image}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#132d49"><link rel="stylesheet" href="/style.css?v=languages-1"><link rel="stylesheet" href="/languages.css?v=languages-1"><link rel="stylesheet" href="/erp.css?v=2"><script type="application/ld+json">{json.dumps(graph,ensure_ascii=False).replace('<',chr(92)+'u003c')}</script></head>
<body class="erp-page"><header class="header"><div class="container erp-nav-wrap"><a class="brand" href="{HOME[lang]}">{LOGO}<span>Brainfor<span class="brand-sub">{e('footer')}</span></span></a><nav class="erp-page-nav" aria-label="Brainfor ERP"><a href="{HOME[lang]}">{e('home')}</a><a href="#modules">{e('modules_nav')}</a><a href="#licences">{e('licences')}</a></nav>{nav}</div></header>
<main><section class="hero erp-hero container"><div class="hero-copy"><p class="eyebrow"><span class="status-dot"></span> {e('tag')}</p><h1>{e('headline').replace(chr(10),'<br>')}</h1><p class="hero-description">{e('intro')}</p><div class="hero-actions"><a class="button primary" href="{demo}">{e('demo')} ↗</a><a class="text-link" href="#licences">{e('licences')} ↓</a></div><p class="erp-status">{e('status')}</p></div><aside class="identity-visual brainfor-visual erp-identity"><div class="identity-top"><span>BRAINFOR ERP</span><span>WINDOWS & WEB</span></div><div class="identity-logo"><svg class="brainfor-symbol" viewBox="350 315 590 670" aria-hidden="true"><image href="/assets/brainfor-monogram.png" width="1254" height="1254"/></svg></div><div class="brainfor-principles"><span>{e('perpetual')}</span><i></i><span>{e('offline')}</span></div></aside></section>
<div class="erp-benefit-strip"><div class="container"><span>{e('perpetual')}</span><span>{e('maintenance')}</span><span>{e('languages')}</span></div></div>
<section id="modules" class="section container"><div class="section-heading"><div><p class="eyebrow">01 / ERP</p><h2>{e('modules_title')}</h2></div></div><div class="erp-module-grid">{cards('modules')}</div></section>
<section class="erp-modes"><div class="section container"><p class="eyebrow">02 / WINDOWS & WEB</p><h2>{e('modes_title')}</h2><div class="erp-mode-grid">{cards('modes')}</div></div></section>
<section id="licences" class="section container"><p class="eyebrow">03 / BRAINFOR ERP</p><h2>{e('plans_title')}</h2><p class="erp-section-intro">{e('plans_intro')}</p><div class="erp-plan-grid">{plans}</div><p class="erp-maintenance">{e('maintenance_detail')}</p></section>
<section class="erp-cta"><div class="container erp-cta-grid"><div><p class="eyebrow">BRAINFOR ERP · 0.5</p><h2>{e('cta_title')}</h2><p>{e('cta')}</p><a class="button secondary" href="{demo}">{e('demo')} ↗</a></div><p class="erp-note">{e('note')}</p></div></section></main><footer class="container erp-footer"><a class="brand" href="{HOME[lang]}">{LOGO}<span>Brainfor<span class="brand-sub">{e('footer')}</span></span></a><a class="text-link" href="{HOME[lang]}">{e('back')} ↗</a></footer></body></html>'''
        output = DIST / path.strip('/') / 'index.html'
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(html, encoding='utf-8')
        home = DIST / HOME[lang].strip('/') / 'index.html'
        page = home.read_text(encoding='utf-8')
        page = re.sub(r'\s*<!-- erp-feature -->.*?<!-- /erp-feature -->', '', page, flags=re.S)
        page = re.sub(r'<!-- erp-(nav|hero-action) -->.*?<!-- /erp-\1 -->', '', page, flags=re.S)
        teaser = f'\n<!-- erp-feature --><section class="erp-spotlight" id="brainfor-erp"><div class="container erp-spotlight-grid"><div><p class="eyebrow">{e("offer")}</p><h2>{e("product").replace(chr(10),"<br>")}</h2><p class="erp-spotlight-intro">{e("product_intro")}</p><div class="erp-spotlight-actions"><a class="button secondary" href="{path}">{e("more")} ↗</a><a class="text-link" href="{path}#licences">{e("licences")} ↓</a></div></div><div class="erp-product-plaque"><p class="eyebrow">BRAINFOR ERP</p><h3>{e("headline").replace(chr(10),"<br>")}</h3><p>{e("teaser")}</p><div class="erp-product-tags"><span>{e("perpetual")}</span><span>{e("offline")}</span></div><p class="erp-product-price"><bdi>29 900 {"دج" if lang == "ar" else "DA"}</bdi><small>{e("from")} · Starter · {e("users3")}</small></p><small class="erp-product-status">{e("status")}</small></div></div></section><!-- /erp-feature -->\n'
        page = page.replace('<div class="expertise-strip">', teaser + '<div class="expertise-strip">', 1)
        page = re.sub(r'(<nav class="nav" id="navigation"[^>]*>)', r'\1' + '<!-- erp-nav --><a class="erp-nav-link" href="' + path + '">Brainfor ERP</a><!-- /erp-nav -->', page, count=1)
        page = page.replace('<div class="hero-actions">', '<div class="hero-actions"><!-- erp-hero-action --><a class="text-link erp-hero-link" href="' + path + '">' + e('more') + ' ↗</a><!-- /erp-hero-action -->', 1)
        page = re.sub(r'/erp.css\?v=\d+', '/erp.css?v=2', page)
        if '/erp.css' not in page:
            page = page.replace('</head>', '<link rel="stylesheet" href="/erp.css?v=2">\n<script src="/erp-contact.js?v=1" defer></script>\n</head>')
        home.write_text(page, encoding='utf-8')
    sitemap = DIST / 'sitemap.xml'
    xml = sitemap.read_text(encoding='utf-8')
    for path in PATHS.values():
        links = ''.join('<xhtml:link rel="alternate" hreflang="' + code + '" href="' + ORIGIN + target + '"/>' for code,target in PATHS.items())
        links += '<xhtml:link rel="alternate" hreflang="x-default" href="' + ORIGIN + '/erp/"/>'
        xml = xml.replace('</urlset>', '  <url><loc>' + ORIGIN + path + '</loc>' + links + '</url>\n</urlset>')
    sitemap.write_text(xml, encoding='utf-8')
    briefs = {lang: c['brief'] for lang,c in COPY.items()}
    (DIST / 'erp-contact.js').write_text('''(() => {
  if (new URLSearchParams(location.search).get('product') !== 'brainfor-erp') return;
  const field = document.querySelector('#project-form textarea[name="message"]');
  const briefs = ''' + json.dumps(briefs, ensure_ascii=False) + ''';
  if (field && !field.value.trim()) {
    field.value = briefs[document.documentElement.lang] || briefs.fr;
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }
})();
''', encoding='utf-8')

if __name__ == '__main__':
    build()
