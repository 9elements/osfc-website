import { getImage } from "astro:assets";
import type { Event, Organization, Person, WebSite } from "schema-dts";
import { site } from "@/data/site";
import { renderMarkdown, speakerPath, talkPath } from "./conference.js";

type Speaker = { name: string; biography?: string | null };
type Talk = {
  title: string;
  speakers: Speaker[];
  slots: {
    start?: string | null;
    end?: string | null;
    room?: { name?: unknown } | null;
  }[];
};
type Venue = {
  name: string;
  address: {
    streetAddress: string;
    postalCode: string;
    addressLocality: string;
    addressCountry: string;
  };
};

const ORGANIZATION_ID = `${site.url}/#organization`;

export const absoluteUrl = (path: string) => new URL(path, site.url).href;

/** Plain-text excerpt of Markdown for meta descriptions. */
export const toDescription = (markdown: string, maxLength = 160) => {
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
export const avatarSocialImage = async (avatarUrl?: string | null) =>
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

export const organizationJsonLd: Organization = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Open Source Firmware Conference",
  alternateName: site.name,
  url: `${site.url}/`,
  logo: `${site.url}/assets/images/meta/favicon.svg`,
  sameAs: [
    "https://twitter.com/osfc_io",
    "https://www.linkedin.com/company/osff",
  ],
};

export const webSiteJsonLd: WebSite = {
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: "Open Source Firmware Conference",
  alternateName: site.name,
  url: `${site.url}/`,
  publisher: { "@id": ORGANIZATION_ID },
};

export const eventId = (year: number) => `${site.url}/archive/${year}/#event`;

/** schema.org Event for one conference year. */
export const conferenceEventJsonLd = ({
  year,
  schedule,
  config,
}: {
  year: number;
  schedule: { title?: string; start?: string; end?: string };
  config: { venue?: Venue };
}): Event => ({
  "@type": "Event",
  "@id": eventId(year),
  name: schedule.title ?? `Open Source Firmware Conference ${year}`,
  ...(schedule.start ? { startDate: schedule.start } : {}),
  ...(schedule.end ? { endDate: schedule.end } : {}),
  url: absoluteUrl(`/archive/${year}/`),
  organizer: { "@id": ORGANIZATION_ID },
  ...(config.venue
    ? {
        location: {
          "@type": "Place",
          name: config.venue.name,
          address: { "@type": "PostalAddress", ...config.venue.address },
        },
      }
    : {}),
});

/** schema.org Event for a single talk, part of the year's conference. */
export const talkEventJsonLd = (
  year: number,
  talk: Talk,
  description: string
): Event => {
  const slot = talk.slots[0];
  const room = (slot?.room?.name as { en?: string } | undefined)?.en;
  return {
    "@type": "Event",
    name: talk.title,
    description,
    url: absoluteUrl(talkPath(year, talk)),
    ...(slot?.start ? { startDate: slot.start } : {}),
    ...(slot?.end ? { endDate: slot.end } : {}),
    ...(room ? { location: { "@type": "Place", name: room } } : {}),
    superEvent: { "@id": eventId(year) },
    performer: talk.speakers.map(
      (speaker): Person => ({
        "@type": "Person",
        name: speaker.name,
        url: absoluteUrl(speakerPath(year, speaker)),
      })
    ),
  };
};

export const personJsonLd = (
  year: number,
  speaker: Speaker,
  url: string,
  image?: string
): Person => ({
  "@type": "Person",
  name: speaker.name,
  url,
  ...(speaker.biography
    ? { description: toDescription(speaker.biography, 300) }
    : {}),
  ...(image ? { image } : {}),
  performerIn: { "@id": eventId(year) },
});
