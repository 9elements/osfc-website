import { calculateTypeScale } from "utopia-core";

const minWidth = 320;
const maxWidth = 1140;

export const fontSize = {
  ...calculateTypeScale({
    minWidth,
    maxWidth,
    minFontSize: 18,
    maxFontSize: 22,
    minTypeScale: 1.25,
    maxTypeScale: 1.333,
    positiveSteps: 5,
    negativeSteps: 1,
  }).reduce(
    (obj, item) => ({
      ...obj,
      [`step-${item.step}`]: item.clamp,
    }),
    {}
  ),
};

// EXAMPLE: Manual scaling without Utopia
// export const fontSize = {
//   "step--1": "clamp(0.875rem, 0.8393rem + 0.1786vw, 1rem)",
//   "step-0": "clamp(1rem, 0.9643rem + 0.1786vw, 1.125rem)",
//   "step-1": "clamp(1.125rem, 0.9821rem + 0.7143vw, 1.625rem)",
//   "step-2": "clamp(1.25rem, 1.0357rem + 1.0714vw, 2rem)",
//   "step-3": "clamp(1.5rem, 1.1786rem + 1.6071vw, 2.625rem)",
//   "step-4": "clamp(1.625rem, 1.0179rem + 3.0357vw, 3.75rem)",
//   "step-5": "clamp(2rem, 1.2857rem + 3.5714vw, 4.5rem)",
//   "step-6": "clamp(2.8125rem, 0.9375rem + 9.375vw, 9.375rem)",
// };
