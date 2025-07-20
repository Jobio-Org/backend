import { Module, forwardRef } from '@nestjs/common';

import { CompaniesModule } from '~modules/companies/companies.module';
import { CreateRecruiterProfileUseCase } from '~modules/recruiter-profile/application/use-cases/create-recruiter-profile/create-recruiter-profile.use-case';
import { GetRecruiterProfileByEmailUseCase } from '~modules/recruiter-profile/application/use-cases/get-recruiter-profile-by-email/get-recruiter-profile-by-email.use-case';
import { GetRecruiterProfileUseCase } from '~modules/recruiter-profile/application/use-cases/get-recruiter-profile/get-recruiter-profile.use-case';
import { UpdateRecruiterProfileUseCase } from '~modules/recruiter-profile/application/use-cases/update-recruiter-profile/update-recruiter-profile.use-case';
import { RecruiterProfileDiToken } from '~modules/recruiter-profile/constants';
import { RecruiterProfileMapper } from '~modules/recruiter-profile/domain/mappers/recruiter-profile/recruiter-profile.mapper';
import { RecruiterProfileController } from '~modules/recruiter-profile/infrastructure/controllers/recruiter-profile.controller';
import { UserDetailsCreatedEventHandler } from '~modules/recruiter-profile/infrastructure/event-handlers/user-created.event-handler';
import { DrizzleRecruiterProfileRepository } from '~modules/recruiter-profile/infrastructure/persistence/drizzle/repositories/drizzle-recruiter-profile.repository';
import { RecruiterProfileQueryService } from '~modules/recruiter-profile/infrastructure/services/recruiter-profile-query.service';
import { UserDetailsModule } from '~modules/user-details/user-details.module';

@Module({
  imports: [UserDetailsModule, forwardRef(() => CompaniesModule)],
  controllers: [RecruiterProfileController],
  providers: [
    RecruiterProfileMapper,
    { provide: RecruiterProfileDiToken.RECRUITER_PROFILE_REPOSITORY, useClass: DrizzleRecruiterProfileRepository },
    { provide: RecruiterProfileDiToken.CREATE_RECRUITER_PROFILE_USE_CASE, useClass: CreateRecruiterProfileUseCase },
    { provide: RecruiterProfileDiToken.GET_RECRUITER_PROFILE_BY_ID_USE_CASE, useClass: GetRecruiterProfileUseCase },
    {
      provide: RecruiterProfileDiToken.GET_RECRUITER_PROFILE_BY_EMAIL_USE_CASE,
      useClass: GetRecruiterProfileByEmailUseCase,
    },
    { provide: RecruiterProfileDiToken.UPDATE_RECRUITER_PROFILE_USE_CASE, useClass: UpdateRecruiterProfileUseCase },
    { provide: RecruiterProfileDiToken.RECRUITER_PROFILE_QUERY_SERVICE, useClass: RecruiterProfileQueryService },
    UserDetailsCreatedEventHandler,
  ],
  exports: [RecruiterProfileMapper, RecruiterProfileDiToken.RECRUITER_PROFILE_QUERY_SERVICE],
})
export class RecruiterProfileModule {}
