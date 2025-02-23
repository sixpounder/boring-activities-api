import { clamp, filter, nth, random, slice } from "lodash-es";
import ActivityRepository from "../repository/activity.ts";
import { Activity } from "../../shared/model/activity.ts";

export default class ActivityService {
  private activitiesRepository: ActivityRepository;

  constructor(activitiesRepository) {
    this.activitiesRepository = activitiesRepository;
  }

  async get(page: number, pageSize: number) {
    const allActivities = await this.activitiesRepository.get();
    const start = page * pageSize;
    const end = start + pageSize;
    return slice(
      allActivities,
      clamp(start, 0, allActivities.length - 1),
      clamp(end, 0, allActivities.length),
    );
  }

  async getById(id: number): Promise<Activity> {
    return await this.activitiesRepository.get(id);
  }

  async getRandom(): Promise<Activity> {
    const allEntries = await this.activitiesRepository.get();
    return nth(allEntries, random(0, allEntries.length - 1)) as Activity;
  }

  async getBy(filterFn) {
    return filter(await this.activitiesRepository.get(), filterFn);
  }
}
