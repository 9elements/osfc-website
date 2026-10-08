import { getCollection } from "astro:content";
import { byName } from "./sortEntries";
import { slugify } from "./slugify.js";

export const getSponsors = async () =>
  (await getCollection("sponsors")).sort(byName).map(({ data, body }) => ({
    ...data,
    body,
    slug: slugify(data.name),
    url: `/sponsors/${slugify(data.name)}/`,
  }));
