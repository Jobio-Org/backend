import { Inject, Injectable } from '@nestjs/common';

import { CreateCandidateProfileDto } from '~modules/candidate-profile/application/dto/create-candidate-profile.dto';
import { ICreateCandidateProfileUseCase } from '~modules/candidate-profile/application/use-cases/create-candidate-profile/create-candidate-profile-use-case.interface';
import { CandidateProfileDiToken } from '~modules/candidate-profile/constants';
import { CandidateProfile } from '~modules/candidate-profile/domain/entities/candidate-profile.entity';
import { ICandidateProfileRepository } from '~modules/candidate-profile/domain/repositories/candidate-profile-repository.interface';

import { Command } from '~shared/application/CQS/command.abstract';

@Injectable()
export class CreateCandidateProfileUseCase
  extends Command<CreateCandidateProfileDto, void>
  implements ICreateCandidateProfileUseCase
{
  constructor(
    @Inject(CandidateProfileDiToken.CANDIDATE_PROFILE_REPOSITORY)
    private readonly candidateProfileRepository: ICandidateProfileRepository,
  ) {
    super();
  }

  protected async implementation(): Promise<void> {
    const { userDetailsId } = this._input;

    const candidateProfile = CandidateProfile.builder(userDetailsId).build();
    await this.candidateProfileRepository.create(candidateProfile);
  }
}
