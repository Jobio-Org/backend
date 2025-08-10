import { Test, type TestingModule } from '@nestjs/testing';

import { FileBucket } from '~modules/file-storage/domain/enums/file-type.enum';

import { ImageProcessingService } from './image-processing.service';

// Mock file object for testing
const createMockFile = (mimetype: string, originalname: string): Express.Multer.File => ({
  fieldname: 'file',
  originalname,
  encoding: '7bit',
  mimetype,
  buffer: Buffer.from('test'),
  size: 1024,
  stream: null as any,
  destination: '',
  filename: '',
  path: '',
});

describe('ImageProcessingService', () => {
  let service: ImageProcessingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageProcessingService],
    }).compile();

    service = module.get<ImageProcessingService>(ImageProcessingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isImageFile', () => {
    it('should return true for standard image MIME types', () => {
      expect(service.isImageFile(createMockFile('image/jpeg', 'test.jpg'))).toBe(true);
      expect(service.isImageFile(createMockFile('image/png', 'test.png'))).toBe(true);
      expect(service.isImageFile(createMockFile('image/webp', 'test.webp'))).toBe(true);
    });

    it('should return true for HEIC files with proper MIME types', () => {
      expect(service.isImageFile(createMockFile('image/heic', 'test.heic'))).toBe(true);
      expect(service.isImageFile(createMockFile('image/heif', 'test.heif'))).toBe(true);
    });

    it('should return true for HEIC files with application/octet-stream MIME type', () => {
      expect(service.isImageFile(createMockFile('application/octet-stream', 'test.heic'))).toBe(true);
      expect(service.isImageFile(createMockFile('application/octet-stream', 'test.heif'))).toBe(true);
    });

    it('should return true for image files detected by extension', () => {
      expect(service.isImageFile(createMockFile('application/octet-stream', 'test.jpg'))).toBe(true);
      expect(service.isImageFile(createMockFile('application/octet-stream', 'test.png'))).toBe(true);
    });

    it('should return false for non-image files', () => {
      expect(service.isImageFile(createMockFile('application/pdf', 'test.pdf'))).toBe(false);
      expect(service.isImageFile(createMockFile('text/plain', 'test.txt'))).toBe(false);
      expect(service.isImageFile(createMockFile('application/octet-stream', 'test.pdf'))).toBe(false);
    });
  });

  describe('isHeicFile', () => {
    it('should return true for HEIC files with proper MIME types', () => {
      expect(service.isHeicFile(createMockFile('image/heic', 'test.heic'))).toBe(true);
      expect(service.isHeicFile(createMockFile('image/heif', 'test.heif'))).toBe(true);
    });

    it('should return true for HEIC files with application/octet-stream MIME type', () => {
      expect(service.isHeicFile(createMockFile('application/octet-stream', 'test.heic'))).toBe(true);
      expect(service.isHeicFile(createMockFile('application/octet-stream', 'test.heif'))).toBe(true);
    });

    it('should return false for non-HEIC files', () => {
      expect(service.isHeicFile(createMockFile('image/jpeg', 'test.jpg'))).toBe(false);
      expect(service.isHeicFile(createMockFile('application/octet-stream', 'test.jpg'))).toBe(false);
      expect(service.isHeicFile(createMockFile('application/pdf', 'test.pdf'))).toBe(false);
    });
  });

  describe('isProcessableImage (deprecated)', () => {
    it('should return true for supported image types', () => {
      expect(service.isImageMimeType('image/jpeg')).toBe(true);
      expect(service.isImageMimeType('image/png')).toBe(true);
      expect(service.isImageMimeType('image/heic')).toBe(true);
      expect(service.isImageMimeType('image/webp')).toBe(true);
    });

    it('should return false for unsupported types', () => {
      expect(service.isImageMimeType('application/pdf')).toBe(false);
      expect(service.isImageMimeType('text/plain')).toBe(false);
    });
  });

  describe('getRecommendedOptions', () => {
    it('should return logo-specific options for logos bucket', () => {
      const options = service.getRecommendedOptions('image/png', 1024 * 1024, FileBucket.LOGOS);

      expect(options.quality).toBe(90);
      expect(options.maxWidth).toBe(800);
      expect(options.maxHeight).toBe(800);
      expect(options.format).toBe('png');
    });

    it('should return avatar-specific options for avatars bucket', () => {
      const options = service.getRecommendedOptions('image/jpeg', 1024 * 1024, FileBucket.AVATARS);

      expect(options.quality).toBe(85);
      expect(options.maxWidth).toBe(400);
      expect(options.maxHeight).toBe(400);
      expect(options.format).toBe('jpeg');
    });

    it('should return default options for other buckets', () => {
      const options = service.getRecommendedOptions('image/jpeg', 1024 * 1024, FileBucket.DOCUMENTS);

      expect(options.quality).toBe(85);
      expect(options.maxWidth).toBe(1920);
      expect(options.maxHeight).toBe(1080);
      expect(options.format).toBe('jpeg');
    });
  });

  describe('processImage', () => {
    it('should handle processing errors gracefully', async () => {
      // Create a mock buffer that would cause processing to fail
      const mockBuffer = Buffer.from('invalid image data');

      const result = await service.processImage(mockBuffer, 'image/jpeg');

      // Should return original image if processing fails
      expect(result.buffer).toEqual(mockBuffer);
      expect(result.mimetype).toBe('image/jpeg');
    });
  });
});
