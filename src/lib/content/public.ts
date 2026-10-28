import {
  fallbackHomepage,
  fallbackOrderSteps,
  fallbackTestimonials,
} from "@/data/homepage";
import { fallbackShopPage } from "@/data/shop-page";
import { fallbackStorefrontCopy } from "@/data/storefront-copy";
import { fallbackStoreOutlet } from "@/data/store-outlet";
import {
  getPublishedCopy,
  getPublishedHomepage,
  getPublishedOrderSteps,
  getPublishedOutlet,
  getPublishedProducts,
  getPublishedShopPage,
  getPublishedTestimonials,
} from "@/lib/supabase/catalog";

/** Published CMS rows can be blank. Keep the live copy until a field is actually filled in. */
function fillFromFallback<T extends object>(value: T | null, fallback: T): T {
  if (!value) return fallback;
  const filled = { ...fallback };
  for (const key of Object.keys(fallback) as (keyof T)[]) {
    const current = value[key];
    if (typeof current === "string") {
      if (current.trim()) filled[key] = current as T[keyof T];
    } else if (Array.isArray(current)) {
      if (current.length > 0) filled[key] = current as T[keyof T];
    } else if (current != null) {
      filled[key] = current as T[keyof T];
    }
  }
  return filled;
}

export async function getProducts() {
  return getPublishedProducts();
}

export async function getHomepage() {
  return fillFromFallback(await getPublishedHomepage(), fallbackHomepage);
}

export async function getShopPage() {
  return fillFromFallback(await getPublishedShopPage(), fallbackShopPage);
}

export async function getStorefrontCopy() {
  return fillFromFallback(await getPublishedCopy(), fallbackStorefrontCopy);
}

export async function getStoreOutlet() {
  return fillFromFallback(await getPublishedOutlet(), fallbackStoreOutlet);
}

export async function getTestimonials() {
  const published = await getPublishedTestimonials();
  return published && published.length > 0 ? published : fallbackTestimonials;
}

export async function getOrderSteps() {
  const published = await getPublishedOrderSteps();
  return published && published.length > 0 ? published : fallbackOrderSteps;
}
