import { Module } from '@nestjs/common';

import { CreateCandidateProfileUseCase } from '~modules/candidate-profile/application/use-cases/create-candidate-profile/create-candidate-profile.use-case';
import { UpdateCandidateProfileUseCase } from '~modules/candidate-profile/application/use-cases/update-candidate-profile/update-candidate-profile.use-case';
import { CandidateProfileDiToken } from '~modules/candidate-profile/constants';
import { CandidateProfileMapper } from '~modules/candidate-profile/domain/mappers/candidate-profile/candidate-profile.mapper';
import { CandidateProfileController } from '~modules/candidate-profile/infrastructure/controllers/candidate-profile.controller';
import { UserDetailsCreatedEventHandler } from '~modules/candidate-profile/infrastructure/event-handlers/user-created.event-handler';
import { DrizzleCandidateProfileRepository } from '~modules/candidate-profile/infrastructure/persistence/drizzle/repositories/drizzle-candidate-profile.repository';
import { CandidateProfileQueryService } from '~modules/candidate-profile/infrastructure/services/candidate-profile-query.service';
import { UserDetailsModule } from '~modules/user-details/user-details.module';

@Module({
  imports: [UserDetailsModule],
  controllers: [CandidateProfileController],
  providers: [
    CandidateProfileMapper,
    { provide: CandidateProfileDiToken.CANDIDATE_PROFILE_REPOSITORY, useClass: DrizzleCandidateProfileRepository },
    { provide: CandidateProfileDiToken.CREATE_CANDIDATE_PROFILE_USE_CASE, useClass: CreateCandidateProfileUseCase },
    { provide: CandidateProfileDiToken.UPDATE_CANDIDATE_PROFILE_USE_CASE, useClass: UpdateCandidateProfileUseCase },
    { provide: CandidateProfileDiToken.CANDIDATE_PROFILE_QUERY_SERVICE, useClass: CandidateProfileQueryService },
    UserDetailsCreatedEventHandler,
  ],
  exports: [CandidateProfileMapper, CandidateProfileDiToken.CANDIDATE_PROFILE_QUERY_SERVICE],
})
export class CandidateProfileModule {}
