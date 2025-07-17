export interface IEmailService {
  sendMail(options: { to: string; subject: string; text?: string; html?: string }): Promise<void>;
  sendTemplateMail(options: { to: string; subject: string; template: string; context: Record<string, any> }): Promise<void>;
}
