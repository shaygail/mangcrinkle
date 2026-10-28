/**
 * Where the storefront reads content from.
 * `local` (default) uses the built-in catalogue in this app — no Strapi required.
 * Set CONTENT_SOURCE=strapi to keep reading the old CMS.
 */
export type ContentSource = "strapi" | "local";

export function getContentSource(): ContentSource {
  const raw = (process.env.CONTENT_SOURCE ?? "local").toLowerCase().trim();
  return raw === "strapi" ? "strapi" : "local";
}

export function isLocalContent(): boolean {
  return getContentSource() === "local";
}
