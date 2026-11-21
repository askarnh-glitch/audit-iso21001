"""Gabungkan src/ menjadi satu file HTML offline.

Hasil:
  - 'Aplikasi Audit ISO 21001.html' (dipakai offline)
  - 'index.html' (halaman GitHub Pages; isinya sama)

URL backend Apps Script (bukan kode akses) dibaca dari src/config.json bila ada:
  { "cloudUrl": "https://script.google.com/macros/s/.../exec" }
"""
import datetime
import json
import pathlib

src = pathlib.Path(__file__).resolve().parent
root = src.parent
read = lambda name: (src / name).read_text(encoding='utf-8')

cfg = {}
if (src / 'config.json').exists():
    cfg = json.loads(read('config.json'))
config_js = 'const CLOUD_URL_DEFAULT = ' + json.dumps(cfg.get('cloudUrl', '')) + ';\n'
config_js += 'const GOOGLE_CLIENT_ID = ' + json.dumps(cfg.get('googleClientId', '')) + ';\n'

html = read('index.html')
html = html.replace('/*__CSS__*/', read('style.css'))
html = html.replace('/*__DATA__*/', read('data.js') + '\n' + read('glossary.js'))
guide = '\n'.join(read(f) for f in ('guide_a.js', 'guide_b.js', 'guide_c.js', 'guide_d.js', 'crit_a.js', 'crit_b.js', 'crit_c.js', 'crit_d.js'))
html = html.replace('/*__GUIDE__*/', guide)
html = html.replace('/*__APP__*/', config_js + read('cloud.js') + '\n' + read('app.js'))

# Penanda versi build: dipakai untuk memastikan GitHub Pages sudah menayangkan versi terbaru.
stamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
html = html.replace('<head>', '<head>\n<meta name="build" content="' + stamp + '">', 1)

for name in ('Aplikasi Audit ISO 21001.html', 'index.html'):
    (root / name).write_text(html, encoding='utf-8')
print('OK', len(html) // 1024, 'KB ->', 'Aplikasi Audit ISO 21001.html, index.html', '| build', stamp)
