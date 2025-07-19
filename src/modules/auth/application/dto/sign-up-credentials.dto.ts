import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ContainsNoEmoji } from '~core/validation/domain/validators/contains-no-emoji/contains-no-emoji.decorator';

import { UserRole } from '~shared/domain/enums/user-role.enum';

import { IEmailPasswordCredentials } from 'src/lib/passport-supabase/strategies/credentials-login';

export interface IEmailPasswordRegistrationCredentials extends IEmailPasswordCredentials {
  role: UserRole;
}

export class SignUpCredentialsDto implements IEmailPasswordRegistrationCredentials {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255, {
    message: 'Email must not exceed 255 characters',
  })
  @ContainsNoEmoji()
  public email: string;

  @IsString()
  @MaxLength(255, {
    message: 'Password must not exceed 255 characters',
  })
  public password: string;

  @IsEnum(UserRole)
  public role: UserRole;
}
