#!/usr/bin/env python3
"""
Minimize fonts for mo271.github.io
Scans all text files in the repo to find which characters are actually used,
then subsets the Linux Biolinum fonts to only include those glyphs.
Finally generates a _biolinum.scss with the fonts base64-encoded inline.

Replaces the old fontforge-based notebook approach with fonttools/pyftsubset.
"""

import mimetypes
import os
import base64
from fontTools import subset

ROOTDIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
FONTDIR = os.path.join(ROOTDIR, '_fonts')
TARGETFONTDIR = os.path.join(FONTDIR, 'minified')
SASS_OUTPUT = os.path.join(ROOTDIR, '_sass', '_biolinum.scss')

def collect_characters():
    """Walk the repo and collect all unique characters from text files."""
    all_chars = set()
    skip_dirs = {'jmol', 'jsmol', '.git', 'vendor', '_site', '.sass-cache',
                 '.bundle', 'node_modules', 'CindyJS', 'swissgl'}
    for subdir, dirs, files in os.walk(ROOTDIR):
        # Skip certain directories
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for file in files:
            filepath = os.path.join(subdir, file)
            if '.css' in filepath:
                continue
            mime = mimetypes.guess_type(file)
            if mime[0] is not None and ('text' in mime[0]
                    or mime[0] in ('application/yaml', 'application/json')):
                try:
                    with open(filepath, 'r', errors='replace') as f:
                        all_chars.update(f.read())
                except Exception as e:
                    print(f"  Skipping {filepath}: {e}")
    return all_chars


def subset_font(source_path, target_path, characters):
    """Subset a font to only include the given characters using fonttools."""
    # Build unicodes string for pyftsubset
    unicodes = ','.join(f'U+{ord(c):04X}' for c in characters)

    args = [
        source_path,
        f'--output-file={target_path}',
        f'--unicodes={unicodes}',
        '--flavor=woff',
        '--no-hinting',
        '--desubroutinize',
    ]
    subsetter = subset.Subsetter()
    font = subset.load_font(source_path, subset.Options())
    options = subset.Options()
    options.flavor = 'woff'
    options.desubroutinize = True
    options.hinting = False

    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=[ord(c) for c in characters])

    font = subset.load_font(source_path, options)
    subsetter.subset(font)
    subset.save_font(font, target_path, options)
    font.close()


def main():
    print("Step 1: Collecting characters from all text files...")
    chars = collect_characters()
    print(f"  Found {len(chars)} unique characters")

    # Show some interesting non-ASCII ones
    non_ascii = sorted([c for c in chars if ord(c) > 127], key=ord)
    if non_ascii:
        print(f"  Non-ASCII characters: {''.join(non_ascii)}")

    os.makedirs(TARGETFONTDIR, exist_ok=True)

    font_types = ['R', 'RI', 'RB']
    print("\nStep 2: Subsetting fonts...")
    for typ in font_types:
        source = os.path.join(FONTDIR, f'LinBiolinum_{typ}.woff')
        target = os.path.join(TARGETFONTDIR, f'LinBiolinum_{typ}.woff')
        if not os.path.exists(source):
            print(f"  WARNING: Source font {source} not found, skipping")
            continue
        source_size = os.path.getsize(source)
        print(f"  Subsetting LinBiolinum_{typ}.woff ({source_size:,} bytes)...")
        subset_font(source, target, chars)
        target_size = os.path.getsize(target)
        print(f"    -> {target_size:,} bytes ({100*target_size/source_size:.1f}% of original)")

    print("\nStep 3: Generating _biolinum.scss with base64-encoded fonts...")
    ugly = {}
    for typ in font_types:
        target = os.path.join(TARGETFONTDIR, f'LinBiolinum_{typ}.woff')
        with open(target, 'rb') as f:
            ugly[typ] = base64.b64encode(f.read()).decode()
        print(f"  LinBiolinum_{typ}.woff -> {len(ugly[typ]):,} chars base64")

    biolinum_css = """/*
 * CSS-ified version of Biolinum.
 */

@font-face {{
    font-family: 'Linux Biolinum'; /* normal */
    src: url('data:application/x-font-woff;base64,{R}') format('woff');
    font-weight: normal;
    font-style: normal;
}}

@font-face {{
    font-family: 'Linux Biolinum'; /* italic */
    src: url('data:application/x-font-woff;base64,{RI}') format('woff');
    font-weight: normal;
    font-style: italic;
}}

@font-face {{
    font-family: 'Linux Biolinum'; /* bold */
    src: url('data:application/x-font-woff;base64,{RB}') format('woff');
    font-weight: bold;
    font-style: normal;
}}""".format(**ugly)

    with open(SASS_OUTPUT, 'w') as f:
        f.write(biolinum_css)
    print(f"\n  Written to {SASS_OUTPUT}")
    print(f"  File size: {os.path.getsize(SASS_OUTPUT):,} bytes")
    print("\nDone!")


if __name__ == '__main__':
    main()
