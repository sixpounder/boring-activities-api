import { Router } from "express";
import { lowerCase, toNumber } from "lodash-es";

export default class ActivitiesController extends Router {
    constructor(mountPoint, activitiesService) {
        super();

        this.activitiesService = activitiesService;

        this.get(`${mountPoint}`, async (req, res) => {
            res.json(await this.activitiesService.get());
        });

        this.get(`${mountPoint}/random`, async (req, res) => {
            res.json(await this.activitiesService.getRandom());
        });

        this.get(`${mountPoint}/category/:category`, async (req, res) => {
            res.json(await this.activitiesService.getBy(a => lowerCase(a.category) === lowerCase(req.params.category)));
        });

        this.get(`${mountPoint}/:id(\d+)`, async (req, res) => {
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
        });
    };
}