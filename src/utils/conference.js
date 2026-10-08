import { getCollection, getEntry } from "astro:content";
import markdownIt from "markdown-it";
import { slugify } from "./slugify.js";
import { getYearConfig } from "./pretalx/years.js";

const markdown = markdownIt({ html: true, breaks: true, linkify: true });

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
