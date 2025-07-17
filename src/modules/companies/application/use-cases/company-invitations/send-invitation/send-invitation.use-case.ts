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
import { IProfilesQueryService } from '~modules/profiles/application/services/profiles-query-service.interface';
import { IUserDetailsQueryService } from '~modules/profiles/application/services/user-details-query-service.interface';
import { ProfilesDiToken } from '~modules/profiles/constants';

import { Command } from '~shared/application/CQS/command.abstract';
import { IAppConfigService } from '~shared/application/services';
import { BaseToken } from '~shared/constants';

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
    @Inject(ProfilesDiToken.PROFILES_QUERY_SERVICE)
    private readonly profilesQueryService: IProfilesQueryService,
    @Inject(CompaniesDiToken.COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
    @Inject(ProfilesDiToken.USER_DETAILS_QUERY_SERVICE)
    private readonly userDetailsQueryService: IUserDetailsQueryService,
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

    // 2. Отримати recruiterProfileId по inviterUserId
    const inviterUserDetails = await this.userDetailsQueryService.getUserDetailsByUserId(inviterUserId);
    console.log('🚀 ~ implementation ~ inviterUserDetails:', inviterUserDetails);
    if (!inviterUserDetails) throw new EntityNotFoundException('user-details', inviterUserId);

    const inviterRecruiterProfile = await this.profilesQueryService.getRecruiterProfileByUserId(inviterUserId);
    console.log('🚀 ~ implementation ~ inviterRecruiterProfile:', inviterRecruiterProfile);
    if (!inviterRecruiterProfile)
      throw new EntityNotFoundException('recruiter-profile', inviterUserId, 'Inviter recruiter profile not found');

    const invitedByRecruiterProfileId = inviterRecruiterProfile.id;
    console.log('🚀 ~ implementation ~ invitedByRecruiterProfileId:', invitedByRecruiterProfileId);

    // 3. Перевірити, чи вже є pending інвайт для цього email+companyId
    const existingInvite = await this.invitationRepository.findPendingByEmailAndCompany(dto.email, dto.companyId);
    console.log('🚀 ~ implementation ~ existingInvite:', existingInvite);

    if (existingInvite) {
      throw new InvitationAlreadySentException();
    }

    // 4. Перевірити, чи вже є такий учасник у компанії (user-company)
    let alreadyMember = false;

    const invitedRecruiterProfile = await this.profilesQueryService.getRecruiterProfileByEmail(dto.email);

    if (invitedRecruiterProfile) {
      alreadyMember = await this.userCompanyRepository.existsByRecruiterProfileIdAndCompanyId(
        invitedRecruiterProfile.id,
        dto.companyId,
      );
    }
    if (alreadyMember) {
      throw new InvitationAlreadyAcceptedException('User is already a member of this company');
    }
    console.log('🚀 ~ implementation ~ alreadyMember:', alreadyMember);

    // 5. Перевірити права
    const canInvite = await this.permissionService.canInviteWithRole(inviterUserId, dto.companyId);
    console.log('🚀 ~ implementation ~ canInvite:', canInvite);

    if (!canInvite) {
      throw new InsufficientPermissionsException('Insufficient permissions to invite with this role/permissions');
    }

    // 6. Згенерувати токен
    const token = this.generateToken();
    console.log('🚀 ~ implementation ~ token:', token);

    // 7. Отримати companyName
    const company = await this.companyRepository.findById(dto.companyId);
    console.log('🚀 ~ implementation ~ company:', company);
    const companyName = company?.name || '';

    // 8. Отримати ім'я інвайтера
    const inviterName = inviterUserDetails.fullName || inviterUserDetails.userId;
    console.log('🚀 ~ implementation ~ inviterName:', inviterName);

    // 9. Створити запис у company_invitation
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

    // 10. Зібрати посилання для email
    const link = this.generateLink(token);

    console.log('🚀 ~ implementation ~ link:', link);
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
