import type { LibSQLDatabase } from "drizzle-orm/libsql";

import { drizzle } from "drizzle-orm/libsql";

import env from "@/api/env";

import * as schema from "./schema";

export type Db = LibSQLDatabase<typeof schema>;

function createDb(): Db {
  return drizzle({
    connection: {
      url: env.TURSO_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    },
    casing: "snake_case",
    schema,
  });
}

export default createDb();
