import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";

import type { Db } from "@/api/db";
import type { accounts, sessions, users } from "@/api/db/auth.schema";

import { trustedOrigins } from "./constants";

export type User = typeof users.$inferInsert;
export type Session = typeof sessions.$inferInsert;
export type Account = typeof accounts.$inferInsert;

export function configureAuth(db: Db) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      usePlural: true,
    }),
    trustedOrigins,
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      admin(),
      openAPI(),
      expo(),
    ],
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
