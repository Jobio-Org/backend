import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';

import { CompanyCategoryDto } from '~modules/companies/application/dto/company-categories/company-category.dto';

export class UpdateCompanyDto {
  @ApiProperty({
    description: 'Company name',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  name?: string;

  @ApiProperty({
    description: 'Company description',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  description?: string;

  @ApiProperty({
    description: 'Company website URL',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  website?: string;

  @ApiProperty({
    description: 'Company size',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  size?: string;

  @ApiProperty({
    description: 'Company location',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  location?: string;

  @ApiProperty({
    description: 'Company categories',
    type: [CompanyCategoryDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompanyCategoryDto)
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;

    const parseItem = (item: any) => {
      if (typeof item === 'string') {
        try {
          item = JSON.parse(item);
        } catch {
          return undefined;
        }
      }
      return plainToInstance(CompanyCategoryDto, item);
    };

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.map(parseItem);
        }
        return [parseItem(parsed)];
      } catch {
        return undefined;
      }
    }

    if (Array.isArray(value)) {
      return value.map(parseItem);
    }

    return value;
  })
  categories?: CompanyCategoryDto[];

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Company logo file',
    required: false,
  })
  @IsOptional()
  logo?: Express.Multer.File;
}
