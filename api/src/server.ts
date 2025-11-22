import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { connectDB } from "./db";
import auth from "./routes/auth";
import me from "./routes/me";
import account from "./routes/account";

async function main() {
  await connectDB();

  const app = express();
  app.use(helmet());
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: env.webOrigin, credentials: true }));

  app.use("/auth", auth);
  app.use("/me", me);
  app.use("/account", account);

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.listen(env.port, () =>
    console.log(`API on http://localhost:${env.port}`),
  );
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
