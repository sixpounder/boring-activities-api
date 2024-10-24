import express from "express";
import helmet from "helmet";
import compression from "compression";
import ActivitiesController from '../src/controllers/activities.js';
import ActivitiesService from "../src/services/activities-service.js";
import ActivitiesRepository from "../src/repository/activities-repository.js";

const app = express();
const port = 3000;

app.use(helmet());
app.use(compression());

const activitiesServiceInstance = new ActivitiesService(new ActivitiesRepository());

app.use(new ActivitiesController("/activities", activitiesServiceInstance));

app.listen(port, () => {
    console.log(`Application listening at ${port}`);
});