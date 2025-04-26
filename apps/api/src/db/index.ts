import type { LibSQLDatabase } from "drizzle-orm/libsql";

import { drizzle } from "drizzle-orm/libsql";

import type { Environment } from "@/api/env";

import * as schema from "./schema";

export type Db = LibSQLDatabase<typeof schema>;

export function createDb(env: Pick<Environment, "TURSO_URL" | "TURSO_AUTH_TOKEN">): Db {
  return drizzle({
    connection: {
      url: env.TURSO_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    },
    casing: "snake_case",
    schema,
  });
}
