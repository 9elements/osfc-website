# osfc.io

Website of the [Open Source Firmware Conference](https://osfc.io), built with [Astro](https://astro.build) and deployed as a static site on Netlify.

## Setup

```sh
npm install
npm run dev
```

Requires Node.js 22.22 or newer.

## Commands

| Command                                    | Action                                                   |
| :----------------------------------------- | :------------------------------------------------------- |
| `npm run dev`                              | Dev server at `localhost:4321`                           |
| `npm run build`                            | Production build to `./dist/`                            |
| `npm run preview`                          | Preview the production build                             |
| `npm run pretalx:sync`                     | Refresh the Pretalx snapshots of all years               |
| `npm run pretalx:sync -- 2026`             | Refresh one (or more) years                              |
| `npm run compare:urls -- <old dist> [new]` | Compare the pages of two builds, respecting `_redirects` |

## Project structure

```text
public/                 Static files served as-is (beams, icons, video, _redirects, robots.txt)
scripts/                Node scripts (Pretalx sync, URL comparison)
src/
├── assets/             Images and SVGs processed by Astro
├── components/         One folder per component, CSS next to it
├── content/            Markdown content collections (pages, projects, organizers, sponsors, team)
├── data/
│   ├── pretalx/        Committed Pretalx snapshots, one JSON file per year
│   └── site.ts         Site name, navigation, newsletter URL
├── layouts/            BaseLayout (head, SEO, header, footer) and PlainLayout (text pages)
├── pages/              Routes
├── styles/             Global CSS: reset, layout, utilities, blocks, page CSS
└── utils/              Pretalx fetching, slugs, Markdown, SEO helpers
tokens/                 Design tokens that generate CSS variables and utility classes
```

## Conference data (Pretalx)

> Setting up a new conference year or archiving the last one? Follow the step-by-step guide in [docs/new-conference-year.md](docs/new-conference-year.md).

Talks, speakers, schedules and video links come from Pretalx.

- Every year is saved as `src/data/pretalx/{year}.json` and committed, so builds don't depend on Pretalx being reachable.
- `src/utils/pretalx/years.js` defines each year's Pretalx event, quirks and optional venue. Add a new year there first, then run `npm run pretalx:sync -- <year>`.
- Set `live: true` on a year to fetch it during every build instead of reading the snapshot. A failed fetch fails the build.
- Pages read the data through the `conferenceYears` content collection.

The sync needs API tokens. Copy `.env.example` to `.env` and fill in:

```sh
PRETALX_TOKEN=      # pretalx.com (2018–2025)
TALKS_OSFC_TOKEN=   # talks.osfc.io (2026 and later)
```

Authenticated Pretalx responses contain private data (emails, reviews, internal notes). `src/utils/pretalx/sanitize.js` keeps an allowlist of public fields, so only those end up in the snapshots and pages.

Talk and speaker URLs are built with `src/utils/slugify.js`, which matches the slugs of the previous 11ty site.

Speaker avatars stay on Pretalx and are optimized at build time with `astro:assets` (allowed domains in `astro.config.mjs`).

## Content

Markdown collections live in `src/content/` and are defined in `src/content.config.ts`:

| Collection   | Used on                       | Notes                                              |
| :----------- | :---------------------------- | :------------------------------------------------- |
| `pages`      | `/imprint/`, `/info/`, …      | One route per file via `src/pages/[page].astro`    |
| `projects`   | Homepage                      | `order` sets the position in the grid              |
| `organizers` | Homepage                      | `order` sets the position in the grid              |
| `sponsors`   | Homepage, `/sponsors/<name>/` | `sponsor` is the tier (`gold`, `silver`, `bronze`) |
| `team`       | `/team/`                      | `order` sets the position in the grid              |

Logos and photos are referenced relative to the Markdown file and optimized by Astro.

## Styling

- Design tokens in `tokens/` generate `src/styles/generated/_variables.css` and `_utilities.css` on every dev start and build. See `CLAUDE.md` for the naming.
- CSS is organized in cascade layers: `fonts, reset, layout, utils, blocks`. Component CSS is imported into the `blocks` layer, for example:

  ```astro
  <style is:global>
    @import "./SiteHead.css" layer(blocks);
  </style>
  ```

- `src/styles/_root.css` is unlayered on purpose and wins over utilities, like on the previous site.
- Roboto is self-hosted through Fontsource (latin subset, weights 400/700/900).

## SEO

- `BaseLayout` renders meta tags with [astro-seo](https://github.com/jonasmerlin/astro-seo) and JSON-LD with [astro-seo-schema](https://github.com/codiume/orbit/tree/main/packages/astro-seo-schema).
- Pages pass `title`, `metaTitle`, `description`, `socialImage`, `ogType` and `jsonLd` (schema.org nodes, combined with the site `Organization` into one `@graph`).
- Year pages describe the conference as an `Event`, talk pages as a sub-event with performers, speaker pages as a `Person`.
- `@astrojs/sitemap` generates the sitemap, `public/robots.txt` points to it.

## Redirects

`public/_redirects` (Netlify) keeps URLs of the previous site working, for example renamed or canceled talks and former sponsors. Run `npm run compare:urls` against an old build to check that every old page still exists or redirects.

## Deployment

Netlify builds the site with the settings in `netlify.toml`: `npm run build`, publish `dist`, Node 22. It also sets long-lived caching for the hashed files in `/_astro/` and a few security headers.

Set `PRETALX_TOKEN` and `TALKS_OSFC_TOKEN` in the Netlify environment variables once a year in `src/utils/pretalx/years.js` has `live: true`. Snapshot-only builds don't need them.
