import type { NextFunction, Request, Response } from "express";
import { lowerCase, toNumber } from "lodash-es";
import { getPageable } from "../lib/request.ts";
import type { Activity } from "../../shared/model/activity.ts";
import type ActivityService from "../services/activity.ts";

export class ActivitiesController {
  private activitiesService: ActivityService;

  constructor(activitiesService: ActivityService) {
    this.activitiesService = activitiesService;
  }

  public async find(req: Request, res: Response, _next: NextFunction) {
    const [page, pageSize] = getPageable(req);
    res.json(await this.activitiesService.get(page, pageSize));
  }

  public async random(_req_: Request, res: Response, _next: NextFunction) {
    res.json(await this.activitiesService.getRandom());
  }

  public async findByCategory(
    req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    res.json(
      await this.activitiesService.getBy((activity: Activity) =>
        lowerCase(activity.category) === lowerCase(req.params.category)
      ),
    );
  }

  public async findOne(req: Request, res: Response, _next: NextFunction) {
    const id = toNumber(req.params.id);
    if (isNaN(id)) {
      res.status(400);
      res.json({ message: "Invalid id format" });
      return;
    }

    const item: Activity = await this.activitiesService.getById(id);
    if (item) {
      res.json(item);
    } else {
      res.status(404);
      res.end();
    }
  }
}
