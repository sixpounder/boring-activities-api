import rateLimit from "express-rate-limit";
import { hasMagicRole } from "./roles.ts";

export const apiMaxHitCountPerWindow = 100

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: apiMaxHitCountPerWindow,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: hasMagicRole,
})

export const defaultHealthRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: hasMagicRole,
})
