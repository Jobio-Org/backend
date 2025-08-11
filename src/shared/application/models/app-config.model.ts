import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class AppConfigModel {
  @IsString()
  DB_URL: string;

  @IsString()
  @IsOptional()
  DB_URL_TEST: string;

  @IsString()
  SUPABASE_URL: string;

  @IsString()
  @IsOptional()
  SUPABASE_URL_TEST: string;

  @IsString()
  SUPABASE_SECRET_KEY: string;

  @IsString()
  @IsOptional()
  SUPABASE_SECRET_KEY_TEST: string;

  @IsString()
  GOOGLE_OAUTH_CLIENT_ID: string;

  @IsString()
  GOOGLE_OAUTH_SECRET: string;

  @IsString()
  GOOGLE_OAUTH_CALLBACK_URL: string;

  @IsString()
  PASSWORD_RESET_REDIRECT_URL: string;

  @IsInt()
  @IsPositive()
  PASSWORD_RECOVERY_TIME: number;

  @IsString()
  CLIENT_AUTH_REDIRECT_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  SMTP_USER: string;

  @IsString()
  SMTP_HOST: string;

  @IsInt()
  @IsPositive()
  SMTP_PORT: number;

  @IsString()
  SMTP_PASS: string;

  @IsString()
  CLIENT_INVITE_REDIRECT_URL: string;

  @IsInt()
  @IsPositive()
  COMPANY_INVITATION_EXPIRE_TIME: number;

  @IsString()
  REDIS_URL: string;

  @IsInt()
  @IsPositive()
  THROTTLE_TTL: number;

  @IsInt()
  @IsPositive()
  THROTTLE_LIMIT: number;
}
