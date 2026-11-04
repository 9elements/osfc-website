/**
 * Keeps only public fields. Authenticated Pretalx responses also contain
 * emails, internal notes, reviews and scores, which must never be committed
 * or rendered.
 */

const pick = (object, keys) =>
  object && typeof object === "object"
    ? Object.fromEntries(
        keys.filter((key) => key in object).map((key) => [key, object[key]])
      )
    : object;

const ROOM_KEYS = ["id", "guid", "uuid", "name", "description", "position"];
const SLOT_KEYS = ["id", "start", "end", "duration", "description"];
const SPEAKER_KEYS = ["code", "name", "biography", "avatar_url", "submissions"];
const RESOURCE_KEYS = ["id", "resource", "description"];
const TALK_KEYS = [
  "code",
  "title",
  "submission_type",
  "track",
  "tags",
  "state",
  "abstract",
  "description",
  "duration",
  "slot_count",
  "content_locale",
  "do_not_record",
  "image",
];
const SCHEDULE_PERSON_KEYS = [
  "code",
  "guid",
  "name",
  "public_name",
  "biography",
  "avatar",
  "url",
];

const sanitizeTalk = (talk) => ({
  ...pick(talk, TALK_KEYS),
  speakers: (talk.speakers ?? []).map((speaker) => pick(speaker, SPEAKER_KEYS)),
  slots: (talk.slots ?? []).map((slot) => ({
    ...pick(slot, SLOT_KEYS),
    room: pick(slot.room, ROOM_KEYS),
  })),
  resources: (talk.resources ?? [])
    .filter((resource) => resource.is_public !== false)
    .map((resource) => pick(resource, RESOURCE_KEYS)),
});

const sanitizeSchedule = (schedule) => ({
  ...schedule,
  days: schedule.days.map((day) => ({
    ...day,
    rooms: Object.fromEntries(
      Object.entries(day.rooms).map(([room, talks]) => [
        room,
        talks.map(({ answers, ...talk }) => ({
          ...talk,
          persons: (talk.persons ?? []).map((person) =>
            pick(person, SCHEDULE_PERSON_KEYS)
          ),
        })),
      ])
    ),
  })),
});

export const sanitizeYearData = ({
  year,
  schedule,
  talks,
  speakers,
  breaks,
  videos,
}) => ({
  year,
  schedule: sanitizeSchedule(schedule),
  talks: talks.map(sanitizeTalk),
  speakers: speakers.map((speaker) => pick(speaker, SPEAKER_KEYS)),
  breaks: breaks.map((item) =>
    pick(item, ["room", "start", "end", "description"])
  ),
  videos: videos.map((video) =>
    pick(video, ["submission", "vimeo_link", "vimeo_id"])
  ),
});
