import { fetchYear } from "./fetchYear.js";
import { readSnapshot } from "./snapshot.js";
import { years } from "./years.js";

/**
 * One entry per conference year, id = year.
 * Years flagged `live` are fetched from Pretalx; a failed fetch fails the build.
 *
 * @returns {import("astro/loaders").Loader}
 */
export const pretalxLoader = () => ({
  name: "pretalx-loader",
  load: async ({ store, logger, parseData }) => {
    store.clear();
    for (const config of years) {
      const id = String(config.year);
      let data;
      if (config.live) {
        logger.info(`Fetching ${id} from Pretalx`);
        data = await fetchYear(config);
      } else {
        data = await readSnapshot(config.year);
      }
      store.set({ id, data: await parseData({ id, data }) });
    }
  },
});
