import { Inject, Injectable } from '@nestjs/common';

import { GetUserDetailsByIdDto } from '~modules/user-details/application/dto/get-user-details-by-id.dto';
import { IGetUserDetailsByIdUseCase } from '~modules/user-details/application/use-cases/get-user-details-by-id/get-user-details-by-id-use-case.interface';
import { UserDetailsDiToken } from '~modules/user-details/constants';
import { UserDetails } from '~modules/user-details/domain/entities/user-details.entity';
import { IUserDetailsRepository } from '~modules/user-details/domain/repositories/user-details-repository.interface';

import { Query } from '~shared/application/CQS/query.abstract';

@Injectable()
export class GetUserDetailsByIdUseCase
  extends Query<GetUserDetailsByIdDto, UserDetails | null>
  implements IGetUserDetailsByIdUseCase
{
  constructor(
    @Inject(UserDetailsDiToken.USER_DETAILS_REPOSITORY)
    private readonly userDetailsRepository: IUserDetailsRepository,
  ) {
    super();
  }

  protected async implementation(): Promise<UserDetails | null> {
    const { userId } = this._input;

    return this.userDetailsRepository.findByUserId(userId);
  }
}
