import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '~shared/application/dto/pagination.dto';

export class GetAllCategoriesDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by category name', example: 'IT' })
  @IsOptional()
  @IsString()
  name?: string;
}
