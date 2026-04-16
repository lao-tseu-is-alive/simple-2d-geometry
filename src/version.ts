import pkg from "../package.json" with { type: "json" };

const rawName = pkg.name.split('/').pop() || "";
export const APP = rawName.replace(/-([a-z0-9])/g, (_, letter) => letter?.toUpperCase() ?? "");

export const VERSION = pkg.version;
export const BUILD_DATE = new Date().toISOString();
