import { Module } from '@nestjs/common';

import { EmailService } from '~modules/email/infrastructure/services/email.service';

import { SendCompanyInvitationHandler } from './application/event-handlers/send-company-invitation.handler';
import { EmailDiToken } from './constants';

@Module({
  providers: [
    {
      provide: EmailDiToken.EMAIL_SERVICE,
      useClass: EmailService,
    },
    SendCompanyInvitationHandler,
  ],
  exports: [EmailDiToken.EMAIL_SERVICE],
})
export class EmailModule {}
