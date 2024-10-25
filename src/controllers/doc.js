import { Router } from "express";

export default class DocController extends Router {
    constructor(mountPoint) {
        super();

        this.get(`${mountPoint}`, async (req, res) => {
            res.status(200);
            res.end();
        });
    };
}
