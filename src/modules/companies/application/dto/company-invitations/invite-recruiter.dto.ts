import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class InviteRecruiterDto {
  @IsEmail()
  email: string;

  @IsUUID()
  companyId: string;

  @IsString()
  roleId: string;

  @IsString()
  @IsOptional()
  message?: string;
}
