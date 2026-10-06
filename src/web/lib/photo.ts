/**
 * Safe In-Memory Photo Processing Pipeline
 * Centre-crops to square, strips EXIF / GPS via canvas re-encoding,
 * and exports optimized JPEG buffers.
 */

export interface ProcessedPhoto {
  full512: string; // JPEG data URL at 512x512, q=0.82
  vcf256: string;  // JPEG data URL at 256x256, q=0.82
}

const MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024; // 12 MB
const MAX_DIMENSION_PX = 8000;

export async function processPhotoFile(file: File): Promise<ProcessedPhoto> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select an image file (JPEG, PNG, WEBP, or HEIC).');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('Image exceeds 12 MB limit. Please select a smaller photo.');
  }

  // Use createImageBitmap if available for auto-orientation, with Image fallback
  let bitmapWidth = 0;
  let bitmapHeight = 0;
  let source: CanvasImageSource;

  if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      bitmapWidth = bitmap.width;
      bitmapHeight = bitmap.height;
      source = bitmap;
    } catch {
      source = await loadImageElement(file);
      bitmapWidth = (source as HTMLImageElement).naturalWidth;
      bitmapHeight = (source as HTMLImageElement).naturalHeight;
    }
  } else {
    source = await loadImageElement(file);
    bitmapWidth = (source as HTMLImageElement).naturalWidth;
    bitmapHeight = (source as HTMLImageElement).naturalHeight;
  }

  if (bitmapWidth > MAX_DIMENSION_PX || bitmapHeight > MAX_DIMENSION_PX) {
    throw new Error('Image dimension exceeds 8000px limit.');
  }

  // Calculate centre-crop square coordinates
  const minDim = Math.min(bitmapWidth, bitmapHeight);
  const cropX = (bitmapWidth - minDim) / 2;
  const cropY = (bitmapHeight - minDim) / 2;

  // 1. Generate 512x512 full photo
  const canvas512 = document.createElement('canvas');
  canvas512.width = 512;
  canvas512.height = 512;
  const ctx512 = canvas512.getContext('2d');
  if (!ctx512) throw new Error('Could not initialize canvas context.');

  ctx512.imageSmoothingEnabled = true;
  ctx512.imageSmoothingQuality = 'high';
  ctx512.drawImage(source, cropX, cropY, minDim, minDim, 0, 0, 512, 512);
  const full512 = canvas512.toDataURL('image/jpeg', 0.82);

  // 2. Generate 256x256 thumbnail for .vcf embedding
  const canvas256 = document.createElement('canvas');
  canvas256.width = 256;
  canvas256.height = 256;
  const ctx256 = canvas256.getContext('2d');
  if (!ctx256) throw new Error('Could not initialize canvas context.');

  ctx256.imageSmoothingEnabled = true;
  ctx256.imageSmoothingQuality = 'high';
  ctx256.drawImage(canvas512, 0, 0, 512, 512, 0, 0, 256, 256);
  const vcf256 = canvas256.toDataURL('image/jpeg', 0.82);

  return { full512, vcf256 };
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image element.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read photo file.'));
    reader.readAsDataURL(file);
  });
}
