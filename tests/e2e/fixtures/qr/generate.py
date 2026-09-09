"""Deterministic QR fixtures: python3 generate.py (requires python-qrcode only).
PNG encoding uses the standard library, so image/decoder libraries under test are not reused.
"""
from pathlib import Path
import struct
import zlib
import json
import hashlib
import qrcode

ROOT = Path(__file__).resolve().parent
CODE = 'TRZ-7F2K-4K7Q-92FA'
FOREIGN = 'https://example.invalid/not-a-traza-unit'

def write_png(name, width, height, rows):
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
    raw = b'\x89PNG\r\n\x1a\n'
    raw += chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 0, 0, 0, 0))
    raw += chunk(b'IDAT', zlib.compress(b''.join(rows), 9)) + chunk(b'IEND', b'')
    (ROOT / name).write_bytes(raw)

def png(name, matrix, invert=False, scale=8):
    n = len(matrix)
    rows = []
    for row in matrix:
        pixels = b''.join(bytes([0 if bool(cell) != invert else 255]) * scale for cell in row)
        rows.extend([b'\0' + pixels] * scale)
    write_png(name, n*scale, n*scale, rows)

def matrix(payload):
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=4)
    qr.add_data(payload)
    qr.make(fit=True)
    return qr.get_matrix()

valid = matrix(CODE)
png('valid.png', valid)
png('rotated-90.png', list(zip(*valid[::-1])))
png('inverted.png', valid, invert=True)
png('foreign.png', matrix(FOREIGN))
png('no-qr.png', [[False] * 32 for _ in range(32)])
(ROOT / 'corrupt.png').write_bytes(b'\x89PNG\r\n\x1a\ncorrupted-image-for-qr-input-test')
panorama = json.loads((ROOT / 'panorama-qr-matrix.json').read_text())
width, height = panorama['canvas']
offset_x, offset_y = panorama['offset']
scale = panorama['scale']
rows = [bytearray(b'\xff' * width) for _ in range(height)]
for x, y in panorama['darkModules']:
    for dy in range(scale):
        start = offset_x + x * scale
        rows[offset_y + y * scale + dy][start:start + scale] = b'\0' * scale
write_png('panorama-small-qr.png', width, height, [b'\0' + row for row in rows])
manifest = {'payloads': {'valid.png': CODE, 'rotated-90.png': CODE, 'inverted.png': CODE, 'foreign.png': FOREIGN, 'panorama-small-qr.png': panorama['payload']}, 'files': {p.name: {'bytes': p.stat().st_size, 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(ROOT.glob('*.png'))}}
(ROOT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
