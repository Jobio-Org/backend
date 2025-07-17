import { type User } from '~modules/auth/domain/entities/user.entity';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

export interface IResetPasswordPayload {
  user: User;
  newPassword: string;
}

export interface IResetPasswordUseCase extends IUseCase<IResetPasswordPayload> {}
