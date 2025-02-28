import { resolve } from "node:path";
import express, { RequestHandler } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import ActivitiesController from "./server/controllers/activities.ts";
import ActivityService from "./server/services/activity.ts";
import ActivityRepository from "./server/repository/activity.ts";
import { bind } from "lodash-es";
import {
  apiRateLimiter,
  defaultHealthRateLimit,
} from "./server/policies/rate-limit.ts";
import { HealthController } from "./server/controllers/health.ts";

const app = express();
const port = 8080;

app.use(morgan("dev") as RequestHandler);
app.use(compression() as RequestHandler);
app.use(helmet());
app.use(cors());

app.use("/", express.static(resolve("dist", "public")));

const activitiesServiceInstance = new ActivityService(new ActivityRepository());
const activitiesController = new ActivitiesController(
  activitiesServiceInstance,
);

const apiRouter = express.Router({ strict: true });
apiRouter.use(apiRateLimiter);
apiRouter.get(
  "/activities",
  bind(activitiesController.find, activitiesController),
);
apiRouter.get(
  "/activities/:id(\\d+)",
  bind(activitiesController.findOne, activitiesController),
);
apiRouter.get(
  "/activities/random",
  bind(activitiesController.random, activitiesController),
);
apiRouter.get(
  "/activities/category/:category",
  bind(activitiesController.findByCategory, activitiesController),
);

app.use("/api", apiRouter);

const healthRouter = express.Router();
healthRouter.use(defaultHealthRateLimit);
healthRouter.get("/", HealthController.index);

app.use("/health", healthRouter);

app.listen(port, () => {
  console.log(`Application listening at http://localhost:${port}`);
});
