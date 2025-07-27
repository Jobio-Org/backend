import { UserDetails } from '~modules/user-details/domain/entities/user-details.entity';

import { type UserRole } from '~shared/domain/enums/user-role.enum';
import { type IDataAccessMapper } from '~shared/domain/mappers/data-access-mapper.interface';

export interface IUserDetailsDataAccess {
  id: string;
  userId: string;
  email: string;
  fullName: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserDetailsMapper implements IDataAccessMapper<UserDetails, IUserDetailsDataAccess> {
  toDomain(persistence: IUserDetailsDataAccess): UserDetails {
    return UserDetails.builder(persistence.userId, persistence.email, persistence.role as UserRole)
      .id(persistence.id)
      .fullName(persistence.fullName)
      .createdAt(persistence.createdAt)
      .updatedAt(persistence.updatedAt)
      .build();
  }

  toPersistence(entity: UserDetails): IUserDetailsDataAccess {
    return {
      id: entity.id,
      userId: entity.userId,
      email: entity.email,
      fullName: entity.fullName || null,
      role: entity.role,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
