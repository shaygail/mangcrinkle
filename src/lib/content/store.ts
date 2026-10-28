import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fallbackHomepage, fallbackOrderSteps, fallbackTestimonials } from "@/data/homepage";
import type { HomepageContent, HomepageTestimonial, OrderStep } from "@/data/homepage";
import { fallbackProducts } from "@/data/products";
import { fallbackShopPage } from "@/data/shop-page";
import type { ShopPageContent } from "@/data/shop-page";
import { fallbackStorefrontCopy } from "@/data/storefront-copy";
import type { StorefrontCopy } from "@/data/storefront-copy";
import { fallbackStoreOutlet } from "@/data/store-outlet";
import type { StoreOutlet } from "@/data/store-outlet";
import type { Product } from "@/types";

export type ManagedContent = {
  products: Product[];
  homepage: HomepageContent;
  shopPage: ShopPageContent;
  outlet: StoreOutlet;
  copy: StorefrontCopy;
  testimonials: HomepageTestimonial[];
  orderSteps: OrderStep[];
};

const CONTENT_FILE = path.join(process.cwd(), "data", "managed-content.json");

export function defaultManagedContent(): ManagedContent {
  return {
    products: fallbackProducts.map((product) => ({
      ...product,
      available: product.available !== false,
    })),
    homepage: structuredClone(fallbackHomepage),
    shopPage: structuredClone(fallbackShopPage),
    outlet: structuredClone(fallbackStoreOutlet),
    copy: structuredClone(fallbackStorefrontCopy),
    testimonials: structuredClone(fallbackTestimonials),
    orderSteps: structuredClone(fallbackOrderSteps),
  };
}

function mergeWithDefaults(parsed: Partial<ManagedContent>): ManagedContent {
  const defaults = defaultManagedContent();
  const saved = Array.isArray(parsed.products) ? parsed.products : [];
  const savedIds = new Set(saved.map((product) => product.id));

  return {
    products: [
      ...saved.map((product) => ({
        ...product,
        available: product.available !== false,
      })),
      ...defaults.products.filter((product) => !savedIds.has(product.id)),
    ],
    homepage: { ...defaults.homepage, ...(parsed.homepage ?? {}) },
    shopPage: {
      ...defaults.shopPage,
      ...(parsed.shopPage ?? {}),
      sections:
        parsed.shopPage?.sections && parsed.shopPage.sections.length > 0
          ? parsed.shopPage.sections
          : defaults.shopPage.sections,
    },
    outlet: {
      ...defaults.outlet,
      ...(parsed.outlet ?? {}),
      pickupWindows:
        parsed.outlet?.pickupWindows && parsed.outlet.pickupWindows.length > 0
          ? parsed.outlet.pickupWindows
          : defaults.outlet.pickupWindows,
    },
    copy: { ...defaults.copy, ...(parsed.copy ?? {}) },
    testimonials:
      parsed.testimonials && parsed.testimonials.length > 0
        ? parsed.testimonials
        : defaults.testimonials,
    orderSteps:
      parsed.orderSteps && parsed.orderSteps.length > 0
        ? parsed.orderSteps
        : defaults.orderSteps,
  };
}

export async function readManagedContent(): Promise<ManagedContent> {
  try {
    const raw = await readFile(CONTENT_FILE, "utf8");
    return mergeWithDefaults(JSON.parse(raw) as Partial<ManagedContent>);
  } catch {
    return defaultManagedContent();
  }
}

export async function writeManagedContent(content: ManagedContent): Promise<void> {
  await mkdir(path.dirname(CONTENT_FILE), { recursive: true });
  const temp = `${CONTENT_FILE}.tmp`;
  await writeFile(temp, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  await rename(temp, CONTENT_FILE);
}

export function contentFilePath(): string {
  return CONTENT_FILE;
}
