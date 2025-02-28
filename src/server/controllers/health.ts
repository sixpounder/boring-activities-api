import { clamp } from "lodash-es";
import { apiMaxHitCountPerWindow, apiRateLimiter } from "../policies/rate-limit.ts";

export const HealthController = {
  index: async function (req, res) {
    res.status(200);

    const limits = await apiRateLimiter.getKey(req.ip ?? "");
    const exceeded = (limits?.totalHits ?? 0) > apiMaxHitCountPerWindow;
    res.json({
      status: exceeded ? "LIMITED" : "UP",
      limits: {
        exceeded,
        remaining: clamp(apiMaxHitCountPerWindow - (limits?.totalHits ?? 0), 0, Infinity),
        resetTime: limits?.resetTime,
      },
    });
  },
};
