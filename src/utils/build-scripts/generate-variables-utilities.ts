import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cssVariables } from "./helpers/variables.js";
import { utilityClasses } from "./helpers/utilitiy-classes.js";

const generateCSS = () => {
  // Resolve __dirname in ESM
  // Resolve __dirname in ESM
  const rootPath = process.cwd();

  // Output path
  const outputPathVariables = path.resolve(
    rootPath,
    "src/styles/generated/_variables.css"
  );
  const outputPathUtilities = path.resolve(
    rootPath,
    "src/styles/generated/_utilities.css"
  );

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(outputPathUtilities), { recursive: true });

  // Write the file
  fs.writeFileSync(outputPathUtilities, utilityClasses);
  console.log("✅ utilities.css generated:", outputPathUtilities);
  fs.writeFileSync(outputPathVariables, cssVariables);
  console.log("✅ variables.css generated:", outputPathVariables);
};

export const generateVarUtils = () => {
  return {
    name: "generate-variables-utilities",
    hooks: {
      "astro:server:setup"() {
        return generateCSS();
      },
      "astro:build:setup"() {
        return generateCSS();
      },
    },
  };
};
