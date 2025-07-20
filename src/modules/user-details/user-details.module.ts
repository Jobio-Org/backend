import { Module } from '@nestjs/common';

import { CreateUserDetailsUseCase } from '~modules/user-details/application/use-cases/create-user-details/create-user-details.use-case';
import { GetUserDetailsByIdUseCase } from '~modules/user-details/application/use-cases/get-user-details-by-id/get-user-details-by-id.use-case';
import { UserDetailsDiToken } from '~modules/user-details/constants';
import { UserDetailsMapper } from '~modules/user-details/domain/mappers/user-details/user-details.mapper';
import { UserCreatedEventHandler } from '~modules/user-details/infrastructure/event-handlers/user-created.event-handler';
import { DrizzleUserDetailsRepository } from '~modules/user-details/infrastructure/persistence/drizzle/repositories/drizzle-user-details.repository';
import { UserDetailsQueryService } from '~modules/user-details/infrastructure/services/user-details-query.service';

@Module({
  providers: [
    UserDetailsMapper,
    { provide: UserDetailsDiToken.USER_DETAILS_REPOSITORY, useClass: DrizzleUserDetailsRepository },
    { provide: UserDetailsDiToken.CREATE_USER_DETAILS_USE_CASE, useClass: CreateUserDetailsUseCase },
    { provide: UserDetailsDiToken.GET_USER_DETAILS_BY_ID_USE_CASE, useClass: GetUserDetailsByIdUseCase },
    { provide: UserDetailsDiToken.USER_DETAILS_QUERY_SERVICE, useClass: UserDetailsQueryService },
    UserCreatedEventHandler,
  ],
  exports: [
    UserDetailsMapper,
    UserDetailsDiToken.USER_DETAILS_REPOSITORY,
    UserDetailsDiToken.CREATE_USER_DETAILS_USE_CASE,
    UserDetailsDiToken.GET_USER_DETAILS_BY_ID_USE_CASE,
    UserDetailsDiToken.USER_DETAILS_QUERY_SERVICE,
  ],
})
export class UserDetailsModule {}
