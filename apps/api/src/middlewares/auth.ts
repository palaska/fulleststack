import { promiseAllSettled } from "@fulleststack/common";
import { createMiddleware } from "hono/factory";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { statements } from "@/api/lib/permissions";
import type { AppEnv } from "@/api/lib/types";

import { configureAuth } from "@/api/lib/auth";
import { roles } from "@/api/lib/permissions";

export const attachAuthEntities = createMiddleware<AppEnv>(async (c, next) => {
  const db = c.get("db");
  const emailer = c.get("emailer");

  if (!db || !emailer) {
    throw new Error("Database or emailer not found");
  }

  const auth = configureAuth(db, emailer);

  c.set("auth", auth);

  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

export const isLoggedIn = createMiddleware<AppEnv>(async (c, next) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ message: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.UNAUTHORIZED);
  }

  return next();
});

export const isAdmin = createMiddleware<AppEnv>(async (c, next) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ message: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.UNAUTHORIZED);
  }

  const userRoles = user.role?.split(",") ?? [];
  if (!userRoles.includes("admin")) {
    return c.json({ message: HttpStatusPhrases.FORBIDDEN }, HttpStatusCodes.FORBIDDEN);
  }

  return next();
});

export function isAuthorizedTo(permissions: Partial<{
  [K in keyof typeof statements]?: (typeof statements)[K][number][];
}>) {
  return createMiddleware<AppEnv>(async (c, next) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ message: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.UNAUTHORIZED);
    }

    const userRoles = user.role?.split(",") ?? [];
    const auth = c.get("auth");

    const results = await promiseAllSettled(userRoles.map(async (userRole) => {
      if (!(userRole in roles)) {
        return { success: false, error: "Invalid role" };
      }

      return await auth.api.userHasPermission({
        body: {
          role: userRole as keyof typeof roles,
          permissions,
        },
      });
    }));

    if (results.some(r => r.success)) {
      return next();
    }

    return c.json({ message: HttpStatusPhrases.FORBIDDEN }, HttpStatusCodes.FORBIDDEN);
  });
}
