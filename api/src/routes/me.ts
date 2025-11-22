import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { User } from "../models/User";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const user = await User.findById(req.user!.sub).select(
    "email name phone role createdAt",
  );
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json({ data: user });
});

export default router;
