import { Inject, Injectable } from '@nestjs/common';

import { CreateUserDetailsDto } from '~modules/user-details/application/dto/create-user-details.dto';
import { ICreateUserDetailsUseCase } from '~modules/user-details/application/use-cases/create-user-details/create-user-details-use-case.interface';
import { UserDetailsDiToken } from '~modules/user-details/constants';
import { UserDetails } from '~modules/user-details/domain/entities/user-details.entity';
import { IUserDetailsRepository } from '~modules/user-details/domain/repositories/user-details-repository.interface';

import { Command } from '~shared/application/CQS/command.abstract';

@Injectable()
export class CreateUserDetailsUseCase extends Command<CreateUserDetailsDto, void> implements ICreateUserDetailsUseCase {
  constructor(
    @Inject(UserDetailsDiToken.USER_DETAILS_REPOSITORY)
    private readonly userDetailsRepository: IUserDetailsRepository,
  ) {
    super();
  }

  protected async implementation(): Promise<void> {
    const { userId, email, fullName, role } = this._input;

    const userDetails = UserDetails.builder(userId, email, role).fullName(fullName).build();
    await this.userDetailsRepository.create(userDetails);
  }
}
