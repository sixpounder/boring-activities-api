import { first, filter, isNil } from "lodash-es";
import { resolve } from "node:path";
import { promises } from "node:fs";

export default class ActivityRepository {
    private _db: any;
    
    async get(id?: number) {
        const db = await this.ensureDb();
        if (isNil(id)) {
            return db;
        } else {
            return first(filter(db, (item) => item.id === id))
        }
    }

    async ensureDb() {
        if (isNil(this._db)) {
            this._db = JSON.parse(await promises.readFile(resolve("src", "resources", "db.json"), "utf-8"));
        }

        return this._db;
    }
}