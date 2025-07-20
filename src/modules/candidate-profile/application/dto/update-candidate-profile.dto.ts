import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCandidateProfileDto {
  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsNumber()
  experience?: number;

  @IsOptional()
  @IsNumber()
  salaryExpectations?: number;

  @IsOptional()
  @IsString()
  englishLevel?: string;

  @IsOptional()
  @IsString()
  experienceDescription?: string;

  @IsOptional()
  @IsString()
  accomplishmentsDescription?: string;

  @IsOptional()
  @IsString()
  expectationsDescription?: string;

  @IsOptional()
  @IsString()
  employmentOptions?: string;

  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @IsOptional()
  @IsString()
  preferredCommunication?: string;
}
