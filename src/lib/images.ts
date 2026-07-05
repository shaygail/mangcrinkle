import { Product } from "@/types";

export const PLACEHOLDERS = {
  cookie: "/images/placeholders/cookie.svg",
  drinkHot: "/images/placeholders/drink-hot.svg",
  drinkIced: "/images/placeholders/drink-iced.svg",
  lava: "/images/placeholders/lava.svg",
  pack: "/images/placeholders/pack.svg",
  hero: "/images/placeholders/hero.svg",
} as const;

export function getProductPlaceholder(product: Product): string {
  switch (product.category) {
    case "crinkle-pack":
      return PLACEHOLDERS.pack;
    case "lava":
      return PLACEHOLDERS.lava;
    case "hot-drink":
      return PLACEHOLDERS.drinkHot;
    case "iced-drink":
      return PLACEHOLDERS.drinkIced;
    default:
      return PLACEHOLDERS.cookie;
  }
}

export function resolveProductImage(product: Product): string {
  return product.image || getProductPlaceholder(product);
}
