import { type SignUpCredentialsDto } from '~modules/auth/application/dto/sign-up-credentials.dto';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

export interface ISignUpByEmailPasswordUseCase extends IUseCase<SignUpCredentialsDto, void> {}
