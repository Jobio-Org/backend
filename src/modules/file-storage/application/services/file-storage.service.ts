import { Injectable } from '@nestjs/common';

import { File } from '../../domain/entities/file.entity';
import { FileBucket } from '../../domain/enums/file-type.enum';
import { FilePath } from '../../domain/value-objects/file-path.value-object';

export interface IFileStorageService {
  uploadFile(file: Express.Multer.File, bucket: FileBucket): Promise<File>;

  deleteFile(fileId: string): Promise<void>;

  getFileUrl(fileId: string, expiresIn?: number): Promise<string>;

  getFileById(fileId: string): Promise<File>;

  listFiles(bucket?: FileBucket): Promise<File[]>;
}

@Injectable()
export class FileStorageService implements IFileStorageService {
  async uploadFile(file: Express.Multer.File, bucket: FileBucket): Promise<File> {
    // Implementation will be provided by SupabaseStorageService
    throw new Error('Method not implemented.');
  }

  async deleteFile(fileId: string): Promise<void> {
    // Implementation will be provided by SupabaseStorageService
    throw new Error('Method not implemented.');
  }

  async getFileUrl(fileId: string, expiresIn?: number): Promise<string> {
    // Implementation will be provided by SupabaseStorageService
    throw new Error('Method not implemented.');
  }

  async getFileById(fileId: string): Promise<File> {
    // Implementation will be provided by SupabaseStorageService
    throw new Error('Method not implemented.');
  }

  async listFiles(bucket?: FileBucket): Promise<File[]> {
    // Implementation will be provided by SupabaseStorageService
    throw new Error('Method not implemented.');
  }
}
