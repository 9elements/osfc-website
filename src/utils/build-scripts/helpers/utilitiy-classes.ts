import { colors } from "../../../../tokens/colors";
import { spacing } from "../../../../tokens/spacing";
import { fontWeights } from "../../../../tokens/fontWeight";
import { fontSize } from "../../../../tokens/fontSize";
import { lineHeights } from "../../../../tokens/lineHeight";

const fontSizeUtilities = Object.keys(fontSize)
  .map((key) => `.text-${key} { font-size: var(--text-${key}); }`)
  .join("\n");

const colorUtilities = Object.keys(colors)
  .map(
    (key) =>
      `.bg-${key} { background-color: var(--color-${key}); }
.text-${key} { color: var(--color-${key}); }`
  )
  .join("\n");

const paddingUtilities = Object.keys(spacing)
  .map(
    (key) =>
      `.p-${key} { padding: var(--space-${key}); }
.pt-${key} { padding-block-start: var(--space-${key}); }
.pb-${key} { padding-block-end: var(--space-${key}); }
.py-${key} { padding-block: var(--space-${key}); }
.px-${key} { padding-inline: var(--space-${key}); } `
  )
  .join("\n");

const stackUtilities = Object.keys(spacing)
  .map(
    (key) =>
      `:where(.stack-${key}) > * + * {
  --stack-space: var(--space-${key});
  margin-block-start: var(--stack-space, 1rem);
}`
  )
  .join("\n");

const fontWeightUtilities = Object.keys(fontWeights)
  .map((key) => {
    const typedKey = key as keyof typeof fontWeights;
    return `.weight-${key} { font-weight: ${fontWeights[typedKey]}; }`;
  })
  .join("\n");

const lineHeightUtilities = Object.keys(lineHeights)
  .map((key) => `.leading-${key} { line-height: var(--leading-${key}); }`)
  .join("\n");

export const utilityClasses = [
  fontSizeUtilities,
  colorUtilities,
  paddingUtilities,
  fontWeightUtilities,
  stackUtilities,
  lineHeightUtilities,
].join("\n");
