"""Preserve the order of grouped numbers in Arabic text, including native options."""
from html.parser import HTMLParser
from pathlib import Path
import re

NUMBER = re.compile(r'[0-9]+(?:[\s\u00a0\u202f,.:/–-][0-9]+)*')

class IsolateNumbers(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.parts, self.skip = [], 0
    def handle_starttag(self,tag,attrs):
        raw=self.get_starttag_text()
        if tag == 'bdi' and not dict(attrs).get('dir'):
            raw=raw.replace('<bdi','<bdi dir="ltr"',1)
        self.parts.append(raw)
        if tag in ('script','style'): self.skip+=1
    def handle_startendtag(self,tag,attrs): self.parts.append(self.get_starttag_text())
    def handle_endtag(self,tag):
        self.parts.append('</'+tag+'>')
        if tag in ('script','style'): self.skip-=1
    def handle_data(self,text):
        self.parts.append(text if self.skip else NUMBER.sub(lambda m:'\u2066'+m.group(0).replace(' ','\u00a0')+'\u2069',text))
    def handle_decl(self,text): self.parts.append('<!'+text+'>')
    def handle_comment(self,text): self.parts.append('<!--'+text+'-->')
    def handle_entityref(self,text): self.parts.append('&'+text+';')
    def handle_charref(self,text): self.parts.append('&#'+text+';')

def build(dist: Path):
    for file in dist.rglob('index.html'):
        html=file.read_text(encoding='utf-8')
        html=re.sub(r'/languages.css\?v=[\w-]+','/languages.css?v=numbers-2',html)
        if '<html lang="ar"' in html:
            parser=IsolateNumbers();parser.feed(html);html=''.join(parser.parts)
        file.write_text(html,encoding='utf-8')
