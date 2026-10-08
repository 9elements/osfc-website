const rem = (px: number) => `${px / 16}rem`;

export const spacingPx = {
  100: 2,
  200: 10,
  300: 14,
  400: 16,
  500: 18,
  600: 24,
  700: 32,
  800: 44,
  900: 72,
  major: 112,
};

export const spacing = Object.fromEntries(
  Object.entries(spacingPx).map(([key, px]) => [key, rem(px)]),
);
