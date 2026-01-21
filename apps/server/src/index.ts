import { env } from "@LockedIn/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import auth from "./routes/auth";
import goals from "./routes/goals";
import groups from "./routes/groups";
import gang from "./routes/gang";
import notifications from "./routes/notifications";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// Health check
app.get("/", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.route("/api/auth", auth);
app.route("/api/goals", goals);
app.route("/api/groups", groups);
app.route("/api/gang", gang);
app.route("/api/notifications", notifications);

export default app;
