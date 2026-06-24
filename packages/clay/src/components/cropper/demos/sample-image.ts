/**
 * Builds a tiny synthetic sample image entirely in-memory so demos can show
 * the cropper working without any network fetch or checked-in binary assets.
 *
 * Technique: paint a gradient + geometric pattern on an offscreen canvas and
 * export it via toDataURL, then wrap the data-URI in a Blob/File so the Cropper
 * accepts it through the normal file path (URL.createObjectURL).
 */

/** Returns a File whose content is a 256x256 gradient + grid PNG. */
export function makeSampleImageFile(name = 'sample.png'): File {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx === null) throw new Error('2d context unavailable');

  // Radial gradient background: teal centre fading to indigo edge.
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, '#38bdf8');
  grad.addColorStop(0.5, '#818cf8');
  grad.addColorStop(1, '#6366f1');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Light grid lines so you can see the pan/zoom motion clearly.
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1;
  const step = 32;
  for (let i = step; i < size; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  // Centre circle accent so orientation is obvious during rotation.
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fill();

  // Convert to a Blob/File via dataURL -> fetch (synchronous path via atob).
  const dataUrl = canvas.toDataURL('image/png');
  const base64 = dataUrl.split(',')[1];
  const bytes = atob(base64);
  const buf = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    buf[i] = bytes.charCodeAt(i);
  }
  return new File([buf], name, { type: 'image/png' });
}
