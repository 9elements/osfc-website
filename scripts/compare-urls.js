/**
 * Compares the pages of two static builds, e.g. the old 11ty site and this one.
 * URLs covered by public/_redirects count as handled.
 *
 * Usage: npm run compare:urls -- ../osfc-website-11ty/dist [dist]
 */
import fs from "node:fs";
import path from "node:path";

const [oldDir, newDir = "dist"] = process.argv.slice(2);
if (!oldDir) {
  console.error(
    "Usage: npm run compare:urls -- <old build dir> [new build dir]"
  );
  process.exit(1);
}

const listUrls = (dir) =>
  fs
    .readdirSync(dir, { recursive: true })
    .filter((file) => file.endsWith(".html"))
    .map((file) =>
      `/${file.split(path.sep).join("/")}`.replace(/(^|\/)index\.html$/, "/")
    );

const redirects = fs.existsSync("public/_redirects")
  ? fs
      .readFileSync("public/_redirects", "utf8")
      .split("\n")
      .filter((line) => line.trim() && !line.startsWith("#"))
      .map((line) => line.trim().split(/\s+/)[0])
  : [];

/** Netlify rule source as a RegExp: ":name" matches one segment, "*" the rest. */
const toPattern = (from) =>
  new RegExp(
    `^${from
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/:[a-z]+/gi, "[^/]+")
      .replace(/\*$/, ".*")}$`,
  );

const redirectPatterns = redirects.map(toPattern);
const isRedirected = (url) => redirectPatterns.some((pattern) => pattern.test(url));

const oldUrls = listUrls(oldDir);
const newUrls = new Set(listUrls(newDir));

const missing = oldUrls.filter(
  (url) => !newUrls.has(url) && !isRedirected(url)
);
const redirected = oldUrls.filter(
  (url) => !newUrls.has(url) && isRedirected(url)
);
const added = [...newUrls].filter((url) => !oldUrls.includes(url));

console.log(`Old: ${oldUrls.length} pages, new: ${newUrls.size} pages`);
console.log(`\nRedirected (${redirected.length}):`, redirected);
console.log(`\nOnly in new build (${added.length}):`, added);
console.log(`\nMissing (${missing.length}):`, missing);

process.exit(missing.length ? 1 : 0);
