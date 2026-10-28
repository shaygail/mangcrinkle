import { Product } from "@/types";
import { PLACEHOLDERS } from "@/lib/images";

const cookieImg = PLACEHOLDERS.cookie;
const drinkImg = PLACEHOLDERS.drinkHot;
const icedImg = PLACEHOLDERS.drinkIced;
const packImg = PLACEHOLDERS.pack;
const lavaUbeImg = "/images/lava/ube.jpeg";
const lavaChocoImg = "/images/lava/choco.jpeg";

const drinkNote = "Whole milk included. Alternative milk +$1.00 in cart.";

/**
 * Sample catalogue used by seeds and local helpers. The public shop reads
 * published Supabase products only.
 */
export const fallbackProducts: Product[] = [
  // Standard crinkles – $4.50 each
  {
    id: "classic-chocolate",
    name: "Classic Chocolate",
    description:
      "Our signature dark cocoa fudgy cookie dusted in sweet snowy powdered sugar.",
    price: 4.5,
    image: cookieImg,
    category: "crinkle-standard",
    tier: "Standard",
    featuredOnShop: true,
    shopSortOrder: 1,
    showInBoxBuilder: true,
    boxBuilderSortOrder: 1,
  },
  {
    id: "red-velvet",
    name: "Red Velvet",
    description: "Standard crinkle — soft-centred and fudgy.",
    price: 4.5,
    image: cookieImg,
    category: "crinkle-standard",
    tier: "Standard",
  },
  {
    id: "chocolate-mint",
    name: "Chocolate Mint",
    description: "Standard crinkle — soft-centred and fudgy.",
    price: 4.5,
    image: cookieImg,
    category: "crinkle-standard",
    tier: "Standard",
  },
  // Premium – $5.00 each
  {
    id: "ube",
    name: "Signature Ube",
    description:
      "Vibrant sweet purple yam cookie with a rich, pillow-soft, melt-in-your-mouth center.",
    price: 5.0,
    image: cookieImg,
    category: "crinkle-premium",
    tier: "Premium",
    badge: "Premium",
    featuredOnShop: true,
    shopSortOrder: 2,
    showInBoxBuilder: true,
    boxBuilderSortOrder: 2,
  },
  {
    id: "coconut-pandan",
    name: "Coconut Pandan",
    description:
      "Infused with aromatic pandan leaf and rolled in sweet shredded coconut flakes.",
    price: 5.0,
    image: cookieImg,
    category: "crinkle-premium",
    tier: "Premium",
    badge: "Premium",
    featuredOnShop: true,
    shopSortOrder: 3,
    showInBoxBuilder: true,
    boxBuilderSortOrder: 3,
  },
  {
    id: "chocolate-butternut",
    name: "Chocolate Butternut",
    description: "Premium crinkle — chocolate butternut flavour.",
    price: 5.0,
    image: cookieImg,
    category: "crinkle-premium",
    tier: "Premium",
    badge: "Premium",
  },
  // Signature premium – $5.50 each
  {
    id: "chocolate-pistachio",
    name: "Chocolate Pistachio",
    description: "Signature premium crinkle.",
    price: 5.5,
    image: cookieImg,
    category: "crinkle-signature",
    tier: "Signature Premium",
    badge: "Signature",
  },
  {
    id: "ube-matcha",
    name: "Ube Matcha",
    description: "Signature premium crinkle.",
    price: 5.5,
    image: cookieImg,
    category: "crinkle-signature",
    tier: "Signature Premium",
    badge: "Signature",
  },
  // Crinkle packs
  {
    id: "pack-3",
    name: "3 Pack Crinkles",
    description: "Mix & match any flavours. Premium +$0.50, Signature +$1.00 per crinkle.",
    price: 13.0,
    image: packImg,
    category: "crinkle-pack",
  },
  {
    id: "pack-6",
    name: "Mang's 6-Pack Assorted",
    description:
      "Choose your own combination of standard, premium, and signature flavours.",
    price: 27.0,
    image: packImg,
    category: "crinkle-pack",
    badge: "Best Value",
    featuredOnShop: true,
    shopSortOrder: 5,
    builderTitle: "Assorted 6-Pack Box",
    builderSubtitle: "Choose 6 of your favorite freshly baked flavors.",
  },
  {
    id: "pack-12",
    name: "Craver's 12-Pack Party Box",
    description: "Ultimate crinkle feast for the squad.",
    price: 50.0,
    image: packImg,
    category: "crinkle-pack",
    builderTitle: "Craver's 12-Pack Box",
    builderSubtitle:
      "Load up 12 delicious crinkles. Mix and match anyway you want!",
  },
  // Lava crinkles
  {
    id: "lava-ube",
    name: "Lava Ube Crinkle — Each",
    description: "Rich, gooey ube crinkle with a melty centre.",
    price: 6.5,
    image: lavaUbeImg,
    category: "lava",
  },
  {
    id: "lava-choco",
    name: "Lava Chocolate",
    description:
      "Decadent dark chocolate crinkle with a warm, flowing chocolate fudge center.",
    price: 6.5,
    image: lavaChocoImg,
    category: "lava",
    badge: "Gooey Lava Core",
    featuredOnShop: true,
    shopSortOrder: 4,
    showInBoxBuilder: true,
    boxBuilderSortOrder: 4,
  },
  {
    id: "lava-3",
    name: "Lava Crinkle — 3 Pack",
    description: "Rich, gooey and made to melt.",
    price: 19.0,
    image: lavaChocoImg,
    category: "lava",
  },
  {
    id: "lava-6",
    name: "Lava Crinkle — 6 Pack",
    description: "Rich, gooey and made to melt.",
    price: 38.0,
    image: lavaUbeImg,
    category: "lava",
  },
  {
    id: "lava-12",
    name: "Lava Crinkle — 12 Pack",
    description: "Pre-order required. Please allow 2–3 days.",
    price: 76.0,
    image: lavaChocoImg,
    category: "lava",
    badge: "Pre-order",
    note: "Pre-order required. Allow 2–3 days.",
  },
  // Hot drinks – 410 ml
  {
    id: "long-black",
    name: "Long Black",
    description: `Hot drink — 410 ml. ${drinkNote}`,
    price: 5.5,
    image: drinkImg,
    category: "hot-drink",
  },
  {
    id: "americano",
    name: "Americano",
    description: `Hot drink — 410 ml. ${drinkNote}`,
    price: 5.5,
    image: drinkImg,
    category: "hot-drink",
  },
  {
    id: "latte",
    name: "Latte",
    description: `Hot drink — 410 ml. ${drinkNote}`,
    price: 6.5,
    image: drinkImg,
    category: "hot-drink",
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    description: `Hot drink — 410 ml. ${drinkNote}`,
    price: 6.5,
    image: drinkImg,
    category: "hot-drink",
  },
  {
    id: "flat-white",
    name: "Flat White",
    description: `Hot drink — 410 ml. ${drinkNote}`,
    price: 6.5,
    image: drinkImg,
    category: "hot-drink",
  },
  {
    id: "mochaccino",
    name: "Mochaccino",
    description: `Hot drink — 410 ml. ${drinkNote}`,
    price: 7.0,
    image: drinkImg,
    category: "hot-drink",
  },
  {
    id: "hot-chocolate",
    name: "Hot Chocolate",
    description: `Hot drink — 410 ml. ${drinkNote}`,
    price: 7.0,
    image: drinkImg,
    category: "hot-drink",
  },
  // Iced drinks – 530 ml (premium)
  {
    id: "iced-ube-marble-matcha",
    name: "Iced Ube Marble Matcha",
    description: `Premium iced drink — 530 ml. ${drinkNote}`,
    price: 14.0,
    image: icedImg,
    category: "iced-drink",
    tier: "Premium",
    badge: "Premium",
  },
  {
    id: "iced-ube-latte",
    name: "Iced Ube Latte",
    description: `Premium iced drink — 530 ml. ${drinkNote}`,
    price: 12.5,
    image: icedImg,
    category: "iced-drink",
    tier: "Premium",
    badge: "Premium",
  },
  {
    id: "iced-matcha",
    name: "Iced Matcha",
    description: `Premium iced drink — 530 ml. ${drinkNote}`,
    price: 11.0,
    image: icedImg,
    category: "iced-drink",
    tier: "Premium",
    badge: "Premium",
  },
  {
    id: "iced-calamansi",
    name: "Iced Calamansi Drink",
    description:
      "Refreshing and tart Filipino citrus juice iced to perfection, perfect with cookies.",
    price: 4.5,
    image: icedImg,
    category: "iced-drink",
    tier: "Standard",
    featuredOnShop: true,
    shopSortOrder: 6,
  },
  // Iced drinks – 530 ml (standard)
  {
    id: "iced-chocolate",
    name: "Iced Chocolate",
    description: `Standard iced drink — 530 ml. ${drinkNote}`,
    price: 10.5,
    image: icedImg,
    category: "iced-drink",
    tier: "Standard",
  },
  {
    id: "iced-mocha",
    name: "Iced Mocha",
    description: `Standard iced drink — 530 ml. ${drinkNote}`,
    price: 9.5,
    image: icedImg,
    category: "iced-drink",
    tier: "Standard",
  },
  {
    id: "iced-latte",
    name: "Iced Latte",
    description: `Standard iced drink — 530 ml. ${drinkNote}`,
    price: 8.5,
    image: icedImg,
    category: "iced-drink",
    tier: "Standard",
  },
  {
    id: "iced-latte-vanilla",
    name: "Iced Flavoured Latte — Vanilla",
    description: `Standard iced drink — 530 ml. ${drinkNote}`,
    price: 9.5,
    image: icedImg,
    category: "iced-drink",
    tier: "Standard",
  },
  {
    id: "iced-latte-caramel",
    name: "Iced Flavoured Latte — Caramel",
    description: `Standard iced drink — 530 ml. ${drinkNote}`,
    price: 9.5,
    image: icedImg,
    category: "iced-drink",
    tier: "Standard",
  },
  {
    id: "iced-latte-hazelnut",
    name: "Iced Flavoured Latte — Hazelnut",
    description: `Standard iced drink — 530 ml. ${drinkNote}`,
    price: 9.5,
    image: icedImg,
    category: "iced-drink",
    tier: "Standard",
  },
];

export function getCrinkleFlavours(products: Product[]): Product[] {
  return products.filter(
    (p) =>
      p.category === "crinkle-standard" ||
      p.category === "crinkle-premium" ||
      p.category === "crinkle-signature"
  );
}

/** Curated flavours for the Box Builder — driven by CMS flags when set. */
const DEFAULT_BOX_BUILDER_FLAVOUR_IDS = [
  "classic-chocolate",
  "ube",
  "coconut-pandan",
  "lava-choco",
] as const;

export function getBoxBuilderFlavours(products: Product[]): Product[] {
  const flagged = products
    .filter((p) => p.showInBoxBuilder)
    .sort(
      (a, b) => (a.boxBuilderSortOrder ?? 0) - (b.boxBuilderSortOrder ?? 0)
    );

  if (flagged.length > 0) return flagged;

  return DEFAULT_BOX_BUILDER_FLAVOUR_IDS.map((id) =>
    products.find((p) => p.id === id)
  ).filter((p): p is Product => Boolean(p));
}

/** Mobile shop “All” feed. Featured flags narrow it; otherwise every catalogue item shows. */
export function getFeaturedShopProducts(products: Product[]): Product[] {
  const flagged = products
    .filter((p) => p.featuredOnShop)
    .sort((a, b) => (a.shopSortOrder ?? 0) - (b.shopSortOrder ?? 0));

  if (flagged.length > 0) return flagged;

  return products;
}

export function getProductById(
  products: Product[],
  id: string
): Product | undefined {
  return products.find((p) => p.id === id);
}

export type ShopFilter =
  | "all"
  | "crinkles"
  | "packs"
  | "lava"
  | "iced-drinks";

export const shopFilters: { id: ShopFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "crinkles", label: "Crinkles" },
  { id: "packs", label: "Packs" },
  { id: "lava", label: "Lava Crinkles" },
  { id: "iced-drinks", label: "Iced Drinks" },
];

export const shopSections = [
  {
    id: "crinkles",
    title: "Crinkles",
    subtitle: "Handcrafted Filipino-inspired crinkles, soft-centred and fudgy.",
    filter: "crinkles" as ShopFilter,
    categories: ["crinkle-standard", "crinkle-premium", "crinkle-signature"],
  },
  {
    id: "packs",
    title: "Crinkle Packs",
    subtitle: "One flavour per box. The price on the card is the pack price.",
    filter: "packs" as ShopFilter,
    categories: ["crinkle-pack"],
  },
  {
    id: "lava",
    title: "Lava Crinkles",
    subtitle: "Rich, gooey and made to melt.",
    filter: "lava" as ShopFilter,
    categories: ["lava"],
  },
  {
    id: "iced-drinks",
    title: "Iced Drinks",
    subtitle: "12oz. Whole milk included. Alternative milk is +$1.00 in your box.",
    filter: "iced-drinks" as ShopFilter,
    categories: ["iced-drink"],
  },
];

export function getProductsForFilter(
  products: Product[],
  filter: ShopFilter
): Product[] {
  if (filter === "all") return products;
  const section = shopSections.find((s) => s.filter === filter);
  if (!section) return [];
  return products.filter((p) => section.categories.includes(p.category));
}

export function getProductsForSection(
  products: Product[],
  categories: string[]
): Product[] {
  return products.filter((p) => categories.includes(p.category));
}

const BEST_SELLER_IDS = [
  "classic-chocolate",
  "classic-ube",
  "classic-coconut-pandan",
  "lava-champorado",
  "drink-ube-matcha",
  "classic-chocolate-pack-6",
] as const;

export function getBestSellers(products: Product[]): Product[] {
  const byId = new Map(products.map((product) => [product.id, product]));
  const picked: Product[] = [];
  const seen = new Set<string>();

  const add = (product: Product | undefined) => {
    if (!product || seen.has(product.id) || product.available === false) return;
    seen.add(product.id);
    picked.push(product);
  };

  for (const id of BEST_SELLER_IDS) add(byId.get(id));

  const rest = products.filter(
    (product) => product.category !== "crinkle-pack"
  );
  for (const product of [...rest, ...products]) {
    if (picked.length >= 6) break;
    add(product);
  }

  return picked.slice(0, 6);
}
