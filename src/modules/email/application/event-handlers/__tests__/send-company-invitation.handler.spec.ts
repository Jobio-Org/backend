import { CompanyInvitationSentEvent } from '~modules/companies/domain/events/company-invitation-sent.event';
import { TemplateType } from '~modules/email/domain/enums/template-type.enum';

import { SendCompanyInvitationHandler } from '../send-company-invitation.handler';

describe('SendCompanyInvitationHandler', () => {
  let handler: SendCompanyInvitationHandler;
  let emailService: { sendTemplateMail: jest.Mock };

  beforeEach(() => {
    emailService = { sendTemplateMail: jest.fn() };
    handler = new SendCompanyInvitationHandler(emailService as any);
  });

  it('should call emailService.sendTemplateMail with correct params', async () => {
    const event = new CompanyInvitationSentEvent({
      email: 'test@mail.com',
      link: 'http://invite',
      message: 'Hello!',
      companyName: 'TestCo',
    });
    await handler.handle(event);
    expect(emailService.sendTemplateMail).toHaveBeenCalledWith({
      to: 'test@mail.com',
      subject: 'Invitation to TestCo',
      template: TemplateType.COMPANY_INVITATION,
      context: {
        message: 'Hello!',
        link: 'http://invite',
        companyName: 'TestCo',
      },
    });
  });

  it('should handle missing message and companyName', async () => {
    const event = new CompanyInvitationSentEvent({
      email: 'test@mail.com',
      link: 'http://invite',
    });
    await handler.handle(event);
    expect(emailService.sendTemplateMail).toHaveBeenCalledWith({
      to: 'test@mail.com',
      subject: 'Invitation to',
      template: TemplateType.COMPANY_INVITATION,
      context: {
        message: '',
        link: 'http://invite',
        companyName: '',
      },
    });
  });
});
