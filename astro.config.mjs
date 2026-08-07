// @ts-check
import "dotenv/config";
import { defineConfig, envField } from "astro/config";
import { generateVarUtils } from "./src/utils/build-scripts/generate-variables-utilities.ts";
import { replaceSvgBlackIntegration } from "./src/utils/build-scripts/svg-black-to-currentcolor.js";

import icon from "astro-icon";
import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";

const isLivePreview = process.env.LIVE_PREVIEW === "true";

const site =
  process.env.SITE_URL ?? `http://localhost:${process.env.PORT ?? 4321}`;

// Integration to dynamically control prerendering based on environment
function dynamicPrerenderIntegration() {
  return {
    name: "dynamic-prerender",
    hooks: {
      "astro:route:setup": ({ route }) => {
        // In live preview mode, disable prerendering for dynamic pages
        if (isLivePreview) {
          if (
            route.component.endsWith("[postSlug].astro") ||
            route.route === "/"
          ) {
            route.prerender = false;
          }
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site,
  output: "static",
  // The adapter musn't be included when not in LivePreview because of issues with SVG Handling within Dato's <Picture> component
  adapter: isLivePreview
    ? netlify({
        imageCDN: false,
      })
    : undefined, // netlify adapter must be enabled on netlify for server-rendered pages

  scopedStyleStrategy: "where",

  env: {
    schema: {
      DATOCMS_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      LIVE_PREVIEW: envField.boolean({
        context: "client",
        access: "public",
        default: isLivePreview,
      }),
      ENDPOINT_URL: envField.string({
        context: "client",
        access: "public",
        default: "https://graphql.datocms.com",
      }),
    },
  },

  integrations: [
    dynamicPrerenderIntegration(),
    generateVarUtils(),
    replaceSvgBlackIntegration(),
    icon({
      iconDir: "src/assets/icons/currentColor",
    }),
    sitemap(),
  ],

  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.datocms-assets.com",
      },
    ],
  },
});
