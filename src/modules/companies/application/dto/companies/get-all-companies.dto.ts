import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '~shared/application/dto/pagination.dto';

export class GetAllCompaniesDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by company name', example: 'Google' })
  @IsOptional()
  @IsString()
  name?: string;
}
 