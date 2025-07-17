import { InviteRecruiterDto } from '~modules/companies/application/dto/invite-recruiter.dto';

import { IUseCase } from '~shared/application/use-cases/use-case.interface';

export interface ISendInvitationUseCase extends IUseCase<{ dto: InviteRecruiterDto; inviterUserId: string }, void> {}
