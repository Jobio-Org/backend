import { Module } from '@nestjs/common';

import { SendCompanyInvitationHandler } from '~modules/email/application/event-handlers/send-company-invitation.handler';
import { EmailDiToken } from '~modules/email/constants';
import { EmailService } from '~modules/email/infrastructure/services/email.service';

@Module({
  providers: [
    {
      provide: EmailDiToken.EMAIL_SERVICE,
      useClass: EmailService,
    },
    SendCompanyInvitationHandler,
  ],
})
export class EmailModule {}
