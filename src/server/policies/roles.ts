import { isString } from "lodash-es";
import process from "node:process";

const ROLE_HEADER_KEY = "ba-role";
const MAGIC_ROLES: string[] = (process.env.BA_MAGIC_ROLES ?? "").split(",").map(
  (s) => s.trim(),
);

console.info(
  `Detected ${MAGIC_ROLES.length} magic roles. These will be matched agains ${ROLE_HEADER_KEY} header, if available.`,
);

export const hasMagicRole = (req) => {
  const declaredRole = req.header(ROLE_HEADER_KEY);
  return isString(declaredRole) && MAGIC_ROLES.includes(declaredRole);
}
