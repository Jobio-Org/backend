import { Inject, Injectable } from '@nestjs/common';

import { AcceptInvitationDto } from '~modules/companies/application/dto/company-invitations/accept-invitation.dto';
import { InvitationAlreadyAcceptedException } from '~modules/companies/application/exceptions/company-invitations/invitation-already-accepted.exception';
import { InvitationExpiredException } from '~modules/companies/application/exceptions/company-invitations/invitation-expired.exception';
import { InvitationNotFoundException } from '~modules/companies/application/exceptions/company-invitations/invitation-not-found.exception';
import { EntityNotFoundException } from '~modules/companies/application/exceptions/not-found.exception';
import { IAcceptInvitationUseCase } from '~modules/companies/application/use-cases/company-invitations/accept-invitation/accept-invitation-use-case.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { UserCompany } from '~modules/companies/domain/entities/user-company.entity';
import { CompanyInvitationStatus } from '~modules/companies/domain/enums/company-management.enum';
import { CompanyInvitationAcceptedEvent } from '~modules/companies/domain/events/company-invitation-accepted.event';
import { ICompanyInvitationRepository } from '~modules/companies/domain/repositories/company-invitation-repository.interface';
import { IUserCompanyRepository } from '~modules/companies/domain/repositories/user-company-repository.interface';
import { IProfilesQueryService } from '~modules/profiles/application/services/profiles-query-service.interface';
import { IUserDetailsQueryService } from '~modules/profiles/application/services/user-details-query-service.interface';
import { ProfilesDiToken } from '~modules/profiles/constants';

import { Command } from '~shared/application/CQS/command.abstract';

@Injectable()
export class AcceptInvitationUseCase
  extends Command<{ dto: AcceptInvitationDto; userId: string }, void>
  implements IAcceptInvitationUseCase
{
  constructor(
    @Inject(CompaniesDiToken.COMPANY_INVITATION_REPOSITORY)
    private readonly invitationRepository: ICompanyInvitationRepository,
    @Inject(CompaniesDiToken.USER_COMPANY_REPOSITORY)
    private readonly userCompanyRepository: IUserCompanyRepository,
    @Inject(ProfilesDiToken.PROFILES_QUERY_SERVICE)
    private readonly profilesQueryService: IProfilesQueryService,
    @Inject(ProfilesDiToken.USER_DETAILS_QUERY_SERVICE)
    private readonly userDetailsQueryService: IUserDetailsQueryService,
  ) {
    super();
  }

  protected async implementation(): Promise<void> {
    const { dto, userId } = this._input;

    const invitation = await this.invitationRepository.findByToken(dto.token);
    if (!invitation) {
      throw new InvitationNotFoundException('Invalid invitation token');
    }

    if (invitation.status !== CompanyInvitationStatus.PENDING) {
      throw new InvitationAlreadyAcceptedException('Invitation is not pending');
    }

    if (invitation.expiresAt < new Date()) {
      throw new InvitationExpiredException();
    }

    const userDetails = await this.userDetailsQueryService.getUserDetailsByUserId(userId);
    if (!userDetails) {
      throw new EntityNotFoundException('user-details', userId);
    }

    const recruiterProfile = await this.profilesQueryService.getRecruiterProfileByUserId(userId);
    if (!recruiterProfile) {
      throw new EntityNotFoundException('recruiter-profile', userId);
    }

    const existingMembership = await this.userCompanyRepository.existsByRecruiterProfileIdAndCompanyId(
      recruiterProfile.id,
      invitation.companyId,
    );

    if (existingMembership) {
      throw new InvitationAlreadyAcceptedException('User is already a member of this company');
    }

    await this.invitationRepository.updateStatus(
      invitation.id,
      CompanyInvitationStatus.ACCEPTED,
      new Date(),
      recruiterProfile.id,
    );

    const userCompany = UserCompany.builder(
      recruiterProfile.id,
      invitation.companyId,
      invitation.companyRoleId,
    ).build();

    await this.userCompanyRepository.create(userCompany);

    this._eventDispatcher.registerEvent(
      new CompanyInvitationAcceptedEvent({
        invitationId: invitation.id,
        companyId: invitation.companyId,
        recruiterProfileId: recruiterProfile.id,
        email: invitation.email,
      }),
    );
  }
}
