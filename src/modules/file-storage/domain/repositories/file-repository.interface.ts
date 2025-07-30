import { type File } from '../entities/file.entity';
import { type FileBucket } from '../enums/file-type.enum';

export interface IFileRepository {
  create(file: File): Promise<File>;
  findById(id: string): Promise<File | null>;
  findByPath(path: string): Promise<File | null>;
  findByBucket(bucket: FileBucket): Promise<File[]>;
  findAll(): Promise<File[]>;
  update(file: File): Promise<File>;
  delete(id: string): Promise<void>;
  existsByPath(path: string): Promise<boolean>;
}
