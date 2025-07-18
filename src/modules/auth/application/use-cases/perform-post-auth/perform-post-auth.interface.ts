import { type User } from '~modules/auth/domain/entities/user.entity';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

export interface IPerformPostAuthPayload {
  user: User;
}

export interface IPerformPostAuthUseCase extends IUseCase<IPerformPostAuthPayload, void> {}
