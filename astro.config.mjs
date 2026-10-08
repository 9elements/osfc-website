// @ts-check
import "dotenv/config";
import { defineConfig } from "astro/config";
import { generateVarUtils } from "./src/utils/build-scripts/generate-variables-utilities.ts";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL ?? "https://osfc.io",
  output: "static",
  trailingSlash: "always",

  scopedStyleStrategy: "where",

  integrations: [
    generateVarUtils(),
    sitemap(),
  ],
});
