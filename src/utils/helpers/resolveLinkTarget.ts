import { getItemPath } from "@/utils/helpers/getItemPath";

// utils/resolveLinkTarget.ts
export function resolveLinkTarget(link: {
  linkType?: "internal" | "external";
  externalLink?: string;
  internalLink?: any;
  newWindow?: boolean;
}): { href: string; target?: string; rel?: string } {
  if (!link) return { href: "#" };

  const { linkType, externalLink, internalLink, newWindow } = link;

  const href =
    linkType === "external"
      ? externalLink?.trim() || "#"
      : (() => {
          if (!internalLink || !internalLink.__typename) return "#";
          return getItemPath(internalLink);
        })();

  const target = newWindow ? "_blank" : undefined;
  const rel = newWindow ? "noopener noreferrer" : undefined;

  return { href, target, rel };
}
