import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CompaniesDiToken } from '~modules/companies/constants';
import { CompanyInvitationSentEvent } from '~modules/companies/domain/events/company-invitation-sent.event';
import { ICompanyInvitationRepository } from '~modules/companies/domain/repositories/company-invitation-repository.interface';
import { ICompanyRepository } from '~modules/companies/domain/repositories/company-repository.interface';
import { IUserCompanyRepository } from '~modules/companies/domain/repositories/user-company-repository.interface';
import { IProfilesQueryService } from '~modules/profiles/application/services/profiles-query-service.interface';
import { IUserDetailsQueryService } from '~modules/profiles/application/services/user-details-query-service.interface';
import { ProfilesDiToken } from '~modules/profiles/constants';

import { Command } from '~shared/application/CQS/command.abstract';

import { InviteRecruiterDto } from '../../dto/invite-recruiter.dto';
import { ICompanyPermissionQueryService } from '../../services/company-permission-query-service.interface';
import { ISendInvitationUseCase } from './send-invitation-use-case.interface';
import { CompanyInvitationStatus } from '~modules/companies/domain/enums/company-management.enum';

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
  ) {
    super();
  }

  protected async implementation(): Promise<void> {
    const { dto, inviterUserId } = this._input;

    // 1. Валідація: не можна запрошувати себе
    if (dto.email === inviterUserId) {
      throw new Error('You cannot invite yourself');
    }

    // 2. Отримати recruiterProfileId по inviterUserId
    const inviterUserDetails = await this.userDetailsQueryService.getUserDetailsByUserId(inviterUserId);
    console.log("🚀 ~ implementation ~ inviterUserDetails:", inviterUserDetails)
    if (!inviterUserDetails) throw new Error('Inviter user not found');

    const inviterRecruiterProfile = await this.profilesQueryService.getRecruiterProfileByUserId(inviterUserId);
    console.log("🚀 ~ implementation ~ inviterRecruiterProfile:", inviterRecruiterProfile)
    if (!inviterRecruiterProfile) throw new Error('Inviter recruiter profile not found');

    const invitedByRecruiterProfileId = inviterRecruiterProfile.id;
    console.log("🚀 ~ implementation ~ invitedByRecruiterProfileId:", invitedByRecruiterProfileId)

    // 3. Перевірити, чи вже є pending інвайт для цього email+companyId
    const existingInvite = await this.invitationRepository.findPendingByEmailAndCompany(dto.email, dto.companyId);
    console.log("🚀 ~ implementation ~ existingInvite:", existingInvite)

    if (existingInvite) {
      throw new Error('Invitation already sent to this email for this company');
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
      throw new Error('User is already a member of this company');
    }
    console.log("🚀 ~ implementation ~ alreadyMember:", alreadyMember)


    // 5. Перевірити права
    const canInvite = await this.permissionService.canInviteWithRole(
      inviterUserId,
      dto.companyId,
      dto.roleId,
      dto.permissions,
    );
    console.log("🚀 ~ implementation ~ canInvite:", canInvite)

    if (!canInvite) {
      throw new Error('Insufficient permissions to invite with this role/permissions');
    }

    // 6. Згенерувати токен
    const token = uuidv4();
    console.log("🚀 ~ implementation ~ token:", token)

    // 7. Отримати companyName
    const company = await this.companyRepository.findById(dto.companyId);
    console.log("🚀 ~ implementation ~ company:", company)
    const companyName = company?.name || '';

    // 8. Отримати ім'я інвайтера
    const inviterName = inviterUserDetails.fullName || inviterUserDetails.userId;
    console.log("🚀 ~ implementation ~ inviterName:", inviterName)

    // 9. Створити запис у company_invitation
    await this.invitationRepository.create({
      companyId: dto.companyId,
      invitedByRecruiterProfileId,
      companyRoleId: dto.roleId,
      email: dto.email,
      message: dto.message,
      token,
      status: CompanyInvitationStatus.PENDING,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      firstName: null,
      lastName: null,
      acceptedAt: null,
      acceptedByRecruiterProfileId: null,
    });

    // 10. Зібрати посилання для email
    const link = `https://your-app.com/invite/accept?token=${token}`;

    console.log("🚀 ~ implementation ~ link:", link)
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
}
