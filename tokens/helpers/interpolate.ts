/**
 * Creates a CSS clamp() that interpolates between two pixel sizes across a viewport range.
 * Based on https://utopia.fyi
 */
export const interpolate = ({
  min,
  max,
  vwMin = 480,
  vwMax = 1440,
}: {
  min: number;
  max: number;
  vwMin?: number;
  vwMax?: number;
}) => {
  const rootSize = 16;

  if (min === max) {
    return `${min / rootSize}rem`;
  }

  const minSize = min / rootSize;
  const maxSize = max / rootSize;
  const minViewport = vwMin / rootSize;
  const maxViewport = vwMax / rootSize;

  const slope = (maxSize - minSize) / (maxViewport - minViewport);
  const intersection = -1 * minViewport * slope + minSize;

  return `clamp(${minSize}rem, ${intersection.toFixed(2)}rem + ${(slope * 100).toFixed(2)}vw, ${maxSize}rem)`;
};
