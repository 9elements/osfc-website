import { interpolate } from "./helpers/interpolate";
import { spacing, spacingPx } from "./spacing";

export const fontSize = {
  ...spacing,
  "200-300": interpolate({ min: spacingPx[200], max: spacingPx[300] }),
  "300-400": interpolate({ min: spacingPx[300], max: spacingPx[400] }),
  "400-500": interpolate({ min: spacingPx[400], max: spacingPx[500] }),
  "500-600": interpolate({ min: spacingPx[500], max: spacingPx[600] }),
  "600-700": interpolate({ min: spacingPx[600], max: spacingPx[700] }),
  "700-800": interpolate({ min: spacingPx[700], max: spacingPx[800] }),
  "800-900": interpolate({ min: spacingPx[800], max: spacingPx[900] }),
  "800-major": interpolate({ min: spacingPx[800], max: spacingPx.major }),
};
