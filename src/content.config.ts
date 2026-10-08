import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { pretalxLoader } from "./utils/pretalx/loader.js";

const localized = z.union([z.string(), z.record(z.string(), z.string())]);

const speaker = z.looseObject({
  code: z.string(),
  name: z.string(),
  biography: z.string().nullish(),
  avatar_url: z.string().nullish(),
  submissions: z.array(z.string()).optional(),
});

const talk = z.looseObject({
  code: z.string(),
  title: z.string(),
  abstract: z.string().nullish(),
  description: z.string().nullish(),
  duration: z.number().nullish(),
  speakers: z.array(speaker),
  slots: z.array(
    z.looseObject({
      start: z.string().nullish(),
      end: z.string().nullish(),
      room: z.looseObject({ name: localized }).nullish(),
    })
  ),
  resources: z.array(
    z.looseObject({
      resource: z.string().nullish(),
      description: z.string().nullish(),
    })
  ),
});

const conferenceYears = defineCollection({
  loader: pretalxLoader(),
  schema: z.object({
    year: z.number(),
    schedule: z.looseObject({
      days: z.array(
        z.looseObject({
          date: z.string(),
          rooms: z.record(z.string(), z.array(z.any())),
        })
      ),
      rooms: z.array(z.looseObject({ name: z.string() })),
    }),
    talks: z.array(talk),
    speakers: z.array(speaker),
    breaks: z.array(
      z.looseObject({
        start: z.string(),
        end: z.string(),
        room: localized,
        description: localized,
      })
    ),
    videos: z.array(
      z.object({
        submission: z.string(),
        vimeo_link: z.string(),
        vimeo_id: z.string(),
      })
    ),
  }),
});

export const collections = { conferenceYears };
