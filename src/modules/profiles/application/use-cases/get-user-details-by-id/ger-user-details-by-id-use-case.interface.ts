import { type UserDetails } from '~modules/profiles/domain/entities/user-details.entity';

import { type Query } from '~shared/application/CQS/query.abstract';

export interface IGetUserDetailsByIdUseCase extends Query<{ id: string }, UserDetails | null> {}
