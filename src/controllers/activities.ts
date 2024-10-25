import { bind, lowerCase, toNumber } from "lodash-es";
import ActivityService from "../services/activity.ts";

export default class ActivitiesController {
    private activitiesService: ActivityService;

    constructor(activitiesService) {
        this.activitiesService = activitiesService;
    }

    async find(req, res, next) {
        res.json(await this.activitiesService.get());
    }

    async random(req, res, next) {
        res.json(await this.activitiesService.getRandom());
    }

    async findByCategory(req, res, next) {
        res.json(await this.activitiesService.getBy(a => lowerCase(a.category) === lowerCase(req.params.category)));
    }

    async findOne(req, res, next) {
        const id = toNumber(req.params.id);
        if (isNaN(id)) {
            res.status(400);
            res.json({ message: "Invalid id format" });
            return;
        }

        const item = await this.activitiesService.get(id);
        if (item) {
            res.json(item);
        } else {
            res.status(404);
            res.end();
        }
    }

}