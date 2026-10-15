# Adding a new conference year and archiving the old one

This guide is for anyone who needs to update osfc.io for a new conference, no frontend experience needed. **Almost everything happens in one file:** `src/utils/pretalx/years.js` (the aftermovie has its own list, see Part 2). Navigation, homepage, talk pages and the archive update themselves from it.

The examples use **2027** as the new year. Replace it with the year you're setting up.

## The two settings that matter

Both live in `src/utils/pretalx/years.js`.

| Setting                | What it does                                                                                                                                                                                                                                                   |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `currentYear` (bottom) | Every year **below** it counts as archived. If the newest year in the list is below `currentYear`, the homepage says "took place" and links to the archive. If it equals `currentYear`, the homepage, navigation and talk pages point to its schedule instead. |
| `live` (on each year)  | `true`: every build downloads the year fresh from Pretalx. `false`: the build uses the saved copy in `src/data/pretalx/<year>.json`.                                                                                                                           |

## What you need

- Node.js 22.22 or newer, then `npm install` once in the project folder.
- A `.env` file in the project folder with the Pretalx API token (ask the team, never commit it):
  ```sh
  TALKS_OSFC_TOKEN=...
  ```
- The **published** schedule of the new year in Pretalx. Before Pretalx publishes it, the download fails. Add the year only after that.

---

## Part 1: Announce the new conference

Do this once the schedule of the new year is published in Pretalx.

### 1. Add the year

Open `src/utils/pretalx/years.js`. Copy the last entry in the `years` list, paste it below, and change these fields:

| Field            | Example                                                           | Where to find it                                       |
| :--------------- | :---------------------------------------------------------------- | :----------------------------------------------------- |
| `year`           | `2027`                                                            |                                                        |
| `live`           | `true`                                                            | Keeps the site in sync while the program changes.      |
| `event`          | `"osfc-2027"`                                                     | The part after `talks.osfc.io/` in the Pretalx URL.    |
| `scheduleExport` | `"https://talks.osfc.io/osfc-2027/schedule/export/schedule.json"` | Same slug as `event`.                                  |
| `venue.name`     | `"Venue name"`                                                    |                                                        |
| `venue.address`  | street, postal code, city, country                                | `addressCountry` is the two-letter code, e.g. `"DE"`.  |
| `venue.mapsUrl`  | `"https://maps.app.goo.gl/…"`                                     | Google Maps → Share → Copy link.                       |
| `venue.mapImage` | `"netherlands.png"`                                               | A file in `src/assets/images/venue-maps/` (see below). |

Leave all other fields exactly as copied.

Then set the old year to `live: false` (it's finished), and check that `currentYear` at the bottom of the file is the new year:

```js
export const currentYear = 2027;
```

**Venue map image:** the homepage shows Oscar waving a flag. Available images are in `src/assets/images/venue-maps/` (`netherlands.png`, `sweden.png`, `usa.png`). For a new country, ask a designer for a new image and save it in that folder.

### 2. Check it locally

```sh
npm run dev
```

Open `http://localhost:4321/`. The navigation now says "Schedule 2027", and the homepage shows the new venue and a "See the 2027 schedule" button.

If the start fails:

| Message                        | Cause and fix                                                                 |
| :----------------------------- | :---------------------------------------------------------------------------- |
| `Missing TALKS_OSFC_TOKEN`     | The token isn't in `.env`.                                                    |
| `404 … schedule.json`          | The schedule isn't published in Pretalx yet, or `event` is misspelled.        |
| `two talks share the URL slug` | Two talks (or speakers) have the same title (or name). Rename one in Pretalx. |
| `Venue map "…" not found`      | `venue.mapImage` doesn't match a file in `src/assets/images/venue-maps/`.     |

### 3. Publish

1. Commit and push. Netlify deploys automatically.
2. In Netlify, check **Site configuration → Environment variables** for `TALKS_OSFC_TOKEN`. Add it once if it's missing; live years need it.

When the program changes in Pretalx, update the site with **Deploys → Trigger deploy → Deploy site** in Netlify.

---

## Part 2: Archive the conference afterwards

Do this once the recordings are linked in Pretalx.

### 1. Save the final data

```sh
npm run pretalx:sync -- 2027
```

You should see a line like `✅ 2027: 35 talks, 30 speakers, …`.

### 2. Switch to archive mode

In `src/utils/pretalx/years.js`:

- set the 2027 entry to `live: false`
- move `currentYear` forward: `export const currentYear = 2028;`

The homepage now says "OSFC 2027 took place …" with a "Watch the 2027 talks" button, and the navigation links to the 2027 archive.

### 3. Update the recap page (optional)

The homepage links to a recap page. Update its text in `src/content/pages/info.md`.

### 4. Add the aftermovie

Once the aftermovie is on Vimeo, add it to the end of the list in `src/data/aftermovies.ts`:

```ts
{ year: 2027, vimeoId: "123456789" },
```

The ID is the number at the end of the Vimeo URL. The "Aftermovies" link in the navigation and `/aftermovies/` now point to it.

### 5. Publish

Commit and push.

---

## Good to know

- **Removed talks and speakers don't break links.** If a talk is canceled or renamed in Pretalx, its old URL redirects to the year's talk list automatically.
- **Only scheduled talks get pages.** Talks that are confirmed in Pretalx but not in the published schedule (placeholders, members-only sessions) are left out on purpose.
- **Updating an old year** (e.g. a recording was added later): run `npm run pretalx:sync -- 2025`, then commit the changed file. Years up to 2025 live on pretalx.com and need `PRETALX_TOKEN` in `.env` as well.
- **Never commit `.env`.** It's ignored by git already; keep it that way.
