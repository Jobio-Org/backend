import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

import { type UpdateCandidateProfileDto } from '../../dto/update-candidate-profile.dto';

export interface IUpdateCandidateProfileUseCase
  extends IUseCase<UpdateCandidateProfileDto & { userId: string }, void> {}
