export const is2xx = (status: number): boolean => {
  return status >= 200 && status <= 299;
};

export const is4xx = (status: number): boolean => {
  return status >= 400 && status <= 499;
};

export type HttpVerb = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
