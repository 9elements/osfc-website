/**
 * Pretalx source config per conference year.
 *
 * To add a new year, follow docs/new-conference-year.md.
 *
 * The flags on old years reproduce how the 11ty site shaped each year's data,
 * so archived pages stay identical.
 *
 * @typedef {object} YearConfig
 * @property {number} year
 * @property {string} event Pretalx event slug
 * @property {string} api Pretalx API base, without trailing slash
 * @property {string} scheduleExport URL of the public schedule.json export
 * @property {string} [videosApi] API base for the Vimeo plugin endpoint, defaults to cfp.osfc.io
 * @property {boolean} [breaks] fetch breaks from schedules/latest
 * @property {"all" | "named" | "confirmed"} [speakers] which speakers get a page
 * @property {boolean} [speakerNameFallback] use the speaker code when the name is empty
 * @property {boolean} [mergeSpeakersByName] merge speakers that would share a slug
 * @property {boolean} [sortTalksByTitle]
 * @property {Venue} [venue] shown on the homepage and used for schema.org Event data
 * @property {boolean} live true: every build fetches fresh data from Pretalx.
 *   false: the build reads the saved snapshot in src/data/pretalx/{year}.json.
 *
 * @typedef {object} Venue
 * @property {string} name
 * @property {{ streetAddress: string, postalCode: string, addressLocality: string, addressCountry: string }} address
 *   addressCountry is the two-letter country code, e.g. "NL"
 * @property {string} mapsUrl Google Maps link
 * @property {string} mapImage file name in src/assets/images/venue-maps/
 */

const PRETALX = "https://pretalx.com/api/events";
const TALKS_OSFC = "https://talks.osfc.io/api/events";

/** @type {YearConfig[]} */
export const years = [
  {
    year: 2018,
    live: false,
    event: "osfc2018",
    api: PRETALX,
    scheduleExport:
      "https://pretalx.com/osfc2018/schedule/export/schedule.json",
  },
  {
    year: 2019,
    live: false,
    event: "osfc2019",
    api: PRETALX,
    scheduleExport:
      "https://pretalx.com/osfc2019/schedule/export/schedule.json",
  },
  {
    year: 2020,
    live: false,
    event: "osfc2020",
    api: PRETALX,
    scheduleExport:
      "https://pretalx.com/osfc2020/schedule/export/schedule.json",
  },
  {
    year: 2021,
    live: false,
    event: "osfc2021",
    api: PRETALX,
    scheduleExport:
      "https://talks.osfc.io/osfc2021/schedule/export/schedule.json",
  },
  {
    year: 2022,
    live: false,
    event: "osfc2022",
    api: PRETALX,
    scheduleExport:
      "https://talks.osfc.io/osfc2022/schedule/export/schedule.json",
    breaks: true,
  },
  {
    year: 2023,
    live: false,
    event: "open-source-firmware-conference-2023",
    api: PRETALX,
    scheduleExport:
      "https://talks.osfc.io/open-source-firmware-conference-2023/schedule/export/schedule.json",
    breaks: true,
    speakerNameFallback: true,
  },
  {
    year: 2024,
    live: false,
    event: "osfc-2024",
    api: PRETALX,
    scheduleExport:
      "https://talks.osfc.io/osfc-2024/schedule/export/schedule.json",
    breaks: true,
  },
  {
    year: 2025,
    live: false,
    event: "osfc-2025",
    api: PRETALX,
    scheduleExport:
      "https://talks.osfc.io/osfc-2025/schedule/export/schedule.json",
    breaks: true,
    speakers: "named",
  },
  {
    year: 2026,
    live: true,
    event: "osfc-2026",
    api: TALKS_OSFC,
    scheduleExport:
      "https://talks.osfc.io/osfc-2026/schedule/export/schedule.json",
    videosApi: TALKS_OSFC,
    breaks: true,
    speakers: "confirmed",
    mergeSpeakersByName: true,
    sortTalksByTitle: true,
    venue: {
      name: "Pakhuis de Zwijger",
      address: {
        streetAddress: "Piet Heinkade 179",
        postalCode: "1019 HC",
        addressLocality: "Amsterdam",
        addressCountry: "NL",
      },
      mapsUrl: "https://maps.app.goo.gl/GqKyRCQtUduvPuas9",
      mapImage: "netherlands.png",
    },
  },
];

/**
 * Every year below currentYear counts as archived: the homepage says "took place",
 * the navigation and talk pages link to the archive. Once the conference of
 * currentYear is added above, the site points to its schedule instead.
 */
export const currentYear = 2027;

/** The newest year drives the navigation and the homepage. */
export const latestYear = years.at(-1);

export const getYearConfig = (year) =>
  years.find((y) => y.year === Number(year));
