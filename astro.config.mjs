// @ts-check
import "dotenv/config";
import { defineConfig } from "astro/config";
import { generateVarUtils } from "./src/utils/build-scripts/generate-variables-utilities.ts";

import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import { latestAftermovie } from "./src/data/aftermovies";

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL ?? "https://www.osfc.io",
  output: "static",
  trailingSlash: "always",
  redirects: {
    "/aftermovies/": `/aftermovies/${latestAftermovie.year}/`,
  },

  scopedStyleStrategy: "where",

  image: {
    // Speaker avatars from Pretalx, optimized at build time
    domains: ["pretalx.com", "talks.osfc.io", "cfp.osfc.io"],
  },

  integrations: [generateVarUtils(), icon(), sitemap()],
});
