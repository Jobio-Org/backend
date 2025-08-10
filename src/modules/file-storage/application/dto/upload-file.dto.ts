import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { FileBucket } from '../../domain/enums/file-type.enum';

export class UploadFileDto {
  @ApiProperty({
    description: 'Original file name',
    example: 'profile-photo.jpg',
  })
  @IsString()
  originalName: string;

  @ApiProperty({
    description: 'File MIME type',
    example: 'image/jpeg',
  })
  @IsString()
  mimeType: string;

  @ApiProperty({
    description: 'Storage bucket for the file',
    enum: FileBucket,
    example: FileBucket.AVATARS,
  })
  @IsEnum(FileBucket)
  bucket: FileBucket;
}
