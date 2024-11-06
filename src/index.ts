import { resolve } from "node:path";
import express, { RequestHandler } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import ActivitiesController from "./controllers/activities.ts";
import ActivityService from "./services/activity.ts";
import ActivityRepository from "./repository/activity.ts";
import { bind } from "lodash-es";

const app = express();
const port = 8080;

app.use(helmet());
app.use(morgan("dev") as RequestHandler);
app.use(compression() as RequestHandler);
app.use(cors());

app.use("/", express.static(resolve("dist", "public")));

const router = express.Router();
const activitiesServiceInstance = new ActivityService(new ActivityRepository());
const activitiesController = new ActivitiesController(
  activitiesServiceInstance,
);

router.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
}));
router.get(
  "/api/activities",
  bind(activitiesController.find, activitiesController),
);
router.get(
  "/api/activities/:id(\\d+)",
  bind(activitiesController.findOne, activitiesController),
);
router.get(
  "/api/activities/random",
  bind(activitiesController.random, activitiesController),
);
router.get(
  "/api/activities/category/:category",
  bind(activitiesController.findByCategory, activitiesController),
);

app.use(router);

app.listen(port, () => {
  console.log(`Application listening at http://localhost:${port}`);
});
