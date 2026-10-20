/**
 * Allow only safe URL schemes for CMS-managed links.
 * Blocks javascript:, data:, and other dangerous protocols.
 */
export function sanitizeHref(href: string, fallback = "/"): string {
  const trimmed = href.trim();
  if (!trimmed) return fallback;

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  if (trimmed.startsWith("#")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return trimmed;
    }
    if (url.protocol === "mailto:" || url.protocol === "tel:") {
      return trimmed;
    }
  } catch {
    return fallback;
  }

  return fallback;
}
