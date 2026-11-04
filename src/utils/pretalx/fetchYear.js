import { slugify } from "../slugify.js";
import { sanitizeYearData } from "./sanitize.js";

const CFP_OSFC = "https://cfp.osfc.io/api/events";

/** Pretalx API tokens per host. Requests to other hosts are sent without a token. */
const TOKEN_ENV_BY_HOST = {
  "pretalx.com": "PRETALX_TOKEN",
  "talks.osfc.io": "TALKS_OSFC_TOKEN",
};

const authHeaders = (url) => {
  const envName = TOKEN_ENV_BY_HOST[new URL(url).host];
  const token = envName && process.env[envName];
  if (envName && !token) {
    throw new Error(`Missing ${envName} for ${url}`);
  }
  return token ? { Authorization: `Token ${token}` } : {};
};

const fetchJson = async (url, { auth = true } = {}) => {
  const response = await fetch(url, { headers: auth ? authHeaders(url) : {} });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }
  return response.json();
};

/** Pretalx returns at most 50 items per page, whatever `limit` says. */
const fetchAllPages = async (url, options) => {
  const results = [];
  let next = url;
  while (next) {
    const page = await fetchJson(next, options);
    results.push(...(page.results ?? []));
    next = page.next;
  }
  return results;
};

const uniqueBy = (items, key) =>
  Array.from(
    items.reduce((map, item) => map.set(item[key], item), new Map()).values()
  );

const compareText = (a, b) => a.localeCompare(b, "en", { sensitivity: "base" });
const byName = (a, b) => compareText(a.name, b.name);

/** Merge speakers that would share a page (same name, separate Pretalx accounts). */
const mergeSpeakersByName = (speakers) => {
  const merged = new Map();
  for (const speaker of speakers) {
    const key = slugify(speaker.name);
    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, speaker);
      continue;
    }
    merged.set(key, {
      ...existing,
      biography:
        (speaker.biography || "").length > (existing.biography || "").length
          ? speaker.biography
          : existing.biography,
      avatar_url: existing.avatar_url || speaker.avatar_url,
      submissions: [
        ...new Set([...existing.submissions, ...speaker.submissions]),
      ],
    });
  }
  return Array.from(merged.values());
};

/**
 * Fetches one conference year from Pretalx and returns it in the shape the
 * year pages expect: { year, schedule, talks, speakers, breaks, videos }.
 * Throws on any failed request.
 *
 * @param {import("./years.js").YearConfig} config
 */
export const fetchYear = async (config) => {
  const { year, event, api, videosApi = CFP_OSFC } = config;

  const submissions = await fetchAllPages(
    `${api}/${event}/submissions/?format=json&limit=200&expand=speakers,slots,slots.room,resources`
  );
  const scheduleExport = await fetchJson(config.scheduleExport);
  // Only talks in the published schedule are public; confirmed but unscheduled
  // submissions (placeholders, members-only sessions) don't get a page
  const scheduledCodes = new Set(
    scheduleExport.schedule.conference.days.flatMap((day) =>
      Object.values(day.rooms).flatMap((roomTalks) =>
        roomTalks.map((talk) => talk.code)
      )
    )
  );
  let talks = uniqueBy(submissions, "code").filter(
    (talk) => talk.state === "confirmed" && scheduledCodes.has(talk.code)
  );
  if (config.sortTalksByTitle) {
    talks = talks.sort((a, b) => compareText(a.title, b.title));
  }

  // Anonymous on purpose: authenticated requests also list speakers without a public talk
  let speakers = await fetchAllPages(
    `${api}/${event}/speakers/?format=json&limit=200`,
    {
      auth: api !== "https://pretalx.com/api/events",
    }
  );
  if (config.speakerNameFallback) {
    speakers = speakers.map((speaker) => ({
      ...speaker,
      name: speaker.name || speaker.code,
    }));
  }
  if (config.speakers === "named") {
    speakers = speakers.filter((speaker) => speaker.name);
  }
  if (config.speakers === "confirmed") {
    const talkSpeakerCodes = new Set(
      talks.flatMap((talk) =>
        (talk.speakers ?? []).map((speaker) => speaker.code)
      )
    );
    speakers = speakers.filter(
      (speaker) => speaker.name && talkSpeakerCodes.has(speaker.code)
    );
  }
  if (config.mergeSpeakersByName) {
    speakers = mergeSpeakersByName(speakers);
  }
  speakers = speakers.sort(byName);

  // Pretalx no longer lists breaks on schedules/latest; they are slots without a submission
  const breaks = config.breaks
    ? (
        await fetchAllPages(
          `${api}/${event}/slots/?format=json&limit=200&expand=room`
        )
      )
        .filter((slot) => !slot.submission && slot.description)
        .map((slot) => ({ ...slot, room: slot.room?.name }))
    : [];

  const videos = (await fetchJson(`${videosApi}/${event}/p/vimeo/`)).results
    .filter((video) => video.vimeo_link)
    .map((video) => ({
      ...video,
      vimeo_id: video.vimeo_link.substring(
        video.vimeo_link.lastIndexOf("/") + 1
      ),
    }));

  // Talk and speaker pages are addressed by slug; Astro would silently overwrite duplicates
  for (const [label, items, key] of [
    ["talk", talks, "title"],
    ["speaker", speakers, "name"],
  ]) {
    const seen = new Set();
    for (const item of items) {
      const slug = slugify(item[key]);
      if (seen.has(slug)) {
        throw new Error(`${year}: two ${label}s share the URL slug "${slug}"`);
      }
      seen.add(slug);
    }
  }

  return sanitizeYearData({
    year,
    schedule: scheduleExport.schedule.conference,
    talks,
    speakers,
    breaks,
    videos,
  });
};
