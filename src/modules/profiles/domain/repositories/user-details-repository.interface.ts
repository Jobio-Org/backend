import { type UserDetails } from '~modules/profiles/domain/entities/user-details.entity';

import { type UserRole } from '~shared/domain/enums/user-role.enum';
import { type IBaseRepository } from '~shared/domain/repositories/base-repository.interface';

export interface IUserDetailsRepository extends IBaseRepository<UserDetails, string> {
  findByUserId(userId: string): Promise<UserDetails | null>;
  findByRole(role: UserRole): Promise<UserDetails[]>;
  findByEmail(email: string): Promise<UserDetails | null>;
}
