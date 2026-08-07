import { colors } from "../../../../tokens/colors";
import { spacing } from "../../../../tokens/spacing";
import { fontSize } from "../../../../tokens/fontSize";
import { fontWeights } from "../../../../tokens/fontWeight";
import { lineHeights } from "../../../../tokens/lineHeight";
import { generateVariables } from "./generate-variables";

const colorVariables = generateVariables("color", colors);
const spacingVariables = generateVariables("space", spacing);
const fontSizeVariables = generateVariables("text", fontSize);
const fontWeightVariables = generateVariables("weight", fontWeights);
const lineHeightVariables = generateVariables("leading", lineHeights);

export const cssVariables = `
  ${colorVariables}
  ${spacingVariables}
  ${fontSizeVariables}
  ${fontWeightVariables}
  ${lineHeightVariables}
`;
