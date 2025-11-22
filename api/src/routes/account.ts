import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middlewares/requireAuth";
import { User } from "../models/User";

const router = Router();

const profileDto = z.object({
  name: z.string().min(2).max(120),
  phone: z
    .string()
    .min(7)
    .max(20)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

const passwordDto = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

router.get("/me", requireAuth, async (req, res) => {
  const u = await User.findById(req.user!.sub).select(
    "email name phone role createdAt",
  );
  if (!u) return res.status(404).json({ error: "Not found" });
  res.json({ data: u });
});

router.put("/profile", requireAuth, async (req, res) => {
  const parsed = profileDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.format());

  const { name, phone } = parsed.data;
  const u = await User.findByIdAndUpdate(
    req.user!.sub,
    { $set: { name, phone } },
    {
      new: true,
      runValidators: true,
      projection: "email name phone role createdAt",
    },
  );
  if (!u) return res.status(404).json({ error: "Not found" });
  res.json({ data: u });
});

router.put("/password", requireAuth, async (req, res) => {
  const parsed = passwordDto.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.format());

  const user = await User.findById(req.user!.sub).select(
    "passwordHash tokenVersion",
  );
  if (!user) return res.status(404).json({ error: "Not found" });

  const ok = await bcrypt.compare(
    parsed.data.currentPassword,
    user.passwordHash,
  );
  if (!ok)
    return res.status(400).json({ error: "Current password is incorrect" });

  user.passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  user.tokenVersion += 1; // revoke all existing refresh tokens
  await user.save();

  res.status(204).send();
});

export default router;
