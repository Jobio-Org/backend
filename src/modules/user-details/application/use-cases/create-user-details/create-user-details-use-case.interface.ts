import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

import { type CreateUserDetailsDto } from '../../dto/create-user-details.dto';

export interface ICreateUserDetailsUseCase extends IUseCase<CreateUserDetailsDto, void> {}
