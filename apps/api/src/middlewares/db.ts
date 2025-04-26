import type { MiddlewareHandler } from "hono";

import type { AppEnv } from "@/api/lib/types";

import { createDb } from "@/api/db";

/**
 * Middleware that attaches database to the context
 */
export function dbMiddleware(): MiddlewareHandler<AppEnv> {
  return (c, next) => {
    const db = createDb(c.env);

    // Attach db to context
    c.set("db", db);

    return next();
  };
}
