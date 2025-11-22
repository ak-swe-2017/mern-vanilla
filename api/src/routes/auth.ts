import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import type { CookieOptions } from "express";
import { env } from "../config/env";

const router = Router();

const refreshCookieName = "rjid";
const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false, // set true in prod behind HTTPS
  sameSite: "lax",
  path: "/auth/refresh",
  maxAge: env.refreshTtl * 1000,
};

const registerDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  phone: z.string().min(7).max(20).optional(),
});

const loginDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post("/register", async (req, res) => {
  const parsed = registerDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.format());

  const exists = await User.findOne({ email: parsed.data.email });
  if (exists) return res.status(409).json({ error: "Email already in use" });

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await User.create({
    email: parsed.data.email,
    passwordHash,
    name: parsed.data.name,
    phone: parsed.data.phone,
  });

  const payload = {
    sub: String(user._id),
    role: user.role as "user" | "admin",
    tv: user.tokenVersion,
  };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  res.cookie(refreshCookieName, refreshToken, refreshCookieOptions);
  return res.status(201).json({ accessToken });
});

router.post("/login", async (req, res) => {
  const parsed = loginDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.format());

  const user = await User.findOne({ email: parsed.data.email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const payload = {
    sub: String(user._id),
    role: user.role as "user" | "admin",
    tv: user.tokenVersion,
  };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  res.cookie(refreshCookieName, refreshToken, refreshCookieOptions);
  return res.json({ accessToken });
});

router.post("/refresh", async (req, res) => {
  const token = req.cookies?.[refreshCookieName];
  if (!token) return res.status(401).json({ error: "No refresh" });

  try {
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.sub).select("role tokenVersion");
    if (!user || user.tokenVersion !== payload.tv) throw new Error("stale");

    // rotate
    const fresh = {
      sub: String(user._id),
      role: user.role as "user" | "admin",
      tv: user.tokenVersion,
    };
    const newAccess = signAccessToken(fresh);
    const newRefresh = signRefreshToken(fresh);
    res.cookie(refreshCookieName, newRefresh, refreshCookieOptions);
    return res.json({ accessToken: newAccess });
  } catch {
    return res.status(401).json({ error: "Invalid refresh" });
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie(refreshCookieName, {
    ...refreshCookieOptions,
    maxAge: undefined,
  });
  return res.status(204).send();
});

export default router;
