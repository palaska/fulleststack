import type { MiddlewareHandler } from "hono";

import type { AppEnv } from "@/api/lib/types";

import { Emailer } from "@fulleststack/email";

/**
 * Middleware that attaches emailer to the context
 */
export function attachEmailer(): MiddlewareHandler<AppEnv> {
  return (c, next) => {
    const emailer = new Emailer(c.env);

    // Attach emailer to context
    c.set("emailer", emailer);

    return next();
  };
}
