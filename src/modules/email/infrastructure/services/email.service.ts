import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { IEmailService } from '~modules/email/application/services/email-service.interface';
import { IAppConfigService } from '~shared/application/services/app-config-service.interface';
import { BaseToken } from '~shared/constants';

@Injectable()
export class EmailService implements IEmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    @Inject(BaseToken.APP_CONFIG)
    private readonly configService: IAppConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: Number(this.configService.get('SMTP_PORT')),
      secure: true, 
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendMail(options: { to: string; subject: string; text?: string; html?: string }): Promise<void> {
    await this.transporter.sendMail({
      to: options.to,
      from: this.configService.get('SMTP_USER'),
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }
}
