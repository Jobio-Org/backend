import { type UpdateUserEmailDto } from '~modules/auth/application/dto/update-user-email.dto';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

export type IChangeEmailUseCase = IUseCase<UpdateUserEmailDto>;
