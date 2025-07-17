import { Inject } from '@nestjs/common';

import { EventsHandler } from '~lib/nest-event-driven/decorators/event-handler.decorator';
import { IEventHandler } from '~lib/nest-event-driven/interfaces/event-handler.interface';

import { CompanyInvitationSentEvent } from '~modules/companies/domain/events/company-invitation-sent.event';
import { EmailDiToken } from '~modules/email/constants';

import { IEmailService } from '../services/email-service.interface';

@EventsHandler(CompanyInvitationSentEvent)
export class SendCompanyInvitationHandler implements IEventHandler<CompanyInvitationSentEvent> {
  constructor(@Inject(EmailDiToken.EMAIL_SERVICE) private readonly emailService: IEmailService) {}

  async handle(event: CompanyInvitationSentEvent): Promise<void> {
    const { email, link, message, companyName } = event.payload;
    await this.emailService.sendMail({
      to: email,
      subject: `Запрошення до компанії${companyName ? ' ' + companyName : ''}`,
      text: message || undefined,
      html: `<p>${message || ''}</p><p><a href="${link}">Прийняти запрошення</a></p>`,
    });
  }
}
