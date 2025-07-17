import { type Session, type SupabaseClient, type User } from '@supabase/supabase-js';

import { type SupabaseAccessTokenJwtPayload } from '~modules/auth/infrastructure/supabase/mappers/access-token-jwt-payload/supabase-access-token-jwt-payload.mapper';

export interface IAuthResult {
  accessTokenPayload?: SupabaseAccessTokenJwtPayload;
  user: User | null;
  session: Session | null;
  accessToken?: string;
  authorizedClient?: SupabaseClient;
}
// from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/48317a932144cd7976a75edd79eaf73210aa603e/types/passport-jwt/index.d.ts#L108
export interface JwtFromRequestFunction<T = any> {
  (req: T): string | null;
}

export interface ISupabaseClientOptions {
  supabaseUrl: string;
  supabaseKey: string;
}
