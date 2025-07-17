import { Inject, Injectable } from '@nestjs/common';

import { ProfilesDiToken } from '~modules/profiles/constants';
import { UserDetails } from '~modules/profiles/domain/entities/user-details.entity';
import { IUserDetailsRepository } from '~modules/profiles/domain/repositories/user-details-repository.interface';

import { Query } from '~shared/application/CQS/query.abstract';

import { IGetUserDetailsByIdUseCase } from './ger-user-details-by-id-use-case.interface';

@Injectable()
export class GetUserDetailsByIdUseCase
  extends Query<{ id: string }, UserDetails | null>
  implements IGetUserDetailsByIdUseCase
{
  constructor(
    @Inject(ProfilesDiToken.USER_DETAILS_REPOSITORY) private readonly userDetailsRepository: IUserDetailsRepository,
  ) {
    super();
  }

  protected async implementation(): Promise<UserDetails | null> {
    const { id } = this._input;
    
    return this.userDetailsRepository.findByUserId(id);
  }
}
