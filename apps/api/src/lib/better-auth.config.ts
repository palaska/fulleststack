/**
 * This file is used to configure the BetterAuth library.
 * It is never imported anywhere on a serverless setup.
 */

import { config } from "dotenv";
/* eslint-disable node/no-process-env */
import path from "node:path";
import { z } from "zod";

import { createDb } from "@/api/db";
import { configureAuth } from "@/api/lib/auth";

// Load environment variables for development tools
config({
  path: path.resolve(__dirname, "../../.dev.vars"),
});

const env = z.object({
  TURSO_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
}).parse(process.env);

const db = createDb(env);

export const auth = configureAuth(db);
