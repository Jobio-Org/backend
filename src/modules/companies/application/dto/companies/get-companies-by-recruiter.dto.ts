import { PaginationQueryDto } from '~shared/application/dto/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetCompaniesByRecruiterDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by company name', example: 'Google' })
  @IsOptional()
  @IsString()
  name?: string;
} 