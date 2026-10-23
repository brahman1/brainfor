"""Apply shared navigation, footer and visual rules to every locale and product."""
from html import escape
from pathlib import Path
import re

HOME={'fr':'/','en':'/en/','ar':'/ar/'}
def build(dist: Path):
 for lang,home in HOME.items():
  source=(dist/home.strip('/')/'index.html').read_text(encoding='utf-8')
  header=re.search(r'<header class="header">.*?</header>',source,re.S).group(0)
  footer=re.search(r'<footer\b[^>]*>.*?</footer>',source,re.S).group(0)
  skip=re.search(r'<a class="skip-link".*?</a>',source,re.S).group(0)
  for product in ('','erp/','siyano/'):
   target=dist/(home+product).strip('/')/'index.html'
   page=target.read_text(encoding='utf-8')
   if product:
    shared=header.replace('href="#', 'href="'+home+'#')
    # Language switching always targets the same kind of page without carrying a section.
    shared=re.sub(r'(<a href=")[^"]*(" lang="(fr|en|ar)" hreflang="\3")',lambda m:m.group(1)+HOME[m.group(3)]+product+m.group(2),shared)
    current=home+product
    shared=shared.replace('href="'+current+'">','href="'+current+'" aria-current="page">')
    page=re.sub(r'<header\b[^>]*>.*?</header>',lambda _:shared,page,count=1,flags=re.S)
    shared_footer=footer.replace('href="#"','href="#contenu"')
    shared_footer=re.sub(r'<button data-legal="(mentions|privacy)">(.*?)</button>',lambda m:'<a href="'+home+'?legal='+m.group(1)+'#contact">'+m.group(2)+'</a>',shared_footer)
    page=re.sub(r'<footer\b[^>]*>.*?</footer>',lambda _:shared_footer,page,count=1,flags=re.S)
    page=page.replace('<main>','<main id="contenu">',1)
    if 'class="skip-link"' not in page:
     page=page.replace('<header class="header">',skip+'<header class="header">',1)
   page=re.sub(r'<link rel="stylesheet" href="/uniform.css[^\"]*">\s*','',page)
   page=re.sub(r'<script src="/site-chrome.js[^\"]*" defer></script>\s*','',page)
   page=page.replace('</head>','<link rel="stylesheet" href="/uniform.css?v=1">\n<script src="/site-chrome.js?v=1" defer></script>\n</head>')
   target.write_text(page,encoding='utf-8')
