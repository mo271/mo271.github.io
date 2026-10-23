"""Export the home-page profile photo from the retouched master.

usage: python3 export.py master.png ../../assets/images

Writes small_moritz.{jpg,jxl} (480x600, shown on the page), small_moritz-240.{jpg,jxl}
(the srcset candidate for narrow screens) and
large_moritz.{jpg,jxl} (1600x2000, the click-through). The master must be 4:5.
The JXL versions are mirrored horizontally on purpose: a browser with JXL
support shows the mirrored photo, so the page doubles as a JXL test.
Outputs carry no metadata. Requires Pillow and cjxl.
"""
import os, subprocess, sys
from PIL import Image, ImageOps

master, out = sys.argv[1], sys.argv[2]
im = Image.open(master).convert('RGB')
assert abs(im.width / im.height - 0.8) < 0.002, 'master must be 4:5'

def jpg(img, path, q=85):
    img.save(path, 'JPEG', quality=q, progressive=True, optimize=True)

def jxl(img, path):
    tmp = path + '.png'
    ImageOps.mirror(img).save(tmp, 'PNG')
    subprocess.run(['cjxl', tmp, path, '-d', '1', '-e', '8', '--quiet'], check=True)
    os.remove(tmp)

for name, size in [('small_moritz-240', (240, 300)), ('small_moritz', (480, 600)), ('large_moritz', (1600, 2000))]:
    img = im.resize(size, Image.LANCZOS)
    jpg(img, f'{out}/{name}.jpg')
    jxl(img, f'{out}/{name}.jxl')
    print(name, size, os.path.getsize(f'{out}/{name}.jpg'), 'B jpg,', os.path.getsize(f'{out}/{name}.jxl'), 'B jxl')
