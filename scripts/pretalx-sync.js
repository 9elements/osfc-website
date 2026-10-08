/**
 * Saves Pretalx data as JSON snapshots in src/data/pretalx/.
 *
 * Usage:
 *   npm run pretalx:sync           # all years
 *   npm run pretalx:sync -- 2026   # one or more years
 */
import "dotenv/config";
import fs from "node:fs/promises";
import { fetchYear } from "../src/utils/pretalx/fetchYear.js";
import { getYearConfig, years } from "../src/utils/pretalx/years.js";
import { snapshotPath } from "../src/utils/pretalx/snapshot.js";

const requested = process.argv.slice(2);
const configs = requested.length ? requested.map(getYearConfig) : years;

const unknown = requested.filter((year, i) => !configs[i]);
if (unknown.length) {
  console.error(
    `Unknown year(s): ${unknown.join(", ")}. Add them to src/utils/pretalx/years.js`
  );
  process.exit(1);
}

for (const config of configs) {
  const data = await fetchYear(config);
  await fs.writeFile(
    snapshotPath(config.year),
    `${JSON.stringify(data)}\n`
  );
  console.log(
    `✅ ${config.year}: ${data.talks.length} talks, ${data.speakers.length} speakers, ${data.breaks.length} breaks, ${data.videos.length} videos`
  );
}
