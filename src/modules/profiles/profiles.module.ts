import { Module, forwardRef } from '@nestjs/common';

import { CompaniesModule } from '~modules/companies/companies.module';
import { CreateUserProfileUseCase } from '~modules/profiles/application/use-cases/create-user-profile/create-user-profile.use-case';
import { GetRecruiterProfileByEmailUseCase } from '~modules/profiles/application/use-cases/get-recruiter-profile-by-email/get-recruiter-profile-by-email.use-case';
import { GetRecruiterProfileUseCase } from '~modules/profiles/application/use-cases/get-recruiter-profile/get-recruiter-profile.use-case';
import { GetUserDetailsByIdUseCase } from '~modules/profiles/application/use-cases/get-user-details-by-id/get-user-details-by-id.use-case';
import { GetUserProfileWithAuthUseCase } from '~modules/profiles/application/use-cases/get-user-profile-with-auth/get-user-profile-with-auth.use-case';
import { UpdateCandidateProfileUseCase } from '~modules/profiles/application/use-cases/update-candidate-profile/update-candidate-profile.use-case';
import { UpdateRecruiterProfileUseCase } from '~modules/profiles/application/use-cases/update-recruiter-profile/update-recruiter-profile.use-case';
import { ProfilesDiToken } from '~modules/profiles/constants';
import { CandidateProfileMapper } from '~modules/profiles/domain/mappers/candidate-profile/candidate-profile.mapper';
import { RecruiterProfileMapper } from '~modules/profiles/domain/mappers/recruiter-profile/recruiter-profile.mapper';
import { UserDetailsMapper } from '~modules/profiles/domain/mappers/user-details/user-details.mapper';
import { ProfilesController } from '~modules/profiles/infrastructure/controllers/profiles/profiles.controller';
import { UserCreatedEventHandler } from '~modules/profiles/infrastructure/event-handlers/user-created.event-handler';
import { DrizzleCandidateProfileRepository } from '~modules/profiles/infrastructure/persistence/drizzle/repositories/drizzle-candidate-profile.repository';
import { DrizzleRecruiterProfileRepository } from '~modules/profiles/infrastructure/persistence/drizzle/repositories/drizzle-recruiter-profile.repository';
import { DrizzleUserDetailsRepository } from '~modules/profiles/infrastructure/persistence/drizzle/repositories/drizzle-user-details.repository';
import { ProfilesQueryService } from '~modules/profiles/infrastructure/services/profiles-query.service';
import { UserDetailsQueryService } from '~modules/profiles/infrastructure/services/user-details-query.service';

@Module({
  imports: [forwardRef(() => CompaniesModule)],
  providers: [
    UserDetailsMapper,
    CandidateProfileMapper,
    RecruiterProfileMapper,
    { provide: ProfilesDiToken.USER_DETAILS_REPOSITORY, useClass: DrizzleUserDetailsRepository },
    { provide: ProfilesDiToken.CANDIDATE_PROFILE_REPOSITORY, useClass: DrizzleCandidateProfileRepository },
    { provide: ProfilesDiToken.RECRUITER_PROFILE_REPOSITORY, useClass: DrizzleRecruiterProfileRepository },
    { provide: ProfilesDiToken.CREATE_USER_PROFILE_USE_CASE, useClass: CreateUserProfileUseCase },
    { provide: ProfilesDiToken.GET_USER_PROFILE_WITH_AUTH_USE_CASE, useClass: GetUserProfileWithAuthUseCase },
    { provide: ProfilesDiToken.UPDATE_CANDIDATE_PROFILE_USE_CASE, useClass: UpdateCandidateProfileUseCase },
    { provide: ProfilesDiToken.UPDATE_RECRUITER_PROFILE_USE_CASE, useClass: UpdateRecruiterProfileUseCase },
    { provide: ProfilesDiToken.GET_RECRUITER_PROFILE_BY_ID_USE_CASE, useClass: GetRecruiterProfileUseCase },
    { provide: ProfilesDiToken.GET_RECRUITER_PROFILE_BY_EMAIL_USE_CASE, useClass: GetRecruiterProfileByEmailUseCase },
    { provide: ProfilesDiToken.PROFILES_QUERY_SERVICE, useClass: ProfilesQueryService },
    { provide: ProfilesDiToken.USER_DETAILS_QUERY_SERVICE, useClass: UserDetailsQueryService },
    { provide: ProfilesDiToken.GET_USER_DETAILS_BY_USER_ID_USE_CASE, useClass: GetUserDetailsByIdUseCase },
    UserCreatedEventHandler,
  ],
  controllers: [ProfilesController],
  exports: [
    UserDetailsMapper,
    ProfilesDiToken.PROFILES_QUERY_SERVICE,
    ProfilesDiToken.USER_DETAILS_QUERY_SERVICE,
    ProfilesDiToken.GET_RECRUITER_PROFILE_BY_ID_USE_CASE,
    ProfilesDiToken.GET_RECRUITER_PROFILE_BY_EMAIL_USE_CASE,
    ProfilesDiToken.GET_USER_DETAILS_BY_USER_ID_USE_CASE,
    UserCreatedEventHandler,
  ],
})
export class ProfilesModule {}
