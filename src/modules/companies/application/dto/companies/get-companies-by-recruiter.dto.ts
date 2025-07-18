import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IsUUID } from 'class-validator';

import { PaginationQueryDto } from '~shared/application/dto/pagination.dto';

export class GetCompaniesByRecruiterDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by company name', example: 'Google' })
  @IsOptional()
  @IsString()
  name?: string;
}

export class RecruiterProfileIdParamDto {
  @ApiProperty({ description: 'Recruiter profile id', example: 'uuid' })
  @IsUUID()
  recruiterProfileId: string;
}
