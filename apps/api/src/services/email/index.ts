import { Resend } from "resend";

import type { Environment } from "@/api/env";

import { ForgotPassword } from "./templates/forgot-password";
import { EmailTemplate } from "./email-template";
import { html } from "hono/html";
import { Child } from "hono/jsx";

type EmailEnv = Pick<Environment, "RESEND_API_KEY" | "EMAIL_FROM">;

type BaseOptions = {
  to: string;
  subject?: string;
  from?: string;
  replyTo?: string;
  tags?: Array<{
    name: string;
    value: string;
  }>;
};

type SendMailOptions = BaseOptions & { html: string; subject: string };

export async function renderToString(jsx: Child): Promise<string> {
  const rendered = await html`${jsx}`;
  return rendered.toString();
}

async function sendEmail({ to, subject, from: customFrom, replyTo, tags, html }: SendMailOptions, env: EmailEnv) {
  const resend = new Resend(env.RESEND_API_KEY);
  const from = customFrom ?? env.EMAIL_FROM;

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    replyTo,
    tags,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

function sendUsingTemplate<P>(template: EmailTemplate<P>, env: EmailEnv) {
  return async (opts: BaseOptions & P) => {
    const html = await renderToString(template.body(opts));
    return sendEmail({ ...opts, html, subject: opts.subject ?? template.subject(opts) }, env);
  }
}

export function Emailer(env: EmailEnv) {
  return {
    sendCustom: (opts: SendMailOptions) => sendEmail(opts, env),
    // Add more templates here
    forgotPassword: sendUsingTemplate(ForgotPassword, env),
  };
}
