import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { FileBucket } from '../../domain/enums/file-type.enum';

export class ListFilesDto {
  @ApiProperty({
    description: 'Storage bucket to filter files',
    enum: FileBucket,
    required: false,
    example: FileBucket.AVATARS,
  })
  @IsOptional()
  @IsEnum(FileBucket)
  bucket?: FileBucket;
}
