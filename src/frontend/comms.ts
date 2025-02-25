import { isNumber } from "lodash-es";

export const is2xx = (status: number | null | undefined): boolean => {
  return isNumber(status) && status >= 200 && status <= 299;
};

export const is4xx = (status: number | null | undefined): boolean => {
  return isNumber(status) && status >= 400 && status <= 499;
};

export const is5xx = (status: number | null | undefined): boolean => {
  return isNumber(status) && status >= 500 && status <= 599;
};

export type HttpVerb = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
