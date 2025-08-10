import { Inject, Injectable } from '@nestjs/common';

import { SupabaseClientService } from '~modules/auth/infrastructure/supabase/services/supabase-client/supabase-client.service';
import { FileNotFoundException } from '~modules/file-storage/application/exceptions/file-not-found.exception';
import { FileUploadException } from '~modules/file-storage/application/exceptions/file-upload.exception';
import { IFileStorageService } from '~modules/file-storage/application/services/file-storage.service';
import { FileStorageDiToken } from '~modules/file-storage/constants';
import { File } from '~modules/file-storage/domain/entities/file.entity';
import { FileBucket } from '~modules/file-storage/domain/enums/file-type.enum';
import { IFileRepository } from '~modules/file-storage/domain/repositories/file-repository.interface';
import { FilePath } from '~modules/file-storage/domain/value-objects/file-path.value-object';
import {
  ImageProcessingOptions,
  ImageProcessingService,
} from '~modules/file-storage/infrastructure/services/image-processing/image-processing.service';

@Injectable()
export class SupabaseStorageService implements IFileStorageService {
  constructor(
    private readonly supabaseClientService: SupabaseClientService,
    @Inject(FileStorageDiToken.FILE_REPOSITORY)
    private readonly fileRepository: IFileRepository,
    @Inject(FileStorageDiToken.IMAGE_PROCESSING_SERVICE)
    private readonly imageProcessingService: ImageProcessingService,
  ) {}

  async uploadFile(file: Express.Multer.File, bucket: FileBucket): Promise<File> {
    return this.uploadFileWithProcessing(file, bucket);
  }

  async uploadFileWithProcessing(
    file: Express.Multer.File,
    bucket: FileBucket,
    processingOptions?: ImageProcessingOptions,
  ): Promise<File> {
    try {
      const supabase = this.supabaseClientService.client;

      let uploadBuffer = file.buffer;
      let uploadMimetype = file.mimetype;
      let fileExtension = file.originalname.split('.').pop();

      if (this.imageProcessingService.isImageFile(file)) {
        const recommendedOptions = this.imageProcessingService.getRecommendedOptions(file.mimetype, file.size, bucket);

        const finalOptions = { ...recommendedOptions, ...processingOptions };

        const processed = await this.imageProcessingService.processImage(file.buffer, file.mimetype, finalOptions);

        uploadBuffer = processed.buffer;
        uploadMimetype = processed.mimetype;
        fileExtension = processed.extension;
      }

      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const filePath = `${bucket}/${uniqueFileName}`;

      const { error } = await supabase.storage.from(bucket).upload(uniqueFileName, uploadBuffer, {
        contentType: uploadMimetype,
      });

      if (error) {
        throw new FileUploadException(`Failed to upload file to Supabase: ${error.message}`);
      }

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(uniqueFileName);

      const fileEntity = File.builder(
        uniqueFileName,
        file.originalname,
        FilePath.create(filePath),
        uploadMimetype,
        bucket,
      )
        .url(urlData.publicUrl)
        .build();

      const savedFile = await this.fileRepository.create(fileEntity);

      return savedFile;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      const file = await this.fileRepository.findById(fileId);
      if (!file) {
        throw new FileNotFoundException('File not found');
      }

      const supabase = this.supabaseClientService.client;

      const { error } = await supabase.storage.from(file.bucket).remove([file.name]);

      if (error) {
        throw new Error(`Failed to delete file from Supabase: ${error.message}`);
      }

      await this.fileRepository.delete(fileId);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async getFileUrl(fileId: string, expiresIn?: number): Promise<string> {
    try {
      const file = await this.fileRepository.findById(fileId);
      if (!file) {
        throw new FileNotFoundException('File not found');
      }

      const supabase = this.supabaseClientService.client;

      if (expiresIn) {
        const { data, error } = await supabase.storage.from(file.bucket).createSignedUrl(file.name, expiresIn);

        if (error) {
          throw new Error(`Failed to create signed URL: ${error.message}`);
        }

        return data.signedUrl;
      } else {
        const { data } = supabase.storage.from(file.bucket).getPublicUrl(file.name);

        return data.publicUrl;
      }
    } catch (error) {
      throw new Error(`Failed to get file URL: ${error.message}`);
    }
  }
}
