import { Inject, Injectable } from '@nestjs/common';
import { IUserDetailsQueryService } from '~modules/profiles/application/services/user-details-query-service.interface';
import { UserDetails } from '~modules/profiles/domain/entities/user-details.entity';
import { ProfilesDiToken } from '~modules/profiles/constants';
import { IGetUserDetailsByIdUseCase } from '~modules/profiles/application/use-cases/get-user-details-by-id/ger-user-details-by-id-use-case.interface';

@Injectable()
export class UserDetailsQueryService implements IUserDetailsQueryService {
  constructor(
    @Inject(ProfilesDiToken.GET_USER_DETAILS_BY_USER_ID_USE_CASE)
    private readonly getUserDetailsByUserIdUseCase: IGetUserDetailsByIdUseCase,
  ) {}

  async getUserDetailsByUserId(userId: string): Promise<UserDetails | null> {
    return this.getUserDetailsByUserIdUseCase.execute({ id: userId });
  }
} 