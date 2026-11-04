import fs from "node:fs/promises";

export const snapshotPath = (year) =>
  new URL(`../../data/pretalx/${year}.json`, import.meta.url);

export const readSnapshot = async (year) =>
  JSON.parse(await fs.readFile(snapshotPath(year), "utf8"));
