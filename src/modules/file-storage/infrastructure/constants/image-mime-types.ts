/**
 * MIME types for different image formats
 */
export const IMAGE_MIME_TYPES = {
  JPEG: 'image/jpeg',
  JPG: 'image/jpg',
  PNG: 'image/png',
  WEBP: 'image/webp',
  GIF: 'image/gif',
  BMP: 'image/bmp',
  TIFF: 'image/tiff',
  HEIC: 'image/heic',
  HEIF: 'image/heif',
} as const;

/**
 * MIME types that might be used for HEIC files in different browsers
 */
export const HEIC_MIME_TYPES = [
  IMAGE_MIME_TYPES.HEIC,
  IMAGE_MIME_TYPES.HEIF,
  'application/octet-stream', // Chrome sometimes uses this for HEIC files
] as const;

/**
 * File extensions for different image formats
 */
export const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'heic', 'heif'] as const;

/**
 * HEIC-specific file extensions
 */
export const HEIC_EXTENSIONS = ['heic', 'heif'] as const;
