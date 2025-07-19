import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ContainsNoEmoji } from '~core/validation/domain/validators/contains-no-emoji/contains-no-emoji.decorator';

import { IEmailPasswordCredentials } from 'src/lib/passport-supabase/strategies/credentials-login';

export class SignInCredentialsDto implements IEmailPasswordCredentials {
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
}
