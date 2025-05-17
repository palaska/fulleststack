import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";

import type { Db } from "@/api/db";
import type { accounts, sessions, users } from "@/api/db/auth.schema";

import type { Environment } from "../env";

import { Emailer } from "../services/email";
import { trustedOrigins } from "./constants";

export type User = typeof users.$inferInsert;
export type Session = typeof sessions.$inferInsert;
export type Account = typeof accounts.$inferInsert;

export function configureAuth(db: Db, env: Environment) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      usePlural: true,
    }),
    trustedOrigins,
    emailAndPassword: {
      enabled: true,
      resetPasswordTokenExpiresIn: 10 * 60, // 10 minutes
      sendResetPassword: async ({ user, url, token }, request) => {
        await Emailer(env).forgotPassword({ to: user.email, url });
      },
    },
    plugins: [
      admin(),
      openAPI(),
      expo(),
    ],
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // Cache duration in seconds
      },
    },
    // advanced: {
    //   crossSubDomainCookies: {
    //     enabled: true,
    //   },
    //   defaultCookieAttributes: {
    //     sameSite: "none",
    //     secure: true,
    //     partitioned: true, // New browser standards will mandate this for foreign cookies
    //   },
    // },
  });
}
