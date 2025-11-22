import { sign, verify, type JwtPayload, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

type Base = { sub: string; role: "user" | "admin"; tv: number };

const accessOpts: SignOptions = { expiresIn: env.accessTtl };
const refreshOpts: SignOptions = { expiresIn: env.refreshTtl };

export function signAccessToken(p: Base) {
  return sign(p, env.accessSecret, accessOpts);
}
export function signRefreshToken(p: Base) {
  return sign(p, env.refreshSecret, refreshOpts);
}
export function verifyAccessToken(t: string): Base {
  return verify(t, env.accessSecret) as JwtPayload as Base;
}
export function verifyRefreshToken(t: string): Base {
  return verify(t, env.refreshSecret) as JwtPayload as Base;
}
