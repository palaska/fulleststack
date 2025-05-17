/**
 * This file is used to configure the BetterAuth library.
 * It is never imported anywhere on a serverless setup.
 */

import { config } from "dotenv";
/* eslint-disable node/no-process-env */
import path from "node:path";

import { createDb } from "@/api/db";
import { configureAuth } from "@/api/lib/auth";
import { validateEnv } from "@/api/env";

// Load environment variables for development tools
config({
  path: path.resolve(__dirname, "../../.dev.vars"),
});

const env = validateEnv(process.env);
const db = createDb(env);

export const auth = configureAuth(db, env);
