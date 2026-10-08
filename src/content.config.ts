import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
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

const pages = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/pages" }),
  schema: z.object({ title: z.string() }),
});

const logoSize = z.enum(["s", "m", "l"]).optional();

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      image: image(),
      link: z.url(),
      size: logoSize,
    }),
});

const organizers = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/organizers" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      image: image(),
      link: z.url(),
      size: logoSize,
    }),
});

const sponsors = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/sponsors" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      image: image(),
      link: z.url(),
      linkText: z.string().optional(),
      sponsor: z.enum(["gold", "silver", "bronze"]),
      size: logoSize,
    }),
});

const team = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/team" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      position: z.string(),
      image: image(),
    }),
});

export const collections = {
  conferenceYears,
  pages,
  projects,
  organizers,
  sponsors,
  team,
};
