import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '~shared/application/dto/pagination.dto';

export class GetAllSubCategoriesDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by subcategory name', example: 'Frontend' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by categoryId', example: 'uuid-category' })
  @IsOptional()
  @IsString()
  categoryId?: string;
}
