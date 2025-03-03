import { join, resolve } from "node:path";

export const PROJECT_ROOT = join(import.meta.dirname, "..");
export const DIST_DIR = resolve(PROJECT_ROOT, "dist");
export const PUBLIC_DIR = join(DIST_DIR, "public");
