import type { HomepageContent, HomepageTestimonial, OrderStep } from "@/data/homepage";
import type { ShopPageContent } from "@/data/shop-page";
import type { StoreOutlet } from "@/data/store-outlet";
import type { StorefrontCopy } from "@/data/storefront-copy";
import type { Product } from "@/types";
import { centsToDollars } from "@/lib/supabase/menu";
import { createPublicClient, createSessionClient } from "@/lib/supabase/clients";

const categories = [
  "crinkle-standard",
  "crinkle-premium",
  "crinkle-signature",
  "crinkle-pack",
  "lava",
  "hot-drink",
  "iced-drink",
] as const;

type StorefrontCategory = (typeof categories)[number];

type PublishedRow = {
  sku: string;
  display_name: string;
  variant_label: string;
  pack_size: number;
  price_cents: number;
  available: boolean | null;
  storefront_category: string;
  variant_sort: number;
  product_slug: string;
  allows_mixed_flavours: boolean;
  display_order: number;
  show_in_box_builder: boolean;
  published_payload: {
    shortDescription?: string;
    fullDescription?: string;
    ingredients?: string;
    allergens?: string;
    badge?: string;
    image?: string;
    featured?: boolean;
    showInBoxBuilder?: boolean;
  };
};

type AdminVariant = {
  sku: string;
  label: string;
  display_name: string;
  pack_size: number;
  price_cents: number;
  available: boolean;
  storefront_category: string;
  status: "draft" | "published" | "archived";
  flavour_id: string | null;
};

type AdminProductRow = {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  full_description: string;
  ingredients: string;
  allergens: string;
  badge: string;
  image_url: string;
  featured: boolean;
  available: boolean;
  display_order: number;
  allows_mixed_flavours: boolean;
  show_in_box_builder: boolean;
  status: "draft" | "published" | "archived";
  has_unpublished_changes: boolean;
  revision: number;
  category_id: string;
  categories: { slug: string } | null;
  product_variants: AdminVariant[];
};

function asCategory(value: string): StorefrontCategory | null {
  return categories.includes(value as StorefrontCategory)
    ? (value as StorefrontCategory)
    : null;
}

export function mapPublishedRow(row: PublishedRow): Product | null {
  const category = asCategory(row.storefront_category);
  if (!category || !row.display_name || row.price_cents == null) return null;
  const payload = row.published_payload ?? {};
  return {
    id: row.sku,
    name: row.display_name,
    description: payload.shortDescription ?? "",
    fullDescription: payload.fullDescription ?? "",
    price: centsToDollars(row.price_cents),
    image: payload.image ?? "",
    category,
    badge: payload.badge || undefined,
    featuredOnShop: Boolean(payload.featured),
    showInBoxBuilder: Boolean(payload.showInBoxBuilder ?? row.show_in_box_builder),
    shopSortOrder: row.display_order,
    available: row.available !== false,
    packSize: row.pack_size,
    mixedFlavours: row.allows_mixed_flavours === true,
    ingredients: payload.ingredients ?? "",
    allergens: payload.allergens ?? "",
    status: "published",
  };
}

export async function getPublishedProducts(): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("published_catalogue")
    .select("*")
    .order("display_order", { ascending: true })
    .order("variant_sort", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data ?? []) as PublishedRow[])
    .map(mapPublishedRow)
    .filter((product): product is Product => product !== null);
}

function mapAdminVariant(product: AdminProductRow, variant: AdminVariant): Product {
  const category = asCategory(variant.storefront_category) ?? "crinkle-standard";
  return {
    id: variant.sku,
    dbId: product.id,
    revision: product.revision,
    name: variant.display_name,
    description: product.short_description,
    fullDescription: product.full_description,
    price: centsToDollars(variant.price_cents),
    image: product.image_url,
    category,
    badge: product.badge || undefined,
    featuredOnShop: product.featured,
    showInBoxBuilder: product.show_in_box_builder,
    available: variant.available,
    packSize: variant.pack_size,
    mixedFlavours: product.allows_mixed_flavours,
    ingredients: product.ingredients,
    allergens: product.allergens,
    lineSlug: product.slug,
    lineName: product.name,
    categorySlug: product.categories?.slug,
    status: variant.status,
    hasUnpublishedChanges:
      product.has_unpublished_changes || variant.status !== "published",
    variants: product.product_variants
      .filter((item) => item.status !== "archived")
      .map((item) => ({
        sku: item.sku,
        label: item.label,
        displayName: item.display_name,
        price: centsToDollars(item.price_cents),
        packSize: item.pack_size,
        available: item.available,
        category: asCategory(item.storefront_category) ?? "crinkle-standard",
      })),
  };
}

export async function getAdminProducts(): Promise<Product[]> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*), categories(slug)")
    .neq("status", "archived")
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data ?? []) as AdminProductRow[]).flatMap((product) =>
    (product.product_variants ?? [])
      .filter((variant) => variant.status !== "archived")
      .map((variant) => mapAdminVariant(product, variant))
  );
}

export async function getAdminProduct(sku: string): Promise<Product | null> {
  const products = await getAdminProducts();
  return products.find((product) => product.id === sku) ?? null;
}

export async function getDashboardCounts() {
  const products = await getAdminProducts();
  const drafts = products.filter((product) => product.status !== "published");
  const unpublished = products.filter((product) => product.hasUnpublishedChanges);
  return {
    publishedProducts: products.filter((product) => product.status === "published").length,
    draftProducts: drafts.length,
    unpublishedProductEdits: unpublished.length,
    recentDrafts: unpublished.slice(0, 5).map((product) => ({
      id: product.id,
      title: product.name,
      kind: "product" as const,
      updatedAt: new Date().toISOString(),
    })),
  };
}

type WebsiteRow = {
  key: string;
  draft_payload: Record<string, unknown> | null;
  published_payload: Record<string, unknown> | null;
  revision: number;
  status: string;
  has_unpublished_changes: boolean;
};

export async function getPublishedWebsite<T>(key: string): Promise<T | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("published_website")
    .select("published_payload")
    .eq("key", key)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data?.published_payload as T | undefined) ?? null;
}

export async function getDraftWebsite(key: string): Promise<WebsiteRow | null> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("website_content")
    .select("key, draft_payload, published_payload, revision, status, has_unpublished_changes")
    .eq("key", key)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as WebsiteRow | null) ?? null;
}

export function blankHomepage(): HomepageContent {
  return {
    announcementText: "",
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
    heroEyebrow: "",
    heroPanelEyebrow: "",
    heroPanelTitle: "",
    heroPanelBody: "",
    heroHighlights: [],
    heroButtonText: "",
    heroButtonLink: "/shop",
    heroImage: "",
    tagline: "",
    storyTitle: "",
    storyBody: "",
    storyButtonText: "",
    storyImage: "",
    storyMarqueeQuotes: [],
    howToOrderTitle: "",
    howToOrderSubtitle: "",
    howToOrderButtonText: "",
    testimonialsTitle: "",
    ctaTitle: "",
    ctaBody: "",
    ctaButtonText: "",
    ctaMarqueeText: "",
    ctaBackgroundImage: "",
    bestSellersTitle: "",
    merchTitle: "",
    merchLinkText: "",
    merchInstagramText: "",
    footerTagline: "",
    siteDescription: "",
    footerMenuLinks: [],
    footerExploreLinks: [],
    footerSocialLinks: [],
    footerCopyright: "",
  };
}

export function blankShopPage(): ShopPageContent {
  return {
    title: "",
    subtitle: "",
    description: "",
    sections: [],
    howToOrderEyebrow: "",
    howToOrderTitle: "",
    howToOrderBody: "",
    howToOrderLinkText: "",
    howToOrderLinkHref: "/#order",
  };
}

export function blankOutlet(): StoreOutlet {
  return {
    name: "",
    cartLabel: "",
    hours: "",
    address: "",
    pickupNote: "",
    pickupWindows: [],
  };
}

export function blankCopy(): StorefrontCopy {
  return {
    cartTitle: "",
    cartEmptyTitle: "",
    cartEmptyBody: "",
    cartEmptyCta: "",
    cartCheckoutCta: "",
    checkoutTitle: "",
    checkoutSubmitCta: "",
    confirmationTitle: "",
    confirmationBody: "",
    confirmationCta: "",
  };
}

export async function getPublishedHomepage(): Promise<HomepageContent | null> {
  return getPublishedWebsite<HomepageContent>("homepage");
}

export async function getPublishedShopPage(): Promise<ShopPageContent | null> {
  return getPublishedWebsite<ShopPageContent>("shop_page");
}

export async function getPublishedOutlet(): Promise<StoreOutlet | null> {
  return getPublishedWebsite<StoreOutlet>("store_outlet");
}

export async function getPublishedCopy(): Promise<StorefrontCopy | null> {
  return getPublishedWebsite<StorefrontCopy>("storefront_copy");
}

export async function getPublishedTestimonials(): Promise<HomepageTestimonial[] | null> {
  return getPublishedWebsite<HomepageTestimonial[]>("testimonials");
}

export async function getPublishedOrderSteps(): Promise<OrderStep[] | null> {
  return getPublishedWebsite<OrderStep[]>("order_steps");
}

export type MediaAsset = {
  id: string;
  storage_path: string;
  public_url: string;
  alt_text: string;
  mime_type: string;
  byte_size: number;
};

export async function listMedia(): Promise<MediaAsset[]> {
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("id, storage_path, public_url, alt_text, mime_type, byte_size")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as MediaAsset[];
}

export async function getWebsiteSettings() {
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("website_settings")
    .select("currency, shop_open")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as { currency: string; shop_open: boolean } | null;
}
