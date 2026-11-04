export const generateVariables = (prefix, variables) => {
  const varString = Object.entries(variables)
    .map(([key, value]) => `--${prefix}-${key}:${value};`)
    .join("\n");
  return `html{
${varString}
}`;
};
