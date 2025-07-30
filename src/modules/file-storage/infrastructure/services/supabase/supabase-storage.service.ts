import { Inject, Injectable } from '@nestjs/common';

import { SupabaseClientService } from '~modules/auth/infrastructure/supabase/services/supabase-client/supabase-client.service';

import { IFileStorageService } from '../../../application/services/file-storage.service';
import { FileStorageDiToken } from '../../../constants';
import { File } from '../../../domain/entities/file.entity';
import { FileBucket } from '../../../domain/enums/file-type.enum';
import { IFileRepository } from '../../../domain/repositories/file-repository.interface';
import { FilePath } from '../../../domain/value-objects/file-path.value-object';

@Injectable()
export class SupabaseStorageService implements IFileStorageService {
  constructor(
    private readonly supabaseClientService: SupabaseClientService,
    @Inject(FileStorageDiToken.FILE_REPOSITORY)
    private readonly fileRepository: IFileRepository,
  ) {}

  async uploadFile(file: Express.Multer.File, bucket: FileBucket): Promise<File> {
    try {
      const supabase = this.supabaseClientService.client;

      // Generate unique filename
      const fileExtension = file.originalname.split('.').pop();
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const filePath = `${bucket}/${uniqueFileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from(bucket).upload(uniqueFileName, file.buffer, {
        contentType: file.mimetype,
      });

      if (error) {
        throw new Error(`Failed to upload file to Supabase: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(uniqueFileName);

      // Create file entity
      const fileEntity = File.builder(
        uniqueFileName,
        file.originalname,
        FilePath.create(filePath),
        file.mimetype,
        bucket,
      )
        .url(urlData.publicUrl)
        .build();

      // Save to database
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
        throw new Error('File not found');
      }

      const supabase = this.supabaseClientService.client;

      // Delete from Supabase Storage
      const { error } = await supabase.storage.from(file.bucket).remove([file.name]);

      if (error) {
        throw new Error(`Failed to delete file from Supabase: ${error.message}`);
      }

      // Delete from database
      await this.fileRepository.delete(fileId);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async getFileUrl(fileId: string, expiresIn?: number): Promise<string> {
    try {
      const file = await this.fileRepository.findById(fileId);
      if (!file) {
        throw new Error('File not found');
      }

      const supabase = this.supabaseClientService.client;

      if (expiresIn) {
        // Generate signed URL
        const { data, error } = await supabase.storage.from(file.bucket).createSignedUrl(file.name, expiresIn);

        if (error) {
          throw new Error(`Failed to create signed URL: ${error.message}`);
        }

        return data.signedUrl;
      } else {
        // Return public URL
        const { data } = supabase.storage.from(file.bucket).getPublicUrl(file.name);

        return data.publicUrl;
      }
    } catch (error) {
      throw new Error(`Failed to get file URL: ${error.message}`);
    }
  }

  async getFileById(fileId: string): Promise<File> {
    const file = await this.fileRepository.findById(fileId);
    if (!file) {
      throw new Error('File not found');
    }
    return file;
  }

  async listFiles(bucket?: FileBucket): Promise<File[]> {
    if (bucket) {
      return await this.fileRepository.findByBucket(bucket);
    }
    return await this.fileRepository.findAll();
  }
}
