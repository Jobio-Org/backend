import { Inject, Injectable } from '@nestjs/common';

import { UpdateCandidateProfileDto } from '~modules/candidate-profile/application/dto/update-candidate-profile.dto';
import { IUpdateCandidateProfileUseCase } from '~modules/candidate-profile/application/use-cases/update-candidate-profile/update-candidate-profile-use-case.interface';
import { CandidateProfileDiToken } from '~modules/candidate-profile/constants';
import { ICandidateProfileRepository } from '~modules/candidate-profile/domain/repositories/candidate-profile-repository.interface';
import { UserDetailsDiToken } from '~modules/user-details/constants';
import { IUserDetailsRepository } from '~modules/user-details/domain/repositories/user-details-repository.interface';

import { Command } from '~shared/application/CQS/command.abstract';

@Injectable()
export class UpdateCandidateProfileUseCase
  extends Command<UpdateCandidateProfileDto & { userId: string }, void>
  implements IUpdateCandidateProfileUseCase
{
  constructor(
    @Inject(UserDetailsDiToken.USER_DETAILS_REPOSITORY)
    private readonly userDetailsRepository: IUserDetailsRepository,
    @Inject(CandidateProfileDiToken.CANDIDATE_PROFILE_REPOSITORY)
    private readonly candidateProfileRepository: ICandidateProfileRepository,
  ) {
    super();
  }

  protected async implementation(): Promise<void> {
    const { userId, ...updateData } = this._input;

    const userDetails = await this.userDetailsRepository.findByUserId(userId);
    if (!userDetails) {
      throw new Error('User details not found');
    }

    if (userDetails.role !== 'candidate') {
      throw new Error('User is not a candidate');
    }

    const candidateProfile = await this.candidateProfileRepository.findByUserDetailsId(userDetails.id);
    if (!candidateProfile) {
      throw new Error('Candidate profile not found');
    }

    const updatedProfile = new (candidateProfile.constructor as any)(
      candidateProfile.id,
      candidateProfile.userDetailsId,
      updateData.position ?? candidateProfile.position,
      updateData.skills ?? candidateProfile.skills,
      updateData.experience ?? candidateProfile.experience,
      updateData.salaryExpectations ?? candidateProfile.salaryExpectations,
      updateData.englishLevel ?? candidateProfile.englishLevel,
      updateData.experienceDescription ?? candidateProfile.experienceDescription,
      updateData.accomplishmentsDescription ?? candidateProfile.accomplishmentsDescription,
      updateData.expectationsDescription ?? candidateProfile.expectationsDescription,
      updateData.employmentOptions ?? candidateProfile.employmentOptions,
      updateData.hourlyRate ?? candidateProfile.hourlyRate,
      updateData.preferredLanguage ?? candidateProfile.preferredLanguage,
      updateData.preferredCommunication ?? candidateProfile.preferredCommunication,
      candidateProfile.createdAt,
      new Date(),
    );

    await this.candidateProfileRepository.save(updatedProfile);
  }
}
