import { latestAftermovie } from "./aftermovies";

export const site = {
  name: "OSFC",
  authorName: "9elements Cyber Security",
  authorEmail: "contact@9elements.com",
  metaDesc:
    "Change the way of firmware development, collaborate with others and share knowledge.",
  url: "https://www.osfc.io",
  newsletterUrl: "https://mailchi.mp/01a2d5ccbe95/osfc-subscription",
};

interface NavItem {
  text: string;
  url: string;
  /** Path prefix that marks the item as active; defaults to `url`. */
  match?: string;
}

/** Main navigation; the year links follow the newest conference year automatically. */
export const getNavigation = ({
  year,
  archived,
}: {
  year: number;
  archived: boolean;
}): NavItem[] => [
  {
    text: "Aftermovies",
    url: `/aftermovies/${latestAftermovie.year}/`,
    match: "/aftermovies/",
  },
  archived
    ? { text: `Talks ${year}`, url: `/archive/${year}/` }
    : { text: `Schedule ${year}`, url: `/${year}/schedule/` },
  { text: "Team", url: "/team/" },
  { text: "COC", url: "/code-of-conduct/" },
  { text: "Archive", url: `/archive/${year}/` },
];
