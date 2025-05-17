import type { Child } from "hono/jsx";

export type EmailTemplate<P> = {
  subject: (params: P) => string;
  body: (props: P) => Child;
};
