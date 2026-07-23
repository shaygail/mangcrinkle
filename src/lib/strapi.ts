import { fallbackProducts } from "@/data/products";
import {
  fallbackHomepage,
  fallbackOrderSteps,
  fallbackTestimonials,
  HomepageContent,
  HomepageTestimonial,
  OrderStep,
} from "@/data/homepage";
import { Product } from "@/types";

type StrapiImage =
  | string
  | {
      url?: string;
      data?: {
        attributes?: { url?: string };
        url?: string;
      } | null;
      attributes?: { url?: string };
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
  return {
    url: process.env.STRAPI_URL,
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

  const url =
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
  } catch (error) {
    console.error(`Strapi fetch error (${path}):`, error);
    return null;
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
    console.error(`Strapi products fetch failed: ${res?.status ?? "no response"}`);
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

  const res = await strapiFetch(
    "/api/homepage?populate[heroImage]=*&populate[storyImage]=*&populate[ctaBackgroundImage]=*&populate[storyMarqueeQuotes]=*"
  );
  if (!res?.ok) {
    console.error(`Strapi homepage fetch failed: ${res?.status ?? "no response"}`);
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
    console.error(
      `Strapi testimonials fetch failed: ${res?.status ?? "no response"}`
    );
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
    console.error(
      `Strapi order steps fetch failed: ${res?.status ?? "no response"}`
    );
    return fallbackOrderSteps;
  }

  const json = (await res.json()) as { data?: StrapiEntry[] };
  const steps = (json.data ?? [])
    .map(mapOrderStep)
    .filter((s): s is OrderStep => s !== null);

  return steps.length > 0 ? steps : fallbackOrderSteps;
}
