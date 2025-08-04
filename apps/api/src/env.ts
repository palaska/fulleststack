/* eslint-disable node/no-process-env */
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z } from "zod";

expand(config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  ),
}));

const EnvSchema = z.object({
  ENVIRONMENT: z.string().default("development"),
  PORT: z.coerce.number().default(8787),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]),
  TURSO_URL: z.string().url(),
  TURSO_AUTH_TOKEN: z.string().optional(),
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string(),
  API_URL: z.string().url(),
  WEB_URL: z.string().url(),
}).passthrough().superRefine((input, ctx) => {
  if (input.ENVIRONMENT === "production" && !input.TURSO_AUTH_TOKEN) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_type,
      expected: "string",
      received: "undefined",
      path: ["TURSO_AUTH_TOKEN"],
      message: "Must be set when ENVIRONMENT is 'production'",
    });
  }
});

export type Environment = z.infer<typeof EnvSchema>;

export function validateEnv(env: unknown) {
  const result = EnvSchema.safeParse(env);

  if (!result.success) {
    const errorMessage = `❌ Invalid env - ${Object.entries(result.error.flatten().fieldErrors).map(([key, errors]) => `${key}: ${errors?.join(",")}`).join(" | ")}`;
    throw new Error(errorMessage);
  }

  return result.data;
}

export default validateEnv(process.env);
