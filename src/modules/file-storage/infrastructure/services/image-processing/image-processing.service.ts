import { Injectable } from '@nestjs/common';
import * as heicConvert from 'heic-convert';
import * as sharp from 'sharp';

import { FileUploadException } from '~modules/file-storage/application/exceptions/file-upload.exception';
import { FileBucket } from '~modules/file-storage/domain/enums/file-type.enum';
import {
  HEIC_EXTENSIONS,
  HEIC_MIME_TYPES,
  IMAGE_EXTENSIONS,
} from '~modules/file-storage/infrastructure/constants/image-mime-types';

export interface ImageProcessingOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

@Injectable()
export class ImageProcessingService {
  /**
   * Process image before storage: compress, resize, and convert HEIC to JPEG
   */
  async processImage(
    buffer: Buffer,
    mimetype: string,
    options: ImageProcessingOptions = {},
  ): Promise<{ buffer: Buffer; mimetype: string; extension: string }> {
    const { quality = 85, maxWidth = 1920, maxHeight = 1080, format = 'jpeg' } = options;

    try {
      let processedBuffer: Buffer;
      let outputMimetype: string;
      let outputExtension: string;

      if (mimetype === 'image/heic' || mimetype === 'image/heif' || mimetype === 'application/octet-stream') {
        try {
          processedBuffer = await this.convertHeicToJpeg(buffer);
          outputMimetype = 'image/jpeg';
          outputExtension = 'jpg';
        } catch (heicError) {
          // try to process as regular image if HEIC conversion fails
          processedBuffer = await this.processImageWithSharp(buffer, {
            quality,
            maxWidth,
            maxHeight,
            format,
          });

          outputMimetype = `image/${format}`;
          outputExtension = format === 'jpeg' ? 'jpg' : format;
        }
      } else {
        processedBuffer = await this.processImageWithSharp(buffer, {
          quality,
          maxWidth,
          maxHeight,
          format,
        });

        outputMimetype = `image/${format}`;
        outputExtension = format === 'jpeg' ? 'jpg' : format;
      }

      return {
        buffer: processedBuffer,
        mimetype: outputMimetype,
        extension: outputExtension,
      };
    } catch (error) {
      console.error('Image processing failed:', error);
      // Return original image if processing fails
      return {
        buffer,
        mimetype,
        extension: this.getExtensionFromMimetype(mimetype),
      };
    }
  }

  /**
   * Convert HEIC/HEIF image to JPEG using heic-convert
   */
  private async convertHeicToJpeg(buffer: Buffer): Promise<Buffer> {
    try {
      const jpegBuffer = await heicConvert({
        buffer,
        format: 'JPEG',
        quality: 0.85,
      });
      return jpegBuffer;
    } catch (error) {
      console.error('HEIC conversion failed:', error);
      throw new FileUploadException('Failed to convert HEIC image to JPEG');
    }
  }

  /**
   * Process image using Sharp for compression and resizing
   */
  private async processImageWithSharp(buffer: Buffer, options: ImageProcessingOptions): Promise<Buffer> {
    const { quality, maxWidth, maxHeight, format } = options;

    let sharpInstance = sharp(buffer);

    // Resize if dimensions exceed limits
    if (maxWidth || maxHeight) {
      sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    switch (format) {
      case 'jpeg':
        return await sharpInstance.jpeg({ quality, progressive: true }).toBuffer();

      case 'png':
        return await sharpInstance.png({ quality, progressive: true }).toBuffer();

      case 'webp':
        return await sharpInstance.webp({ quality, effort: 6 }).toBuffer();

      default:
        return await sharpInstance.jpeg({ quality, progressive: true }).toBuffer();
    }
  }

  private getExtensionFromMimetype(mimetype: string): string {
    const extensionMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/heic': 'heic',
      'image/heif': 'heif',
      'image/gif': 'gif',
      'image/bmp': 'bmp',
      'image/tiff': 'tiff',
    };

    return extensionMap[mimetype] || 'bin';
  }

  isImageMimeType(mimetype: string): boolean {
    return mimetype.startsWith('image/');
  }

  isHeicMimeType(mimetype: string): boolean {
    return HEIC_MIME_TYPES.includes(mimetype as any);
  }

  isImageExtension(extension: string): boolean {
    return IMAGE_EXTENSIONS.includes(extension.toLowerCase() as any);
  }

  isHeicExtension(extension: string): boolean {
    return HEIC_EXTENSIONS.includes(extension.toLowerCase() as any);
  }

  isImageFile(file: Express.Multer.File): boolean {
    if (this.isImageMimeType(file.mimetype)) {
      return true;
    }

    if (this.isHeicFile(file)) {
      return true;
    }

    const extension = this.getFileExtension(file.originalname);
    return this.isImageExtension(extension);
  }

  isHeicFile(file: Express.Multer.File): boolean {
    if (this.isHeicMimeType(file.mimetype)) {
      if (file.mimetype === 'application/octet-stream') {
        const extension = this.getFileExtension(file.originalname);
        return this.isHeicExtension(extension);
      }
      return true;
    }

    return false;
  }

  private getFileExtension(filename: string): string {
    if (!filename || !filename.includes('.')) {
      return '';
    }
    return filename.split('.').pop() || '';
  }

  /**
   * Get recommended processing options based on file type and size
   */
  getRecommendedOptions(mimetype: string, fileSize: number, bucket: FileBucket): ImageProcessingOptions {
    switch (bucket) {
      case FileBucket.LOGOS:
        return {
          quality: 85,
          maxWidth: 800,
          maxHeight: 800,
          format: 'png',
        };

      case FileBucket.AVATARS:
        return {
          quality: 85,
          maxWidth: 400,
          maxHeight: 400,
          format: 'jpeg',
        };

      default:
        return {
          quality: 85,
          maxWidth: 1920,
          maxHeight: 1080,
          format: 'jpeg',
        };
    }
  }
}
