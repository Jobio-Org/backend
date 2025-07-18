import { type AcceptInvitationDto } from '~modules/companies/application/dto/company-invitations/accept-invitation.dto';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

export interface IAcceptInvitationUseCase extends IUseCase<{ dto: AcceptInvitationDto; userId: string }, void> {}
