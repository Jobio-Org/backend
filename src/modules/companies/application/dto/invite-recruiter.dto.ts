import { IsArray, IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class InviteRecruiterDto {
  @IsEmail()
  email: string;

  @IsUUID()
  companyId: string;

  @IsString()
  roleId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];

  @IsString()
  @IsOptional()
  message?: string;
}
