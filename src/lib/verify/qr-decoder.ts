/** Local QR decoding, loaded only when a camera frame or an uploaded image needs it. */
export async function decodeQrPixels(image: ImageData): Promise<string | null> {
  const { width, height, data } = image;
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0 || data.length !== width * height * 4) return null;

  // Transparent PNG backgrounds must behave like white paper, not black RGB pixels.
  let pixels = data;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] === 255) continue;
    pixels = new Uint8ClampedArray(data);
    for (let p = 0; p < pixels.length; p += 4) {
      const alpha = data[p + 3]! / 255;
      for (let channel = 0; channel < 3; channel++) pixels[p + channel] = Math.round(data[p + channel]! * alpha + 255 * (1 - alpha));
      pixels[p + 3] = 255;
    }
    break;
  }

  const { default: jsQR } = await import('jsqr');
  const result = jsQR(pixels, width, height, { inversionAttempts: 'attemptBoth' });
  return result?.data.trim() ? result.data : null;
}
