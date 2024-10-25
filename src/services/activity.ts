import { random, nth, filter } from "lodash-es";
import ActivityRepository from "../repository/activity.ts";

export default class ActivityService {
    private activitiesRepository: ActivityRepository;

    constructor(activitiesRepository) {
        this.activitiesRepository = activitiesRepository;
    }

    async get(id?: number) {
        return await this.activitiesRepository.get(id);
    }

    async getRandom() {
        const allEntries = await this.activitiesRepository.get();
        return nth(allEntries, random(0, allEntries.length - 1));
    }

    async getBy(filterFn) {
        return filter(await this.activitiesRepository.get(), filterFn);
    }
}
