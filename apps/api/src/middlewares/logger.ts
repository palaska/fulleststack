import type { Context, MiddlewareHandler } from "hono";
import type { Env } from "hono-pino";

import { pinoLogger as logger } from "hono-pino";
import pino from "pino";

import type { AppEnv } from "@/api/lib/types";

export function pinoLogger() {
  return ((c, next) => {
    // Safely determine if we should use pretty logger
    const isPrettyLogger = c.env.ENVIRONMENT !== "production";
    const transport = isPrettyLogger
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined;

    return logger({
      pino: pino({
        level: c.env.LOG_LEVEL || "info",
        transport,
      }),
      http: {
        // Use the requestId that was set by the previous middleware
        reqId: () => c.get("requestId"),
      },
    })(c as unknown as Context<Env>, next);
  }) satisfies MiddlewareHandler<AppEnv>;
}
