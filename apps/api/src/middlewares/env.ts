import type { MiddlewareHandler } from "hono";

import type { AppEnv } from "@/api/lib/types";

import { validateEnv } from "@/api/env";

export function envMiddleware(): MiddlewareHandler<AppEnv> {
  return (c, next) => {
    // Validate Cloudflare environment
    validateEnv(c.env);
    return next();
  };
}
