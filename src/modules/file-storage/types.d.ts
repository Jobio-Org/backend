import { type File } from './domain/entities/file.entity';

declare global {
  declare namespace Express {
    export interface Request {
      file?: Multer.File;
      files?: Multer.File[];
    }
  }
}

export interface MulterFile extends Multer.File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}
