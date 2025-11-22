import "dotenv/config";

const toNum = (v: string | undefined, d: number) =>
  v && /^\d+$/.test(v) ? Number(v) : d;

export const env = {
  port: toNum(process.env.PORT, 4000),
  mongoUri: process.env.MONGO_URI ?? "mongodb://localhost:27017/vanilla_mern",
  webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
  accessSecret: process.env.JWT_ACCESS_SECRET ?? "dev-access",
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? "dev-refresh",
  accessTtl: toNum(process.env.ACCESS_TTL, 900),
  refreshTtl: toNum(process.env.REFRESH_TTL, 604800),
} as const;
