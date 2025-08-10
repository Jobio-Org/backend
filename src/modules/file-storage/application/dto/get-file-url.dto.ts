import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetFileUrlDto {
  @ApiProperty({
    description: 'File ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  fileId: string;

  @ApiProperty({
    description: 'Expiration time in seconds (optional)',
    required: false,
    example: 3600,
  })
  @IsOptional()
  expiresIn?: number;
}
