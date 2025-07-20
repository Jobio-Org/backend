import { Inject, Injectable } from '@nestjs/common';

import { IUserDetailsQueryService } from '~modules/user-details/application/services/user-details-query-service.interface';
import { IGetUserDetailsByIdUseCase } from '~modules/user-details/application/use-cases/get-user-details-by-id/get-user-details-by-id-use-case.interface';
import { UserDetailsDiToken } from '~modules/user-details/constants';
import { UserDetails } from '~modules/user-details/domain/entities/user-details.entity';

@Injectable()
export class UserDetailsQueryService implements IUserDetailsQueryService {
  constructor(
    @Inject(UserDetailsDiToken.GET_USER_DETAILS_BY_ID_USE_CASE)
    private readonly getUserDetailsByUserIdUseCase: IGetUserDetailsByIdUseCase,
  ) {}

  async getUserDetailsByUserId(userId: string): Promise<UserDetails | null> {
    return this.getUserDetailsByUserIdUseCase.execute({ userId });
  }
}
