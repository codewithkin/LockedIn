import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    CORS_ORIGIN: z.url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    // SMTP configuration for nodemailer
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.coerce.number().default(587),
    SMTP_SECURE: z.coerce.boolean().default(false),
    SMTP_USER: z.string().min(1),
    SMTP_PASS: z.string().min(1),
    SMTP_FROM_EMAIL: z.string().email().default("noreply@lockedin.app"),
    SMTP_FROM_NAME: z.string().default("LockedIn"),
    JWT_SECRET: z.string().min(32),
    APP_URL: z.url().default("http://localhost:8081"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
