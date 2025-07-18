import { type UserDetails } from '~modules/profiles/domain/entities/user-details.entity';

export interface IUserDetailsQueryService {
  getUserDetailsByUserId(userId: string): Promise<UserDetails | null>;
}
