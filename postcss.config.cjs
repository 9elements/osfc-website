/** @type {import('postcss-load-config').Config} */
module.exports = {
  map: process.env.NODE_ENV === "production" ? false : { inline: true },
  plugins: [
    require("@csstools/postcss-global-data")({
      files: ["./src/styles/_media.css"],
    }),
    require("postcss-import-ext-glob"),
    require("postcss-import"),
    require("postcss-preset-env")({
      stage: 2,
      features: {
        "nesting-rules": true,
        "custom-properties": false,
        "custom-media-queries": true,
        "prefers-color-scheme-query": false,
        "focus-visible-pseudo-class": false,
        "logical-properties-and-values": false,
      },
    }),
  ],
};
