import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RecruiterProfileIdParamDto {
  @ApiProperty({ description: 'Recruiter profile id', example: 'uuid' })
  @IsUUID()
  recruiterProfileId: string;
} 