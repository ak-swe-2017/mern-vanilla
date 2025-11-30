import { RequestHandler } from "express";
export const requireRole =
  (role: "admin" | "user"): RequestHandler =>
  (req, res, next) => {
    if (!req.user) return res.status(401).send();
    if (req.user.role !== role) return res.status(403).send();
    next();
  };
