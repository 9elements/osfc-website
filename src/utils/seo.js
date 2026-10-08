import { getImage } from "astro:assets";
import { site } from "@/data/site";
import { renderMarkdown } from "./conference.js";

export const absoluteUrl = (path) => new URL(path, site.url).href;

/** Plain-text excerpt of Markdown for meta descriptions. */
export const toDescription = (markdown, maxLength = 160) => {
  const text = renderMarkdown(markdown)
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.;:–-]+$/, "")}…`;
};

/** Square share image from a speaker avatar, or undefined without one. */
export const avatarSocialImage = async (avatarUrl) =>
  avatarUrl
    ? absoluteUrl(
        (
          await getImage({
            src: avatarUrl,
            width: 400,
            height: 400,
            format: "jpg",
          })
        ).src
      )
    : undefined;

export const organizationJsonLd = {
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: "Open Source Firmware Conference",
  alternateName: site.name,
  url: `${site.url}/`,
  logo: `${site.url}/assets/images/meta/favicon.svg`,
  sameAs: [
    "https://twitter.com/osfc_io",
    "https://www.linkedin.com/company/osff",
  ],
};

export const eventId = (year) => `${site.url}/archive/${year}/#event`;

/** schema.org Event for one conference year. */
export const conferenceEventJsonLd = ({ year, schedule, config }) => ({
  "@type": "Event",
  "@id": eventId(year),
  name: schedule.title,
  startDate: schedule.start,
  endDate: schedule.end,
  url: absoluteUrl(`/archive/${year}/`),
  organizer: { "@id": organizationJsonLd["@id"] },
  ...(config.venue && {
    location: {
      "@type": "Place",
      name: config.venue.name,
      address: { "@type": "PostalAddress", ...config.venue.address },
    },
  }),
});

export const personJsonLd = (year, speaker, url, image) => ({
  "@type": "Person",
  name: speaker.name,
  url,
  ...(speaker.biography && {
    description: toDescription(speaker.biography, 300),
  }),
  ...(image && { image }),
  performerIn: { "@id": eventId(year) },
});
