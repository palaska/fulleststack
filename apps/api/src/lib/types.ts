import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";

import type { Session, User } from "./auth";
import type { BASE_PATH } from "./constants";

export type AppEnv = {
  Variables: {
    logger: PinoLogger;

    // BetterAuth
    user: User | null;
    session: Session | null;
  };
};

// eslint-disable-next-line ts/no-empty-object-type
export type AppOpenAPI = OpenAPIHono<AppEnv, {}, typeof BASE_PATH>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppEnv>;
