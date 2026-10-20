/**
 * Temporary cutover flag. Default remains Strapi until native CMS is verified.
 * Set CONTENT_SOURCE=native only on preview/staging after migration checks pass.
 */
export type ContentSource = "strapi" | "native";

export function getContentSource(): ContentSource {
  const raw = (process.env.CONTENT_SOURCE ?? "strapi").toLowerCase().trim();
  return raw === "native" ? "native" : "strapi";
}

export function isNativeContentEnabled(): boolean {
  return getContentSource() === "native";
}
