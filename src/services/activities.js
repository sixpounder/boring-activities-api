import { random, nth, filter } from "lodash-es";

export default class ActivitiesService {
    constructor(activitiesRepository) {
        this.activitiesRepository = activitiesRepository;
    }

    async get(id) {
        return await this.activitiesRepository.get(id);
    }

    async getRandom(id) {
        const allEntries = await this.activitiesRepository.get();
        return nth(allEntries, random(0, allEntries.length - 1));
    }

    async getBy(filterFn) {
        return filter(await this.activitiesRepository.get(), filterFn);
    }
}
