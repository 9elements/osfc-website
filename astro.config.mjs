// @ts-check
import "dotenv/config";
import { defineConfig } from "astro/config";
import { generateVarUtils } from "./src/utils/build-scripts/generate-variables-utilities.ts";
import { replaceSvgBlackIntegration } from "./src/utils/build-scripts/svg-black-to-currentcolor.js";

import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL ?? "https://osfc.io",
  output: "static",
  trailingSlash: "always",

  scopedStyleStrategy: "where",

  integrations: [
    generateVarUtils(),
    replaceSvgBlackIntegration(),
    icon({
      iconDir: "src/assets/icons/currentColor",
    }),
    sitemap(),
  ],
});
