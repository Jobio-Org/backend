import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { InviteRecruiterDto } from '~modules/companies/application/dto/company-invitations/invite-recruiter.dto';
import { InvitationAlreadyAcceptedException } from '~modules/companies/application/exceptions/company-invitations/invitation-already-accepted.exception';
import { InvitationAlreadySentException } from '~modules/companies/application/exceptions/company-invitations/invitation-already-sent.exception';
import { InsufficientPermissionsException } from '~modules/companies/application/exceptions/company-permissions/insufficient-permissions.exception';
import { EntityNotFoundException } from '~modules/companies/application/exceptions/not-found.exception';
import { ICompanyPermissionQueryService } from '~modules/companies/application/services/company-permissions/company-permission-query-service.interface';
import { ISendInvitationUseCase } from '~modules/companies/application/use-cases/company-invitations/send-invitation/send-invitation-use-case.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { CompanyInvitation } from '~modules/companies/domain/entities/company-invitation.entity';
import { CompanyInvitationStatus } from '~modules/companies/domain/enums/company-management.enum';
import { CompanyInvitationSentEvent } from '~modules/companies/domain/events/company-invitation-sent.event';
import { ICompanyInvitationRepository } from '~modules/companies/domain/repositories/company-invitation-repository.interface';
import { ICompanyRepository } from '~modules/companies/domain/repositories/company-repository.interface';
import { IUserCompanyRepository } from '~modules/companies/domain/repositories/user-company-repository.interface';
import { IRecruiterProfileQueryService } from '~modules/recruiter-profile/application/services/recruiter-profile-query-service.interface';
import { RecruiterProfileDiToken } from '~modules/recruiter-profile/constants';

import { Command } from '~shared/application/CQS/command.abstract';
import { IAppConfigService } from '~shared/application/services/app-config-service.interface';
import { BaseToken } from '~shared/constants';
import { UserRole } from '~shared/domain/enums/user-role.enum';

@Injectable()
export class SendInvitationUseCase
  extends Command<{ dto: InviteRecruiterDto; inviterUserId: string }, void>
  implements ISendInvitationUseCase
{
  constructor(
    @Inject(CompaniesDiToken.COMPANY_INVITATION_REPOSITORY)
    private readonly invitationRepository: ICompanyInvitationRepository,
    @Inject(CompaniesDiToken.COMPANY_PERMISSION_QUERY_SERVICE)
    private readonly permissionService: ICompanyPermissionQueryService,
    @Inject(RecruiterProfileDiToken.RECRUITER_PROFILE_QUERY_SERVICE)
    private readonly recruiterProfileQueryService: IRecruiterProfileQueryService,
    @Inject(CompaniesDiToken.COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
    @Inject(CompaniesDiToken.USER_COMPANY_REPOSITORY)
    private readonly userCompanyRepository: IUserCompanyRepository,
    @Inject(BaseToken.APP_CONFIG)
    private readonly configService: IAppConfigService,
  ) {
    super();
  }

  protected async implementation(): Promise<void> {
    const { dto, inviterUserId } = this._input;

    const invitationExpireTime = this.getInvitationExpireTime();

    const inviterRecruiterProfile = await this.recruiterProfileQueryService.getRecruiterProfileByUserId(inviterUserId);
    if (!inviterRecruiterProfile)
      throw new EntityNotFoundException(
        'recruiter-profile',
        inviterUserId,
        `Inviter ${UserRole.RECRUITER} profile not found`,
      );

    const invitedByRecruiterProfileId = inviterRecruiterProfile.id;

    const existingInvite = await this.invitationRepository.findPendingByEmailAndCompany(dto.email, dto.companyId);

    if (existingInvite) {
      throw new InvitationAlreadySentException();
    }

    const invitedRecruiterProfile = await this.recruiterProfileQueryService.getRecruiterProfileByEmail(dto.email);

    if (!invitedRecruiterProfile) {
      throw new EntityNotFoundException(
        'recruiter-profile',
        dto.email,
        `Invited ${UserRole.RECRUITER} profile not found`,
      );
    }

    const alreadyMember = await this.userCompanyRepository.existsByRecruiterProfileIdAndCompanyId(
      invitedRecruiterProfile.id,
      dto.companyId,
    );

    if (alreadyMember) {
      throw new InvitationAlreadyAcceptedException('User is already a member of this company');
    }

    const canInvite = await this.permissionService.canInviteWithRole(inviterUserId, dto.companyId);

    if (!canInvite) {
      throw new InsufficientPermissionsException('Insufficient permissions to invite with this role/permissions');
    }

    const token = this.generateToken();

    const company = await this.companyRepository.findById(dto.companyId);
    const companyName = company?.name || '';

    const inviterName = company?.name || inviterUserId;

    const companyInvitation = CompanyInvitation.builder(
      dto.companyId,
      invitedByRecruiterProfileId,
      dto.roleId,
      dto.email,
      token,
      new Date(Date.now() + invitationExpireTime),
    )
      .message(dto.message)
      .status(CompanyInvitationStatus.PENDING)
      .firstName(null)
      .lastName(null)
      .acceptedAt(null)
      .acceptedByRecruiterProfileId(null)
      .build();

    await this.invitationRepository.create(companyInvitation);

    const link = this.generateLink(token);

    this._eventDispatcher.registerEvent(
      new CompanyInvitationSentEvent({
        email: dto.email,
        link,
        message: dto.message,
        companyName,
        inviterName,
      }),
    );
  }

  private generateToken(): string {
    return uuidv4();
  }

  private generateLink(token: string): string {
    return `${this.configService.get('CLIENT_INVITE_REDIRECT_URL')}?token=${token}`;
  }

  private getInvitationExpireTime(): number {
    return Number(this.configService.get('COMPANY_INVITATION_EXPIRE_TIME'));
  }
}
