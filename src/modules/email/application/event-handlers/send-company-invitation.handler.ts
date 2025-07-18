import { Inject } from '@nestjs/common';

import { EventsHandler } from '~lib/nest-event-driven/decorators/event-handler.decorator';
import { IEventHandler } from '~lib/nest-event-driven/interfaces/event-handler.interface';

import { CompanyInvitationSentEvent } from '~modules/companies/domain/events/company-invitation-sent.event';
import { IEmailService } from '~modules/email/application/services/email-service.interface';
import { EmailDiToken } from '~modules/email/constants';
import { TemplateType } from '~modules/email/domain/enums/template-type.enum';

@EventsHandler(CompanyInvitationSentEvent)
export class SendCompanyInvitationHandler implements IEventHandler<CompanyInvitationSentEvent> {
  constructor(@Inject(EmailDiToken.EMAIL_SERVICE) private readonly emailService: IEmailService) {}

  async handle(event: CompanyInvitationSentEvent): Promise<void> {
    const { email, link, message, companyName } = event.payload;
    await this.emailService.sendTemplateMail({
      to: email,
      subject: `Invitation to${companyName ? ' ' + companyName : ''}`,
      template: TemplateType.COMPANY_INVITATION,
      context: {
        message: message || '',
        link,
        companyName: companyName || '',
      },
    });
  }
}
