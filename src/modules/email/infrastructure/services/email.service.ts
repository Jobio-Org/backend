import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

import { IEmailService } from '~modules/email/application/services/email-service.interface';
import { TemplateType } from '~modules/email/domain/enums/template-type.enum';

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

  async sendTemplateMail(options: {
    to: string;
    subject: string;
    template: TemplateType;
    context: Record<string, any>;
  }): Promise<void> {
    const templateDir =
      process.env.NODE_ENV === 'production'
        ? path.join(process.cwd(), 'dist', 'modules', 'email', 'infrastructure', 'templates')
        : path.join(process.cwd(), 'src', 'modules', 'email', 'infrastructure', 'templates');

    const templatePath = path.join(templateDir, `${options.template}.hbs`);
    const templateSource = fs.readFileSync(templatePath, 'utf8');

    const compiledTemplate = handlebars.compile(templateSource);

    const html = compiledTemplate(options.context);

    await this.sendMail({
      to: options.to,
      subject: options.subject,
      html,
    });
  }
}
