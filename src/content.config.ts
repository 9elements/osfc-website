import { defineCollection } from "astro:content";
import { fetchDatoCMS } from "./utils/dato";

import { VARIABLE_PAGES_QUERY } from "./utils/dato/queries/variablePages";
import { BLOG_POSTS_QUERY } from "./utils/dato/queries/blogPosts";

const variablePages = defineCollection({
  loader: async () => {
    const data = await fetchDatoCMS(VARIABLE_PAGES_QUERY);
    return data.allVariablePages;
  },
});

const blogPosts = defineCollection({
  loader: async () => {
    const data = await fetchDatoCMS(BLOG_POSTS_QUERY);
    return data.allBlogPosts;
  },
});

export const collections = {
  variablePages,
  blogPosts,
  // Add other collections here as needed
};
