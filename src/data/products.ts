import { Product } from "@/types";
import { PLACEHOLDERS } from "@/lib/images";

const cookieImg = PLACEHOLDERS.cookie;
const drinkImg = PLACEHOLDERS.drinkHot;
const icedImg = PLACEHOLDERS.drinkIced;
const packImg = PLACEHOLDERS.pack;
const lavaImg = PLACEHOLDERS.lava;

const drinkNote = "Whole milk included. Alternative milk +$1.00 in cart.";

export const products: Product[] = [
  // Standard crinkles – $4.50 each
  {
    id: "classic-chocolate",
    name: "Classic Chocolate",
    description: "Standard crinkle — soft-centred and fudgy.",
    price: 4.5,
    image: cookieImg,
    category: "crinkle-standard",
    tier: "Standard",
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
    name: "Ube",
    description: "Premium crinkle — Filipino-inspired ube flavour.",
    price: 5.0,
    image: cookieImg,
    category: "crinkle-premium",
    tier: "Premium",
    badge: "Premium",
  },
  {
    id: "coconut-pandan",
    name: "Coconut Pandan",
    description: "Premium crinkle — coconut pandan flavour.",
    price: 5.0,
    image: cookieImg,
    category: "crinkle-premium",
    tier: "Premium",
    badge: "Premium",
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
    name: "6 Pack Crinkles",
    description: "Mix & match any flavours. Premium +$0.50, Signature +$1.00 per crinkle.",
    price: 25.0,
    image: packImg,
    category: "crinkle-pack",
  },
  {
    id: "pack-12",
    name: "12 Pack Crinkles",
    description: "Mix & match any flavours. Premium +$0.50, Signature +$1.00 per crinkle.",
    price: 48.0,
    image: packImg,
    category: "crinkle-pack",
  },
  // Lava crinkles
  {
    id: "lava-single",
    name: "Lava Crinkle — Each",
    description: "Rich, gooey and made to melt.",
    price: 6.5,
    image: lavaImg,
    category: "lava",
  },
  {
    id: "lava-3",
    name: "Lava Crinkle — 3 Pack",
    description: "Rich, gooey and made to melt.",
    price: 19.0,
    image: lavaImg,
    category: "lava",
  },
  {
    id: "lava-6",
    name: "Lava Crinkle — 6 Pack",
    description: "Rich, gooey and made to melt.",
    price: 38.0,
    image: lavaImg,
    category: "lava",
  },
  {
    id: "lava-12",
    name: "Lava Crinkle — 12 Pack",
    description: "Pre-order required. Please allow 2–3 days.",
    price: 76.0,
    image: lavaImg,
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

export const crinkleFlavours = products.filter(
  (p) =>
    p.category === "crinkle-standard" ||
    p.category === "crinkle-premium" ||
    p.category === "crinkle-signature"
);

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export type ShopFilter =
  | "all"
  | "crinkles"
  | "packs"
  | "lava"
  | "hot-drinks"
  | "iced-drinks";

export const shopFilters: { id: ShopFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "crinkles", label: "Crinkles" },
  { id: "packs", label: "Packs" },
  { id: "lava", label: "Lava Crinkles" },
  { id: "hot-drinks", label: "Hot Drinks" },
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
    subtitle: "Mix & match your favourite flavours. Premium +$0.50, Signature +$1.00 per crinkle.",
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
    id: "hot-drinks",
    title: "Hot Drinks",
    subtitle: "410 ml — whole milk included. Swap to alternative milk in your cart (+$1.00).",
    filter: "hot-drinks" as ShopFilter,
    categories: ["hot-drink"],
  },
  {
    id: "iced-drinks",
    title: "Iced Drinks",
    subtitle: "530 ml — whole milk included. Swap to alternative milk in your cart (+$1.00).",
    filter: "iced-drinks" as ShopFilter,
    categories: ["iced-drink"],
  },
];

export function getProductsForFilter(filter: ShopFilter): Product[] {
  if (filter === "all") return products;
  const section = shopSections.find((s) => s.filter === filter);
  if (!section) return products;
  return products.filter((p) => section.categories.includes(p.category));
}

export function getProductsForSection(categories: string[]): Product[] {
  return products.filter((p) => categories.includes(p.category));
}

export const bestSellers = products.filter(
  (p) =>
    p.id === "ube" ||
    p.id === "ube-matcha" ||
    p.id === "lava-single" ||
    p.id === "iced-ube-marble-matcha"
);
