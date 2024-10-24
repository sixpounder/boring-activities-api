import { random, nth } from "lodash-es";

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
}