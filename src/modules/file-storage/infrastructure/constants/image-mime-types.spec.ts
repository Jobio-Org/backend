import {
  HEIC_EXTENSIONS,
  HEIC_MIME_TYPES,
  IMAGE_EXTENSIONS,
  IMAGE_MIME_TYPES,
  isHeicExtension,
  isHeicMimeType,
  isImageExtension,
  isImageMimeType,
} from './image-mime-types';

describe('Image MIME Types Utilities', () => {
  describe('Constants', () => {
    it('should have correct image MIME types', () => {
      expect(IMAGE_MIME_TYPES.JPEG).toBe('image/jpeg');
      expect(IMAGE_MIME_TYPES.PNG).toBe('image/png');
      expect(IMAGE_MIME_TYPES.HEIC).toBe('image/heic');
      expect(IMAGE_MIME_TYPES.HEIF).toBe('image/heif');
    });

    it('should include application/octet-stream in HEIC MIME types', () => {
      expect(HEIC_MIME_TYPES).toContain('application/octet-stream');
    });

    it('should have correct image extensions', () => {
      expect(IMAGE_EXTENSIONS).toContain('jpg');
      expect(IMAGE_EXTENSIONS).toContain('heic');
      expect(IMAGE_EXTENSIONS).toContain('png');
    });

    it('should have correct HEIC extensions', () => {
      expect(HEIC_EXTENSIONS).toContain('heic');
      expect(HEIC_EXTENSIONS).toContain('heif');
    });
  });

  describe('isImageMimeType', () => {
    it('should return true for image MIME types', () => {
      expect(isImageMimeType('image/jpeg')).toBe(true);
      expect(isImageMimeType('image/png')).toBe(true);
      expect(isImageMimeType('image/heic')).toBe(true);
    });

    it('should return false for non-image MIME types', () => {
      expect(isImageMimeType('application/pdf')).toBe(false);
      expect(isImageMimeType('text/plain')).toBe(false);
      expect(isImageMimeType('application/octet-stream')).toBe(false);
    });
  });

  describe('isHeicMimeType', () => {
    it('should return true for HEIC MIME types', () => {
      expect(isHeicMimeType('image/heic')).toBe(true);
      expect(isHeicMimeType('image/heif')).toBe(true);
      expect(isHeicMimeType('application/octet-stream')).toBe(true);
    });

    it('should return false for non-HEIC MIME types', () => {
      expect(isHeicMimeType('image/jpeg')).toBe(false);
      expect(isHeicMimeType('image/png')).toBe(false);
      expect(isHeicMimeType('application/pdf')).toBe(false);
    });
  });

  describe('isImageExtension', () => {
    it('should return true for image extensions', () => {
      expect(isImageExtension('jpg')).toBe(true);
      expect(isImageExtension('png')).toBe(true);
      expect(isImageExtension('heic')).toBe(true);
      expect(isImageExtension('JPG')).toBe(true); // Case insensitive
      expect(isImageExtension('PNG')).toBe(true);
    });

    it('should return false for non-image extensions', () => {
      expect(isImageExtension('pdf')).toBe(false);
      expect(isImageExtension('txt')).toBe(false);
      expect(isImageExtension('doc')).toBe(false);
    });
  });

  describe('isHeicExtension', () => {
    it('should return true for HEIC extensions', () => {
      expect(isHeicExtension('heic')).toBe(true);
      expect(isHeicExtension('heif')).toBe(true);
      expect(isHeicExtension('HEIC')).toBe(true); // Case insensitive
      expect(isHeicExtension('HEIF')).toBe(true);
    });

    it('should return false for non-HEIC extensions', () => {
      expect(isHeicExtension('jpg')).toBe(false);
      expect(isHeicExtension('png')).toBe(false);
      expect(isHeicExtension('pdf')).toBe(false);
    });
  });
});
