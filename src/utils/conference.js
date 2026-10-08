import { getCollection, getEntry } from "astro:content";
import markdownIt from "markdown-it";
import { slugify } from "./slugify.js";
import { currentYear, getYearConfig, latestYear } from "./pretalx/years.js";

// No raw HTML: speakers write these texts in Pretalx
const markdown = markdownIt({ html: false, breaks: true, linkify: true });

// Pretalx texts use any heading level; start them at <h2> below the page's own <h1>
markdown.core.ruler.push("normalize_headings", (state) => {
  const headings = state.tokens.filter(
    (token) => token.type === "heading_open" || token.type === "heading_close"
  );
  if (!headings.length) return;
  const shift =
    2 - Math.min(...headings.map((token) => Number(token.tag.slice(1))));
  for (const token of headings) {
    token.tag = `h${Math.min(Number(token.tag.slice(1)) + shift, 6)}`;
  }
});

export const renderMarkdown = (value) => markdown.render(value ?? "");

// Eleventy's default markdown-it options, so text pages render exactly like before
const pageMarkdown = markdownIt({ html: true });
export const renderPageMarkdown = (value) => pageMarkdown.render(value ?? "");

export const getConferenceYears = async () =>
  (await getCollection("conferenceYears")).map((entry) => ({
    ...entry.data,
    config: getYearConfig(entry.data.year),
  }));

export const getConferenceYear = async (year) => {
  const entry = await getEntry("conferenceYears", String(year));
  return { ...entry.data, config: getYearConfig(year) };
};

/** Years below currentYear are archived. */
export const isArchived = (conference) => conference.year < currentYear;

/** The newest conference year with its archive state, used by navigation and homepage. */
export const getLatestConference = async () => {
  const conference = await getConferenceYear(latestYear.year);
  return { ...conference, archived: isArchived(conference) };
};

export const talkPath = (year, talk) =>
  `/${year}/talks/${slugify(talk.title)}/`;
export const speakerPath = (year, speaker) =>
  `/${year}/speakers/${slugify(speaker.name)}/`;

export const padNumber = (value, size = 2) => String(value).padStart(size, "0");

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Formats the date part of an ISO string in the event's own time zone,
 * e.g. "Tuesday, 09/02" or (with `monthName`) "Tuesday, Sep 02".
 */
export const formatDay = (isoString, { monthName = false } = {}) => {
  const [year, month, day] = isoString.slice(0, 10).split("-").map(Number);
  const weekday =
    WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return monthName
    ? `${weekday}, ${MONTHS[month - 1]} ${padNumber(day)}`
    : `${weekday}, ${padNumber(month)}/${padNumber(day)}`;
};

export const joinNames = (people, key) =>
  people.map((person) => person[key]).join(", ");
