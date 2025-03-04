import express, { RequestHandler } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import {
  ActivitiesController,
  HealthController,
} from "./server/controllers/index.ts";
import ActivityService from "./server/services/activity.ts";
import ActivityRepository from "./server/repository/activity.ts";
import {
  apiRateLimiter,
  defaultHealthRateLimit,
} from "./server/policies/rate-limit.ts";
import { inject } from "./server/lib/inject.ts";
import { PUBLIC_DIR } from "../build/index.mjs";
import { performance } from "node:perf_hooks";

performance.mark("startup-start");

const app = express();
const port = 8080;

app.use(morgan("dev") as RequestHandler);
app.use(compression() as RequestHandler);
app.use(helmet());
app.use(cors());

app.use("/", express.static(PUBLIC_DIR));

const activitiesServiceInstance: ActivityService = inject(
  ActivityService,
  new ActivityRepository(),
);
const activitiesController: ActivitiesController = inject(
  ActivitiesController,
  activitiesServiceInstance,
);

const apiRouter = express.Router({ strict: true });
apiRouter.use(apiRateLimiter);
apiRouter.get("/activities", activitiesController.find);
apiRouter.get("/activities/:id(\\d+)", activitiesController.findOne);
apiRouter.get("/activities/random", activitiesController.random);
apiRouter.get(
  "/activities/category/:category",
  activitiesController.findByCategory,
);

app.use("/api", apiRouter);

const healthRouter = express.Router();
healthRouter.use(defaultHealthRateLimit);
healthRouter.get("/", HealthController.index);

app.use("/health", healthRouter);

app.listen(port, () => {
  performance.mark("startup-end");
  const startupMeasure = performance.measure(
    "startup-measure",
    "startup-start",
    "startup-end",
  );
  console.log(`Startup done in ${startupMeasure.duration}ms`);
  console.log(`Server listening at http://localhost:${port}`);
});
