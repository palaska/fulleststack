import { Resend } from "resend";

import type { CreateEmailOptions } from "resend";

import type { ResetPasswordSubjectProps, ResetPasswordEmailProps, PasswordChangedSubjectProps, PasswordChangedEmailProps } from "../templates";
import { ResetPasswordTemplate, PasswordChangedTemplate } from "../templates";
import { BaseSendMailOptions, EmailEnv, EmailTemplate, SendMailViaTemplateOptions } from "../types";


export class Emailer {
  private readonly resend: Resend;

  constructor(private readonly env: EmailEnv) {
    this.resend = new Resend(this.env.RESEND_API_KEY);
  }

  async sendEmail({ from, ...rest }: CreateEmailOptions) {
    const resolvedFrom = from ?? this.env.EMAIL_FROM;

    const { data, error } = await this.resend.emails.send({
      from: resolvedFrom,
      ...rest,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async resetPassword(props: BaseSendMailOptions & ResetPasswordSubjectProps & ResetPasswordEmailProps) {
    return this.sendUsingTemplate(ResetPasswordTemplate, props);
  }

  async passwordChanged(props: BaseSendMailOptions & PasswordChangedSubjectProps & PasswordChangedEmailProps) {
    return this.sendUsingTemplate(PasswordChangedTemplate, props);
  }

  async sendUsingTemplate<S, B>(template: EmailTemplate<S, B>, opts: SendMailViaTemplateOptions<S, B>) {
    const react: React.ReactNode = template.body(opts);
    const subject = opts.subject ?? template.subject(opts);
    const from = opts.from ?? this.env.EMAIL_FROM;
    return await this.sendEmail({ react, subject, from, ...opts });
  }
}
