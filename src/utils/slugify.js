import sindresorhusSlugify from "@sindresorhus/slugify";

/** Same options as Eleventy's `slugify` filter, so URLs match the old site. */
export const slugify = (str) =>
  sindresorhusSlugify(String(str), { decamelize: false });
