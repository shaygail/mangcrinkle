import { fallbackProducts } from "@/data/products";
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

type StrapiProductFields = {
  productId?: string;
  name?: string;
  description?: string;
  price?: number;
  category?: Product["category"];
  tier?: string;
  badge?: string;
  note?: string;
  image?: StrapiImage;
};

type StrapiEntry = StrapiProductFields & {
  id?: number | string;
  attributes?: StrapiProductFields;
};

function resolveImageUrl(
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

function mapStrapiEntry(entry: StrapiEntry, strapiUrl: string): Product | null {
  // Support both Strapi v4 (attributes) and v5 (flattened) shapes
  const fields = entry.attributes ?? entry;
  const id = fields.productId;
  if (!id || !fields.name || fields.price == null || !fields.category) {
    return null;
  }

  const image = resolveImageUrl(fields.image, strapiUrl) ?? "";

  return {
    id,
    name: fields.name,
    description: fields.description ?? "",
    price: Number(fields.price),
    image,
    category: fields.category,
    ...(fields.tier ? { tier: fields.tier } : {}),
    ...(fields.badge ? { badge: fields.badge } : {}),
    ...(fields.note ? { note: fields.note } : {}),
  };
}

export async function getProducts(): Promise<Product[]> {
  const strapiUrl = process.env.STRAPI_URL;
  const token = process.env.STRAPI_API_TOKEN;

  if (!strapiUrl) {
    return fallbackProducts;
  }

  try {
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(
      `${strapiUrl}/api/products?populate=image&pagination[pageSize]=200`,
      {
        headers,
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error(
        `Strapi products fetch failed: ${res.status} ${res.statusText}`
      );
      return fallbackProducts;
    }

    const json = (await res.json()) as { data?: StrapiEntry[] };
    const entries = json.data;

    if (!entries || entries.length === 0) {
      console.error("Strapi products fetch returned empty result");
      return fallbackProducts;
    }

    const products = entries
      .map((entry) => mapStrapiEntry(entry, strapiUrl))
      .filter((p): p is Product => p !== null);

    if (products.length === 0) {
      console.error("Strapi products could not be mapped to Product type");
      return fallbackProducts;
    }

    return products;
  } catch (error) {
    console.error("Strapi products fetch error:", error);
    return fallbackProducts;
  }
}
