import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { requestId } from "hono/request-id";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";

import { authMiddleware } from "@/api/middlewares/auth";
import { dbMiddleware } from "@/api/middlewares/db";
import { envMiddleware } from "@/api/middlewares/env";
import { pinoLogger } from "@/api/middlewares/logger";

import type { AppOpenAPI } from "./types";

import { BASE_PATH } from "./constants";
import createRouter from "./create-router";

export default function createApp() {
  const app = createRouter()
    .use("*", (c, next) => {
      if (c.req.path.startsWith(BASE_PATH)) {
        return next();
      }
      // SPA redirect to /index.html
      const requestUrl = new URL(c.req.raw.url);
      return c.env.ASSETS.fetch(new URL("/index.html", requestUrl.origin));
    })
    .basePath(BASE_PATH) as AppOpenAPI;

  // Adding env validation as first middleware
  app.use(envMiddleware());

  // RequestID before logger so logs can include the ID
  app.use(requestId());

  // Logger early to capture as many requests as possible
  app.use(pinoLogger());

  app.use(
    "*", // or replace with "*" to enable cors for all routes
    cors({
      origin: "http://localhost:5173",
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  );

  app.use(csrf());

  app.use(serveEmojiFavicon("📝"))
    .use(dbMiddleware())
    .use(authMiddleware())
    .on(["POST", "GET"], "/auth/**", (c) => {
      return c.get("auth").handler(c.req.raw);
    });

  app.notFound(notFound);
  app.onError(onError);
  return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().route("/", router);
}
