type Entry = { id: string; data: { name: string } };

export const byName = (a: Entry, b: Entry) =>
  a.data.name.localeCompare(b.data.name, "en", { sensitivity: "base" });

/** Listed ids first in list order, everything else alphabetically by name. */
export const sortByList = <T extends Entry>(entries: T[], list: string[]) => {
  const ids = new Set(entries.map((entry) => entry.id));
  for (const id of list) {
    if (!ids.has(id))
      console.warn(
        `[order] "${id}" is listed in src/data/order.ts but has no content file`
      );
  }
  const position = (entry: T) => {
    const index = list.indexOf(entry.id);
    return index === -1 ? Infinity : index;
  };
  return [...entries].sort((a, b) => position(a) - position(b) || byName(a, b));
};
