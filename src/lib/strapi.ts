import { fallbackProducts } from "@/data/products";
import {
  fallbackHomepage,
  fallbackOrderSteps,
  fallbackTestimonials,
  HomepageContent,
  HomepageTestimonial,
  OrderStep,
} from "@/data/homepage";
import {
  fallbackShopPage,
  ShopPageContent,
  ShopSectionCopy,
} from "@/data/shop-page";
import { Product } from "@/types";

type StrapiImage =
  | string
  | {
      url?: string;
      formats?: Record<string, { url?: string } | undefined>;
      data?: {
        attributes?: {
          url?: string;
          formats?: Record<string, { url?: string } | undefined>;
        };
        url?: string;
      } | null;
      attributes?: {
        url?: string;
        formats?: Record<string, { url?: string } | undefined>;
      };
    }
  | null
  | undefined;

type StrapiEntry = Record<string, unknown> & {
  id?: number | string;
  documentId?: string;
  attributes?: Record<string, unknown>;
};

const REVALIDATE_SECONDS = 60;

function getStrapiConfig() {
  const rawUrl = process.env.STRAPI_URL;
  return {
    url: rawUrl?.replace(/\/+$/, ""),
    token: process.env.STRAPI_API_TOKEN,
  };
}

function getFields(entry: StrapiEntry): Record<string, unknown> {
  return (entry.attributes ?? entry) as Record<string, unknown>;
}

export function resolveImageUrl(
  image: StrapiImage,
  strapiUrl: string
): string | undefined {
  if (!image) return undefined;
  if (typeof image === "string") {
    return image.startsWith("http") ? image : `${strapiUrl}${image}`;
  }

  // Prefer larger generated formats when Strapi provides them
  const nestedFormats =
    (image as { formats?: Record<string, { url?: string }> }).formats ??
    image.data?.attributes?.formats ??
    image.attributes?.formats;
  const preferredFormat =
    nestedFormats?.large?.url ??
    nestedFormats?.medium?.url ??
    nestedFormats?.small?.url ??
    nestedFormats?.thumbnail?.url;

  const url =
    preferredFormat ??
    image.url ??
    image.data?.attributes?.url ??
    image.data?.url ??
    image.attributes?.url;

  if (!url) return undefined;
  return url.startsWith("http") ? url : `${strapiUrl}${url}`;
}

async function strapiFetch(path: string): Promise<Response | null> {
  const { url, token } = getStrapiConfig();
  if (!url) return null;

  const headers: HeadersInit = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    return await fetch(`${url}${path}`, {
      headers,
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch {
    // Offline / unreachable Strapi — callers use local fallbacks
    return null;
  }
}

function logStrapiHttpError(label: string, res: Response | null) {
  // Null means network failure (already silent). Only log real HTTP errors.
  if (res && !res.ok) {
    console.error(`Strapi ${label} fetch failed: ${res.status}`);
  }
}

function mapStrapiProduct(entry: StrapiEntry, strapiUrl: string): Product | null {
  const fields = getFields(entry);
  const id = fields.productId as string | undefined;
  if (!id || !fields.name || fields.price == null || !fields.category) {
    return null;
  }

  return {
    id,
    name: String(fields.name),
    description: String(fields.description ?? ""),
    price: Number(fields.price),
    image: resolveImageUrl(fields.image as StrapiImage, strapiUrl) ?? "",
    category: fields.category as Product["category"],
    ...(fields.tier ? { tier: String(fields.tier) } : {}),
    ...(fields.badge ? { badge: String(fields.badge) } : {}),
    ...(fields.note ? { note: String(fields.note) } : {}),
  };
}

function mapHomepage(
  entry: StrapiEntry | null | undefined,
  strapiUrl: string
): HomepageContent | null {
  if (!entry) return null;
  const fields = getFields(entry);

  const marqueeRaw = fields.storyMarqueeQuotes;
  const storyMarqueeQuotes = Array.isArray(marqueeRaw)
    ? marqueeRaw
        .map((item) => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object" && "text" in item) {
            return String((item as { text?: string }).text ?? "");
          }
          return "";
        })
        .filter(Boolean)
    : [];

  if (!fields.heroTitle) return null;

  return {
    announcementText: String(
      fields.announcementText ?? fallbackHomepage.announcementText
    ),
    heroTitle: String(fields.heroTitle),
    heroSubtitle: String(fields.heroSubtitle ?? fallbackHomepage.heroSubtitle),
    heroDescription: String(
      fields.heroDescription ?? fallbackHomepage.heroDescription
    ),
    heroButtonText: String(
      fields.heroButtonText ?? fallbackHomepage.heroButtonText
    ),
    heroButtonLink: String(
      fields.heroButtonLink ?? fallbackHomepage.heroButtonLink
    ),
    heroImage:
      resolveImageUrl(fields.heroImage as StrapiImage, strapiUrl) ??
      fallbackHomepage.heroImage,
    tagline: String(fields.tagline ?? fallbackHomepage.tagline),
    storyTitle: String(fields.storyTitle ?? fallbackHomepage.storyTitle),
    storyBody: String(fields.storyBody ?? fallbackHomepage.storyBody),
    storyButtonText: String(
      fields.storyButtonText ?? fallbackHomepage.storyButtonText
    ),
    storyImage:
      resolveImageUrl(fields.storyImage as StrapiImage, strapiUrl) ??
      fallbackHomepage.storyImage,
    storyMarqueeQuotes:
      storyMarqueeQuotes.length > 0
        ? storyMarqueeQuotes
        : fallbackHomepage.storyMarqueeQuotes,
    howToOrderTitle: String(
      fields.howToOrderTitle ?? fallbackHomepage.howToOrderTitle
    ),
    howToOrderSubtitle: String(
      fields.howToOrderSubtitle ?? fallbackHomepage.howToOrderSubtitle
    ),
    howToOrderButtonText: String(
      fields.howToOrderButtonText ?? fallbackHomepage.howToOrderButtonText
    ),
    testimonialsTitle: String(
      fields.testimonialsTitle ?? fallbackHomepage.testimonialsTitle
    ),
    ctaTitle: String(fields.ctaTitle ?? fallbackHomepage.ctaTitle),
    ctaBody: String(fields.ctaBody ?? fallbackHomepage.ctaBody),
    ctaButtonText: String(
      fields.ctaButtonText ?? fallbackHomepage.ctaButtonText
    ),
    ctaMarqueeText: String(
      fields.ctaMarqueeText ?? fallbackHomepage.ctaMarqueeText
    ),
    ctaBackgroundImage:
      resolveImageUrl(fields.ctaBackgroundImage as StrapiImage, strapiUrl) ??
      fallbackHomepage.ctaBackgroundImage,
    bestSellersTitle: String(
      fields.bestSellersTitle ?? fallbackHomepage.bestSellersTitle
    ),
    merchTitle: String(fields.merchTitle ?? fallbackHomepage.merchTitle),
    merchLinkText: String(
      fields.merchLinkText ?? fallbackHomepage.merchLinkText
    ),
    merchInstagramText: String(
      fields.merchInstagramText ?? fallbackHomepage.merchInstagramText
    ),
    footerTagline: String(
      fields.footerTagline ?? fallbackHomepage.footerTagline
    ),
    siteDescription: String(
      fields.siteDescription ?? fallbackHomepage.siteDescription
    ),
  };
}

function mapTestimonial(entry: StrapiEntry): HomepageTestimonial | null {
  const fields = getFields(entry);
  if (!fields.quote || !fields.author) return null;
  const id = String(entry.documentId ?? entry.id ?? fields.author);
  return {
    id,
    quote: String(fields.quote),
    author: String(fields.author),
  };
}

function mapOrderStep(entry: StrapiEntry): OrderStep | null {
  const fields = getFields(entry);
  if (!fields.stepNumber || !fields.title) return null;
  const id = String(entry.documentId ?? entry.id ?? fields.stepNumber);
  return {
    id,
    stepNumber: String(fields.stepNumber),
    title: String(fields.title),
    emoji: String(fields.emoji ?? ""),
    description: String(fields.description ?? ""),
  };
}

export async function getProducts(): Promise<Product[]> {
  const { url } = getStrapiConfig();
  if (!url) return fallbackProducts;

  const res = await strapiFetch(
    "/api/products?populate=image&pagination[pageSize]=200"
  );
  if (!res?.ok) {
    logStrapiHttpError("products", res);
    return fallbackProducts;
  }

  const json = (await res.json()) as { data?: StrapiEntry[] };
  const products = (json.data ?? [])
    .map((entry) => mapStrapiProduct(entry, url))
    .filter((p): p is Product => p !== null);

  return products.length > 0 ? products : fallbackProducts;
}

export async function getHomepage(): Promise<HomepageContent> {
  const { url } = getStrapiConfig();
  if (!url) return fallbackHomepage;

  const res = await strapiFetch("/api/homepage?populate=*");
  if (!res?.ok) {
    logStrapiHttpError("homepage", res);
    return fallbackHomepage;
  }

  const json = (await res.json()) as { data?: StrapiEntry };
  const homepage = mapHomepage(json.data, url);
  return homepage ?? fallbackHomepage;
}

export async function getTestimonials(): Promise<HomepageTestimonial[]> {
  const { url } = getStrapiConfig();
  if (!url) return fallbackTestimonials;

  const res = await strapiFetch(
    "/api/testimonials?sort=sortOrder:asc&pagination[pageSize]=50"
  );
  if (!res?.ok) {
    logStrapiHttpError("testimonials", res);
    return fallbackTestimonials;
  }

  const json = (await res.json()) as { data?: StrapiEntry[] };
  const testimonials = (json.data ?? [])
    .map(mapTestimonial)
    .filter((t): t is HomepageTestimonial => t !== null);

  return testimonials.length > 0 ? testimonials : fallbackTestimonials;
}

export async function getOrderSteps(): Promise<OrderStep[]> {
  const { url } = getStrapiConfig();
  if (!url) return fallbackOrderSteps;

  const res = await strapiFetch(
    "/api/order-steps?sort=sortOrder:asc&pagination[pageSize]=20"
  );
  if (!res?.ok) {
    logStrapiHttpError("order steps", res);
    return fallbackOrderSteps;
  }

  const json = (await res.json()) as { data?: StrapiEntry[] };
  const steps = (json.data ?? [])
    .map(mapOrderStep)
    .filter((s): s is OrderStep => s !== null);

  return steps.length > 0 ? steps : fallbackOrderSteps;
}

function mapShopSection(item: unknown): ShopSectionCopy | null {
  if (!item || typeof item !== "object") return null;
  const fields = item as Record<string, unknown>;
  const sectionKey = String(fields.sectionKey ?? "");
  const title = String(fields.title ?? "");
  const subtitle = String(fields.subtitle ?? "");
  if (!sectionKey || !title) return null;
  return { sectionKey, title, subtitle };
}

function mapShopPage(entry: StrapiEntry | null | undefined): ShopPageContent | null {
  if (!entry) return null;
  const fields = getFields(entry);
  if (!fields.description && !fields.title) return null;

  const sectionsRaw = fields.sections;
  const sections = Array.isArray(sectionsRaw)
    ? sectionsRaw
        .map(mapShopSection)
        .filter((s): s is ShopSectionCopy => s !== null)
    : [];

  return {
    title: String(fields.title || fallbackShopPage.title),
    subtitle: String(fields.subtitle || fallbackShopPage.subtitle),
    description: String(fields.description || fallbackShopPage.description),
    sections: sections.length > 0 ? sections : fallbackShopPage.sections,
  };
}

export async function getShopPage(): Promise<ShopPageContent> {
  const { url } = getStrapiConfig();
  if (!url) return fallbackShopPage;

  const res = await strapiFetch("/api/shop-page?populate=*");
  if (!res?.ok) {
    logStrapiHttpError("shop page", res);
    return fallbackShopPage;
  }

  const json = (await res.json()) as { data?: StrapiEntry };
  return mapShopPage(json.data) ?? fallbackShopPage;
}
