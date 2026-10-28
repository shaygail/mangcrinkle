import { Product } from "@/types";

export const PLACEHOLDERS = {
  cookie: "/images/placeholders/cookie.svg",
  drinkHot: "/images/placeholders/drink-hot.svg",
  drinkIced: "/images/placeholders/drink-iced.svg",
  lava: "/images/placeholders/lava.svg",
  pack: "/images/placeholders/pack.svg",
  hero: "/images/figma/hero-crinkles.jpg",
} as const;

export function getProductPlaceholder(product: Product): string {
  switch (product.category) {
    case "crinkle-pack":
      return PLACEHOLDERS.pack;
    case "lava":
      return product.id.includes("ube")
        ? "/images/lava/ube.jpeg"
        : "/images/lava/choco.jpeg";
    case "hot-drink":
      return PLACEHOLDERS.drinkHot;
    case "iced-drink": {
      const name = `${product.id} ${product.name}`.toLowerCase();
      return name.includes("chocolate")
        ? "/images/placeholders/iced-chocolate.jpg"
        : "/images/placeholders/iced-citrus.jpg";
    }
    default:
      return PLACEHOLDERS.cookie;
  }
}

export function resolveProductImage(product: Product): string {
  return product.image || getProductPlaceholder(product);
}

/** Small flavour mark for cards that still use a shared illustration. */
export function flavourSwatch(product: Product): string | null {
  const id = `${product.id} ${product.name}`.toLowerCase();
  if (id.includes("ube") && id.includes("matcha")) return "#5f6b3a";
  if (id.includes("matcha")) return "#5f6b3a";
  if (id.includes("ube")) return "#6e4b86";
  if (id.includes("mint")) return "#3f6e58";
  if (id.includes("pandan")) return "#2f6a48";
  if (id.includes("velvet")) return "#8b3d45";
  if (id.includes("pistachio")) return "#7d8a45";
  if (id.includes("butternut")) return "#c47a2c";
  if (id.includes("latte")) return "#c4a574";
  if (id.includes("chocolate") || id.includes("champorado")) return "#3d2418";
  return null;
}
