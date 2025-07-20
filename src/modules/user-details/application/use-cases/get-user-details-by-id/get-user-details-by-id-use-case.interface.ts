import { type UserDetails } from '~modules/user-details/domain/entities/user-details.entity';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

import { type GetUserDetailsByIdDto } from '../../dto/get-user-details-by-id.dto';

export interface IGetUserDetailsByIdUseCase extends IUseCase<GetUserDetailsByIdDto, UserDetails | null> {}
