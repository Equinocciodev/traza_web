/** Lectura local de fotografías: tamaño acotado, cancelación y liberación del blob. */
import { decodeQrPixels } from './qr-decoder';

export const QR_IMAGE_MAX_BYTES = 10 * 1024 * 1024;
export type QrImageFailure = 'invalidFile' | 'tooLarge' | 'noQr' | 'unavailable' | 'cancelled' | 'timeout';

export class QrImageError extends Error {
  constructor(readonly kind: QrImageFailure) {
    super(kind);
    this.name = 'QrImageError';
  }
}

function checkCancelled(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw signal.reason instanceof QrImageError ? signal.reason : new QrImageError('cancelled');
  }
}

async function loadImage(url: string, signal?: AbortSignal): Promise<HTMLImageElement> {
  checkCancelled(signal);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    let settled = false;
    const finish = (error?: QrImageError) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      image.onload = null;
      image.onerror = null;
      if (error) { image.src = ''; reject(error); }
      else resolve(image);
    };
    const abort = () => finish(signal?.reason instanceof QrImageError ? signal.reason : new QrImageError('cancelled'));
    const timer = setTimeout(() => finish(new QrImageError('timeout')), 12000);
    signal?.addEventListener('abort', abort, { once: true });
    image.onload = () => finish();
    image.onerror = () => finish(new QrImageError('invalidFile'));
    image.src = url;
  });
}

export async function decodeQrFile(file: Blob, signal?: AbortSignal): Promise<string> {
  checkCancelled(signal);
  if (file.size > QR_IMAGE_MAX_BYTES) throw new QrImageError('tooLarge');
  if (!file.size || (file.type && !file.type.startsWith('image/'))) throw new QrImageError('invalidFile');
  let url: string | undefined;
  let image: HTMLImageElement | undefined;
  const canvas = document.createElement('canvas');
  try {
    url = URL.createObjectURL(file);
    image = await loadImage(url, signal);
    checkCancelled(signal);
    const { naturalWidth: width, naturalHeight: height } = image;
    if (!width || !height) throw new QrImageError('invalidFile');
    if (width * height > 40_000_000) throw new QrImageError('tooLarge');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new QrImageError('unavailable');
    const started = performance.now();
    const checkBudget = () => {
      checkCancelled(signal);
      if (performance.now() - started >= 8000) throw new QrImageError('timeout');
    };
    // Ceder también tras una lectura permite procesar Escape/cancelación antes
    // de entregar un resultado. jsQR es síncrono dentro de cada intento acotado.
    const readCanvas = async () => {
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      // La importación diferida del lector puede seguir pendiente sin conexión.
      // Cancelar o agotar el tiempo también libera la imagen en esa situación.
      const raw = await new Promise<string | null>((resolve, reject) => {
        let settled = false;
        const finish = (value: string | null, error?: unknown) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          signal?.removeEventListener('abort', abort);
          if (error) reject(error); else resolve(value);
        };
        const abort = () => finish(null, signal?.reason instanceof QrImageError ? signal.reason : new QrImageError('cancelled'));
        const timer = setTimeout(() => finish(null, new QrImageError('timeout')), Math.max(0, 8000 - (performance.now() - started)));
        signal?.addEventListener('abort', abort, { once: true });
        if (signal?.aborted) { abort(); return; }
        Promise.resolve().then(() => settled ? null : decodeQrPixels(pixels)).then(value => finish(value), error => finish(null, error));
      });
      await new Promise<void>(resolve => setTimeout(resolve, 0));
      checkCancelled(signal);
      return raw?.trim() ? raw : null;
    };
    const prepare = (w: number, h: number, smoothing: boolean) => {
      canvas.width = w;
      canvas.height = h;
      context.fillStyle = '#fff';
      context.fillRect(0, 0, w, h);
      context.imageSmoothingEnabled = smoothing;
    };
    // Primero la foto completa: códigos grandes y fotos pequeñas. El lienzo
    // nunca supera 1600 px por lado, independientemente del tamaño de origen.
    const longest = Math.max(width, height);
    const scales = [...new Set([Math.min(1, 1600 / longest), Math.min(1, 1000 / longest), Math.min(1, 640 / longest), ...(longest < 500 ? [Math.min(3, 1000 / longest)] : [])])];
    for (const scale of scales) {
      checkBudget();
      prepare(Math.max(1, Math.round(width * scale)), Math.max(1, Math.round(height * scale)), scale < 1);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const raw = await readCanvas();
      if (raw) return raw;
    }
    // Un QR pequeño se pierde al reducir una panorámica. Buscar después en
    // recortes nativos solapados conserva sus módulos, incluidos los de códigos
    // que caen sobre una frontera. El centro tiene prioridad; bordes incluidos.
    if (longest > 1600) {
      const tileWidth = Math.min(1600, width);
      const tileHeight = Math.min(1600, height);
      const xs = tileAxis(width, tileWidth);
      const ys = tileAxis(height, tileHeight);
      const tiles = xs.positions.flatMap(x => ys.positions.map(y => ({ x, y,
        distance: (x + tileWidth / 2 - width / 2) ** 2 + (y + tileHeight / 2 - height / 2) ** 2,
      }))).sort((a, b) => a.distance - b.distance).slice(0, 64);
      for (const { x, y } of tiles) {
        checkBudget();
        prepare(tileWidth, tileHeight, false);
        context.drawImage(image, x, y, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
        const raw = await readCanvas();
        if (raw) return raw;
      }
      // Un presupuesto agotado no permite afirmar que la imagen no tiene QR.
      if (xs.count * ys.count > tiles.length) throw new QrImageError('timeout');
    }
    checkBudget();
    throw new QrImageError('noQr');
  } catch (error) {
    if (error instanceof QrImageError) throw error;
    throw new QrImageError('unavailable');
  } finally {
    if (image) image.src = '';
    canvas.width = canvas.height = 0;
    if (url) URL.revokeObjectURL(url);
  }
}

/** Como máximo 64 posiciones por eje incluso en imágenes extremadamente largas. */
function tileAxis(length: number, tileSize: number): { positions: number[]; count: number } {
  const step = 1600 - 256;
  const end = length - tileSize;
  const count = Math.ceil(end / step) + 1;
  const middle = Math.min(count - 1, Math.round(end / (2 * step)));
  const positions: number[] = [];
  for (let index = Math.max(0, middle - 64); index <= Math.min(count - 1, middle + 64); index++) {
    positions.push(Math.min(index * step, end));
  }
  positions.sort((a, b) => Math.abs(a - end / 2) - Math.abs(b - end / 2));
  return { positions: positions.slice(0, 64), count };
}
