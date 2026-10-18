"""Generate complete static language pages and their localized interactive copy.
No browser, network request, form submission or test is run by this generator.
"""
from html import escape, unescape
from html.parser import HTMLParser
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
LANGUAGES = {'fr': '/', 'en': '/en/', 'ar': '/ar/'}
ORIGIN = 'https://brainfor.net'
copy = {}
for filename in ('static.tsv', 'dynamic.tsv'):
    for line in (ROOT / 'locales' / filename).read_text(encoding='utf-8').splitlines():
        if not line.strip():
            continue
        fr, en, ar = line.split('¦')
        copy[fr] = {'en': en, 'ar': ar}

unchanged = {'Brainfor', 'BRAINFOR', 'Sendlyy', 'Floutons', 'EduBest', 'Edu', 'Best',
             'flux', 'ren', 'dez.', 'Android', 'iOS', 'Windows', 'API', '04 / BRAINFOR',
             'CMD-024', 'CMD-023', 'CMD-022'}

class Localize(HTMLParser):
    def __init__(self, lang):
        super().__init__(convert_charrefs=True)
        self.lang, self.output, self.skip = lang, [], 0
    def translate(self, value):
        text = unescape(value)
        stripped = text.strip()
        if stripped in copy:
            return text.replace(stripped, copy[stripped][self.lang], 1)
        if stripped and any(c.isalpha() for c in stripped) and stripped not in unchanged:
            raise ValueError('Missing static translation: ' + stripped)
        return text
    def handle_starttag(self, tag, attrs):
        raw = self.get_starttag_text()
        metadata = dict(attrs)
        def attr(match):
            name, quote, value = match.group(1), match.group(2), match.group(3)
            is_copy = name in ('aria-label', 'placeholder', 'alt') or (
                name == 'content' and tag == 'meta' and
                metadata.get('name', metadata.get('property', '')) in (
                    'description', 'og:title', 'og:description', 'og:image:alt',
                    'twitter:title', 'twitter:description', 'twitter:image:alt')) or (
                name == 'value' and tag == 'input' and metadata.get('name') == 'services')
            return name + '=' + quote + escape(self.translate(value), quote=True) + quote if is_copy else match.group(0)
        raw = re.sub(r'([\w:-]+)=([\"\x27])(.*?)\2', attr, raw)
        self.output.append(raw)
        if tag in ('script', 'style'): self.skip += 1
    def handle_startendtag(self, tag, attrs): self.handle_starttag(tag, attrs)
    def handle_endtag(self, tag):
        self.output.append('</' + tag + '>')
        if tag in ('script', 'style'): self.skip -= 1
    def handle_data(self, text): self.output.append(text if self.skip else escape(self.translate(text), quote=False))
    def handle_entityref(self, name): self.output.append('&' + name + ';')
    def handle_charref(self, name): self.output.append('&#' + name + ';')
    def handle_decl(self, value): self.output.append('<!' + value + '>')
    def handle_comment(self, text): self.output.append('<!--' + text + '-->')

base = (DIST / 'index.html').read_text(encoding='utf-8')
base = re.sub(r'\n?<!-- multilingual-head -->.*?<!-- /multilingual-head -->\n?', '\n', base, flags=re.S)
base = re.sub(r'<!-- language-switch -->.*?<!-- /language-switch -->', '', base, flags=re.S)
base = re.sub(r'<html[^>]*>', '<html lang="fr" dir="ltr">', base, count=1)
base = re.sub(r'<link rel="stylesheet" href="/style.css[^\"]*">', '<link rel="stylesheet" href="/style.css?v=languages-1">', base)
if 'href="/languages.css' not in base:
    base = base.replace('<link rel="stylesheet" href="/style.css?v=languages-1">', '<link rel="stylesheet" href="/style.css?v=languages-1">\n  <link rel="stylesheet" href="/languages.css?v=languages-1">')
base = re.sub(r'<script src="/app.js[^\"]*" defer></script>', '<script src="/app.js?v=languages-2" defer></script>', base)
base = base.replace('<input name="name"', '<input dir="auto" name="name"').replace('<input name="company"', '<input dir="auto" name="company"')
base = base.replace('<input type="email"', '<input dir="ltr" type="email"').replace('<input name="phone"', '<input dir="ltr" name="phone"')
base = base.replace('<textarea id="message"', '<textarea dir="auto" id="message"')

# Translate known display copy in JavaScript in a single pass; identifiers and selectors stay stable.
pattern = re.compile('|'.join(re.escape(key) for key in sorted(copy, key=len, reverse=True)))
app = (DIST / 'app.js').read_text(encoding='utf-8')

for lang, path in LANGUAGES.items():
    if lang == 'fr':
        page = base
    else:
        parser = Localize(lang)
        parser.feed(base)
        page = ''.join(parser.output)
        page = page.replace('lang="fr" dir="ltr"', 'lang="' + lang + '" dir="' + ('rtl' if lang == 'ar' else 'ltr') + '"', 1)
    url = ORIGIN + path
    page = page.replace('<link rel="canonical" href="https://brainfor.net/">', '<link rel="canonical" href="' + url + '">')
    page = page.replace('<meta property="og:url" content="https://brainfor.net/">', '<meta property="og:url" content="' + url + '">')
    locale = {'fr':'fr_DZ', 'en':'en_GB', 'ar':'ar_DZ'}[lang]
    page = re.sub(r'(<meta property="og:locale" content=")[^\"]+', r'\g<1>' + locale, page)
    if lang != 'fr':
        page = page.replace('brainfor-social-v1.png', 'brainfor-social-' + lang + '-v1.png')
        page = page.replace('/app.js?v=languages-2', path + 'app.js?v=languages-2')
        localized_app = app.replace("commande${visible.length > 1 ? 's' : ''}", 'commande(s)')
        localized_app = pattern.sub(lambda match: copy[match.group(0)][lang], localized_app)
        localized_app = localized_app.replace("'fr-DZ'", "'" + ('ar-DZ' if lang == 'ar' else 'en-DZ') + "'").replace("'fr'", "'" + lang + "'")
        localized_app = localized_app.replace(" + ' DA'", " + '" + ('د.ج' if lang == 'ar' else 'DZD') + "'")
        # Keep a separator between the formatted amount and its currency.
        localized_app = localized_app.replace(" + 'د.ج'", " + ' د.ج'").replace(" + 'DZD'", " + ' DZD'")
        localized_app = localized_app.replace('mon-projet-brainfor.txt', 'brainfor-project-brief-' + lang + '.txt')
        (DIST / lang).mkdir(exist_ok=True)
        (DIST / lang / 'app.js').write_text(localized_app, encoding='utf-8')
    alternates = '\n'.join('  <link rel="alternate" hreflang="' + code + '" href="' + ORIGIN + target + '">' for code, target in LANGUAGES.items())
    alternates += '\n  <link rel="alternate" hreflang="x-default" href="' + ORIGIN + '/">'
    for other in LANGUAGES:
        if other != lang:
            alternates += '\n  <meta property="og:locale:alternate" content="' + {'fr':'fr_DZ','en':'en_GB','ar':'ar_DZ'}[other] + '">'
    structured = {
        '@context':'https://schema.org', '@graph':[
            {'@type':'Organization','@id':ORIGIN+'/#organization','name':'Brainfor','url':ORIGIN+'/',
             'logo':ORIGIN+'/assets/brainfor-monogram.png','areaServed':{'@type':'Country','name':'Algeria'}},
            {'@type':'WebSite','@id':ORIGIN+'/#website','url':ORIGIN+'/', 'name':'Brainfor',
             'inLanguage':['fr','en','ar'],'publisher':{'@id':ORIGIN+'/#organization'}},
            {'@type':'WebPage','@id':url+'#webpage','url':url, 'inLanguage':lang,
             'name': unescape(re.search(r'<title>(.*?)</title>', page, re.S).group(1)),
             'isPartOf':{'@id':ORIGIN+'/#website'},'about':{'@id':ORIGIN+'/#organization'}}]}
    block = '\n<!-- multilingual-head -->\n' + alternates + '\n  <script type="application/ld+json">' + json.dumps(structured, ensure_ascii=False).replace('<','\\u003c') + '</script>\n<!-- /multilingual-head -->\n'
    page = page.replace('</head>', block + '</head>')
    nav_label = {'fr':'Choisir la langue','en':'Choose language','ar':'اختيار اللغة'}[lang]
    nav = '<!-- language-switch --><nav class="language-switch" aria-label="' + nav_label + '" dir="ltr">'
    for code, target in LANGUAGES.items():
        nav += '<a href="' + target + '" lang="' + code + '" hreflang="' + code + '"' + (' aria-current="page"' if code == lang else '') + '>' + {'fr':'FR','en':'EN','ar':'العربية'}[code] + '</a>'
    nav += '</nav><!-- /language-switch -->'
    page = page.replace('    <button class="menu-toggle"', '    ' + nav + '\n    <button class="menu-toggle"', 1)
    output = DIST / 'index.html' if lang == 'fr' else DIST / lang / 'index.html'
    output.write_text(page, encoding='utf-8')

links = ''.join('\n    <xhtml:link rel="alternate" hreflang="' + code + '" href="' + ORIGIN + path + '"/>' for code,path in LANGUAGES.items())
links += '\n    <xhtml:link rel="alternate" hreflang="x-default" href="' + ORIGIN + '/"/>'
sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
for path in LANGUAGES.values(): sitemap += '\n  <url>\n    <loc>' + ORIGIN + path + '</loc>' + links + '\n  </url>'
(DIST / 'sitemap.xml').write_text(sitemap + '\n</urlset>\n', encoding='utf-8')
