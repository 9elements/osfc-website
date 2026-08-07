import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";

const inputDir = "src/assets/icons";
const outputDir = path.join(inputDir, "currentColor");

export async function replaceBlackWithCurrentColor() {
  console.log("Replacing black with currentColor in SVGs...");

  try {
    // Ensure output directory exists
    await fs.promises.mkdir(outputDir, { recursive: true });

    const files = await fs.promises.readdir(inputDir);
    const svgFiles = files.filter((file) => file.endsWith(".svg"));

    await Promise.all(
      svgFiles.map(async (file) => {
        const filePath = path.join(inputDir, file);
        const data = await fs.promises.readFile(filePath, "utf8");
        const dom = new JSDOM(data);
        const svg = dom.window.document.querySelector("svg");
        if (!svg) return;

        // Replace black color with currentColor in the SVG markup
        let svgMarkup = svg.outerHTML
          .replace(/fill="black"/gi, 'fill="currentColor"')
          .replace(/fill="#000"/gi, 'fill="currentColor"')
          .replace(/fill="#000000"/gi, 'fill="currentColor"')
          .replace(/stroke="black"/gi, 'stroke="currentColor"')
          .replace(/stroke="#000"/gi, 'stroke="currentColor"')
          .replace(/stroke="#000000"/gi, 'stroke="currentColor"');

        const outputFilePath = path.join(outputDir, file);
        await fs.promises.writeFile(outputFilePath, svgMarkup, "utf8");
      })
    );
    console.log("All SVGs processed.");
  } catch (error) {
    console.error("Error processing SVG files:", error);
  }
}

export const replaceSvgBlackIntegration = () => {
  return {
    name: "replace-svg-black-with-currentColor",
    hooks: {
      "astro:server:setup"() {
        return replaceBlackWithCurrentColor();
      },
      "astro:build:setup"() {
        return replaceBlackWithCurrentColor();
      },
    },
  };
};
