import { Request } from "express"
import { toNumber } from "lodash-es";

export const getPageable = (req: Request) => {
    const page: number = req.query.page ? toNumber(req.query.page) : 0;
    const pageSize: number = req.query.pageSize ? toNumber(req.query.pageSize) : 10;

    return [page, pageSize];
}