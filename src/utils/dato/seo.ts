import { getImage } from "astro:assets";

/**
 * Takes the seo object and downloads all linked images (og:image, twitter:image) to prevent using bandwidth
 */
export const getSeoWithLocalImages = async (
  seo: any[],
  siteUrl: URL | string | undefined
) =>
  await Promise.all(
    seo.map(async (item) => {
      if (
        !item.attributes?.content.startsWith("https://www.datocms-assets.com")
      ) {
        return item;
      }

      const image = await getImage({
        src: item.attributes.content,
        width: 1200,
        format: "webp",
        inferSize: true,
      });

      return {
        ...item,
        attributes: {
          ...item.attributes,
          content: new URL(image.src, siteUrl).toString(),
        },
      };
    })
  );
