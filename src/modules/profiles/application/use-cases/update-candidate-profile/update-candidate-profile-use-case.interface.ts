import { type UpdateCandidateProfileDto } from '~modules/profiles/application/dto/update-candidate-profile.dto';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

export interface IUpdateCandidateProfileUseCase
  extends IUseCase<UpdateCandidateProfileDto & { userId: string }, void> {}
