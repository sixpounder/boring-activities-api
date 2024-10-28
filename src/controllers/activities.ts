import { lowerCase, toNumber } from "lodash-es";
import ActivityService from "../services/activity.ts";
import { getPageable } from "../lib/request.ts";
import { NextFunction, Request, Response } from "express";

export default class ActivitiesController {
    private activitiesService: ActivityService;

    constructor(activitiesService) {
        this.activitiesService = activitiesService;
    }

    async find(req: Request, res: Response, _next: NextFunction) {
        const [page, pageSize] = getPageable(req);
        res.json(await this.activitiesService.get(page, pageSize));
    }

    async random(_req_: Request, res: Response, _next: NextFunction) {
        res.json(await this.activitiesService.getRandom());
    }

    async findByCategory(req: Request, res: Response, _next: NextFunction) {
        res.json(await this.activitiesService.getBy(a => lowerCase(a.category) === lowerCase(req.params.category)));
    }

    async findOne(req: Request, res: Response, _next: NextFunction) {
        const id = toNumber(req.params.id);
        if (isNaN(id)) {
            res.status(400);
            res.json({ message: "Invalid id format" });
            return;
        }

        const item = await this.activitiesService.getById(id);
        if (item) {
            res.json(item);
        } else {
            res.status(404);
            res.end();
        }
    }

}