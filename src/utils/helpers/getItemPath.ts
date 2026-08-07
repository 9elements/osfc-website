const pathPrefixMap = {
  blog_post: "/blog/",
  variable_page: "/",
};

export const getItemPath = (item: Record<string, any>) => {
  if (!item || !item._modelApiKey || !item.slug) return "#";

  const prefix = pathPrefixMap[item._modelApiKey] || "";
  return `${prefix}${item.slug}`;
};
