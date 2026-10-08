import { getCollection } from "astro:content";
import { slugify } from "./slugify.js";

export const getSponsors = async () =>
  (await getCollection("sponsors"))
    .sort((a, b) => a.data.order - b.data.order)
    .map(({ data, body }) => ({
      ...data,
      body,
      slug: slugify(data.name),
      url: `/sponsors/${slugify(data.name)}/`,
    }));
