import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { betterAuth } from "better-auth";
import type { PinoLogger } from "hono-pino";

import type { Db } from "@/api/db";
import type { Environment } from "@/api/env";

import type { Session, User } from "./auth";
import type { BASE_PATH } from "./constants";

export type AppEnv = {
  Variables: {
    logger: PinoLogger;

    // Database is attached by the db middleware
    db: Db;

    // BetterAuth
    auth: ReturnType<typeof betterAuth>;
    user: User | null;
    session: Session | null;

  };
  Bindings: {
    ASSETS: Fetcher;
  } & Environment;
};

// eslint-disable-next-line ts/no-empty-object-type
export type AppOpenAPI = OpenAPIHono<AppEnv, {}, typeof BASE_PATH>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppEnv>;
