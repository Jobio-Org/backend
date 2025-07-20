import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { UserRole } from '~shared/domain/enums/user-role.enum';

export class CreateUserDetailsDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsEnum(UserRole)
  role: UserRole;
}
