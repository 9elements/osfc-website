import { calculateSpaceScale } from "utopia-core";

const spaceScale = calculateSpaceScale({
  minWidth: 320,
  maxWidth: 1140,
  minSize: 16,
  maxSize: 18,
  positiveSteps: [1.5, 2, 3, 4, 6, 8],
  negativeSteps: [0.75, 0.5, 0.25],
});

export const spacing = [
  ...spaceScale.sizes,
  ...spaceScale.oneUpPairs,
  ...spaceScale.customPairs,
].reduce(
  (obj, item) => ({
    ...obj,
    ...{ [item.label]: item.clamp },
  }),
  {}
);

// EXAMPLE: Manual scaling without Utopia
// export const spacing = {
//   "3xs": "clamp(0.25rem, 0.2143rem + 0.1786vw, 0.375rem)",
//   "2xs": "clamp(0.5rem, 0.4286rem + 0.3571vw, 0.75rem)",
//   xs: "clamp(0.75rem, 0.6429rem + 0.5357vw, 1.125rem)",
//   s: "clamp(1rem, 0.8571rem + 0.7143vw, 1.5rem)",
//   m: "clamp(1.5rem, 1.2857rem + 1.0714vw, 2.25rem)",
//   l: "clamp(2rem, 1.7143rem + 1.4286vw, 3rem)",
//   xl: "clamp(3rem, 2.5714rem + 2.1429vw, 4.5rem)",
//   "2xl": "clamp(4rem, 3.4286rem + 2.8571vw, 6rem)",
//   "3xl": "clamp(6rem, 5.1429rem + 4.2857vw, 9rem)",
//   // One-up pairs
//   "3xs-2xs": "clamp(0.25rem, 0.1071rem + 0.7143vw, 0.75rem)",
//   "2xs-xs": "clamp(0.5rem, 0.3214rem + 0.8929vw, 1.125rem)",
//   "xs-s": "clamp(0.75rem, 0.5357rem + 1.0714vw, 1.5rem)",
//   "s-m": "clamp(1rem, 0.6429rem + 1.7857vw, 2.25rem)",
//   "m-l": "clamp(1.5rem, 1.0714rem + 2.1429vw, 3rem)",
//   "l-xl": "clamp(2rem, 1.2857rem + 3.5714vw, 4.5rem)",
//   "xl-2xl": "clamp(3rem, 2.1429rem + 4.2857vw, 6rem)",
//   "2xl-3xl": "clamp(4rem, 2.5714rem + 7.1429vw, 9rem)",
// };
