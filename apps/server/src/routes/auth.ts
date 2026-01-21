import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Resend } from "resend";
import { sign, verify } from "hono/jwt";
import prisma from "@LockedIn/db";
import { env } from "@LockedIn/env/server";

const resend = new Resend(env.RESEND_API_KEY);

const auth = new Hono();

// Request magic link
auth.post(
  "/magic-link",
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
    })
  ),
  async (c) => {
    const { email } = c.req.valid("json");

    // Create or get user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email },
      });
    }

    // Generate magic link token (valid for 15 minutes)
    const token = await sign(
      {
        userId: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes
        type: "magic-link",
      },
      env.JWT_SECRET
    );

    // Create deep link for the app
    const magicLink = `lockedin://auth/verify?token=${token}`;
    const webLink = `${env.APP_URL}/auth/verify?token=${token}`;

    // Send email with magic link
    try {
      await resend.emails.send({
        from: "LockedIn <noreply@lockedin.app>",
        to: email,
        subject: "Sign in to LockedIn",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px;">Sign in to LockedIn</h1>
            <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
              Click the button below to sign in to your account. This link will expire in 15 minutes.
            </p>
            <a href="${magicLink}" style="display: inline-block; background: #f97316; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              Sign in to LockedIn
            </a>
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              If the button doesn't work, copy and paste this link into your browser:<br/>
              <a href="${webLink}" style="color: #f97316;">${webLink}</a>
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 40px;">
              If you didn't request this email, you can safely ignore it.
            </p>
          </div>
        `,
      });

      return c.json({ success: true, message: "Magic link sent to your email" });
    } catch (error) {
      console.error("Failed to send email:", error);
      return c.json({ success: false, message: "Failed to send email" }, 500);
    }
  }
);

// Verify magic link token
auth.post(
  "/verify",
  zValidator(
    "json",
    z.object({
      token: z.string(),
    })
  ),
  async (c) => {
    const { token } = c.req.valid("json");

    try {
      const payload = await verify(token, env.JWT_SECRET, "HS256");

      if (payload.type !== "magic-link") {
        return c.json({ success: false, message: "Invalid token type" }, 400);
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.userId as string },
      });

      if (!user) {
        return c.json({ success: false, message: "User not found" }, 404);
      }

      // Generate session token (valid for 30 days)
      const sessionToken = await sign(
        {
          userId: user.id,
          email: user.email,
          exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
          type: "session",
        },
        env.JWT_SECRET
      );

      return c.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
        token: sessionToken,
      });
    } catch (error) {
      console.error("Token verification failed:", error);
      return c.json({ success: false, message: "Invalid or expired token" }, 401);
    }
  }
);

// Get current user
auth.get("/me", async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ success: false, message: "Unauthorized" }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verify(token, env.JWT_SECRET, "HS256");

    if (payload.type !== "session") {
      return c.json({ success: false, message: "Invalid token type" }, 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
    });

    if (!user) {
      return c.json({ success: false, message: "User not found" }, 404);
    }

    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    return c.json({ success: false, message: "Invalid or expired token" }, 401);
  }
});

// Update user profile
auth.patch(
  "/me",
  zValidator(
    "json",
    z.object({
      name: z.string().optional(),
      avatarUrl: z.string().url().optional(),
      pushToken: z.string().optional(),
    })
  ),
  async (c) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return c.json({ success: false, message: "Unauthorized" }, 401);
    }

    const token = authHeader.slice(7);
    const updates = c.req.valid("json");

    try {
      const payload = await verify(token, env.JWT_SECRET, "HS256");

      const user = await prisma.user.update({
        where: { id: payload.userId as string },
        data: updates,
      });

      return c.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
      });
    } catch (error) {
      return c.json({ success: false, message: "Failed to update profile" }, 500);
    }
  }
);

export default auth;
