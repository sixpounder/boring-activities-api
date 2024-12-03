import { resolve } from "node:path";
import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import ActivitiesController from "./controllers/activities.ts";
import ActivityService from "./services/activity.ts";
import ActivityRepository from "./repository/activity.ts";
import { bind, isString } from "lodash-es";

const app = express();
const port = 8080;

const ROLE_HEADER_KEY = "ba-role";
const MAGIC_ROLES: string[] = (process.env.BA_MAGIC_ROLES ?? "").split(",").map(s => s.trim());
console.info(`Detected ${MAGIC_ROLES.length} magic roles. These will be matched agains ${ROLE_HEADER_KEY} header, if available.`);

app.use(morgan("dev") as RequestHandler);
app.use(compression() as RequestHandler);
app.use(helmet());
app.use(cors());

app.use("/", express.static(resolve("dist", "public")));

const activitiesServiceInstance = new ActivityService(new ActivityRepository());
const activitiesController = new ActivitiesController(
  activitiesServiceInstance,
);

const router = express.Router();
router.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: (req, _res) => {
    const declaredRole = req.header(ROLE_HEADER_KEY);
    return isString(declaredRole) && MAGIC_ROLES.includes(declaredRole);
  },
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
