/* eslint-disable node/no-process-env */
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import path from "node:path";
import { z } from "zod";

// Load environment variables for development tools
config({
  path: path.resolve(__dirname, ".dev.vars"),
});

const env = z.object({
  TURSO_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
}).parse(process.env);

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "turso",
  casing: "snake_case",
  dbCredentials: {
    url: env.TURSO_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
});
