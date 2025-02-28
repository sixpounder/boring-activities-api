import rateLimit from "express-rate-limit";
import { hasMagicRole } from "./roles.ts";

const DEFAULT_MESSAGE = { error: 'Too many requests, please try again later.' };

export const apiMaxHitCountPerWindow = 100

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_MINUTE = 60 * 1000;

export const apiRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: apiMaxHitCountPerWindow,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: hasMagicRole,
  message: DEFAULT_MESSAGE
})

export const defaultHealthRateLimit = rateLimit({
  windowMs: ONE_MINUTE,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: hasMagicRole,
  message: DEFAULT_MESSAGE
})
