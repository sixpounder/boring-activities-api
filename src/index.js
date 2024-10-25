import express from "express";
import helmet from "helmet";
import compression from "compression";
import { rateLimit } from 'express-rate-limit'
import ActivitiesController from '../src/controllers/activities.js';
import ActivitiesService from "./services/activities.js";
import ActivitiesRepository from "./repository/activities.js";

const app = express();
const port = 3000;

app.use(helmet());
app.use(compression());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false
}));

const activitiesServiceInstance = new ActivitiesService(new ActivitiesRepository());

app.use(new ActivitiesController("/activities", activitiesServiceInstance));

app.listen(port, () => {
    console.log(`Application listening at ${port}`);
});