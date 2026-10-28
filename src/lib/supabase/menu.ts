import type { Product } from "@/types";

export type MenuVariant = {
  sku: string;
  label: string;
  displayName: string;
  packSize: number;
  priceCents: number;
  storefrontCategory: Product["category"];
  flavourSlug: string | null;
  flavourName: string | null;
};

export type MenuProduct = {
  slug: string;
  name: string;
  categorySlug: string;
  description: string;
  allowsMixedFlavours: false;
  variants: MenuVariant[];
};

export const menuCategories = [
  { slug: "drinks", name: "Drinks", sortOrder: 1 },
  { slug: "crinkle-classic", name: "Crinkle Classic", sortOrder: 2 },
  { slug: "crunch-creation", name: "Crunch Creation", sortOrder: 3 },
  { slug: "lava-crinkles", name: "Lava Crinkles", sortOrder: 4 },
] as const;

const classicFlavours = [
  ["chocolate", "Chocolate"],
  ["ube", "Ube"],
  ["mint", "Mint"],
  ["chocolate-butternut", "Chocolate Butternut"],
  ["coconut-pandan", "Coconut Pandan"],
  ["red-velvet", "Red Velvet"],
] as const;

const crunchFlavours = [
  ["pistachio", "Pistachio"],
  ["ube-matcha", "Ube Matcha"],
] as const;

const lavaFlavours = [
  ["champorado", "Champorado"],
  ["ube", "Ube"],
] as const;

const classicPacks = [
  { packSize: 1, label: "Individual", priceCents: 400 },
  { packSize: 3, label: "Pack of 3", priceCents: 1100 },
  { packSize: 6, label: "Pack of 6", priceCents: 2100 },
  { packSize: 12, label: "Pack of 12", priceCents: 4000 },
] as const;

const crunchPacks = [
  { packSize: 1, label: "Individual", priceCents: 500 },
  { packSize: 3, label: "Pack of 3", priceCents: 1400 },
  { packSize: 6, label: "Pack of 6", priceCents: 2700 },
] as const;

function lineVariants(
  lineSlug: string,
  flavours: readonly (readonly [string, string])[],
  packs: readonly { packSize: number; label: string; priceCents: number }[],
  individualCategory: Product["category"]
): MenuVariant[] {
  const variants: MenuVariant[] = [];
  for (const [flavourSlug, flavourName] of flavours) {
    for (const pack of packs) {
      const sku =
        pack.packSize === 1
          ? `${lineSlug}-${flavourSlug}`
          : `${lineSlug}-${flavourSlug}-pack-${pack.packSize}`;
      variants.push({
        sku,
        label: pack.label,
        displayName:
          pack.packSize === 1
            ? flavourName
            : `${flavourName} · ${pack.label}`,
        packSize: pack.packSize,
        priceCents: pack.priceCents,
        storefrontCategory:
          pack.packSize === 1 ? individualCategory : "crinkle-pack",
        flavourSlug,
        flavourName,
      });
    }
  }
  return variants;
}

export const confirmedMenu: MenuProduct[] = [
  {
    slug: "drinks",
    name: "Drinks",
    categorySlug: "drinks",
    description: "12oz.",
    allowsMixedFlavours: false,
    variants: [
      {
        sku: "drink-ube-matcha",
        label: "12oz",
        displayName: "Ube Matcha",
        packSize: 1,
        priceCents: 1250,
        storefrontCategory: "iced-drink",
        flavourSlug: null,
        flavourName: null,
      },
      {
        sku: "drink-ube-latte",
        label: "12oz",
        displayName: "Ube Latte",
        packSize: 1,
        priceCents: 1150,
        storefrontCategory: "iced-drink",
        flavourSlug: null,
        flavourName: null,
      },
      {
        sku: "drink-iced-chocolate",
        label: "12oz",
        displayName: "Iced Chocolate",
        packSize: 1,
        priceCents: 1100,
        storefrontCategory: "iced-drink",
        flavourSlug: null,
        flavourName: null,
      },
    ],
  },
  {
    slug: "crinkle-classic",
    name: "Crinkle Classic",
    categorySlug: "crinkle-classic",
    description: "Crinkle Classic.",
    allowsMixedFlavours: false,
    variants: lineVariants(
      "classic",
      classicFlavours,
      classicPacks,
      "crinkle-standard"
    ),
  },
  {
    slug: "crunch-creation",
    name: "Crunch Creation",
    categorySlug: "crunch-creation",
    description: "Crunch Creation.",
    allowsMixedFlavours: false,
    variants: lineVariants(
      "crunch",
      crunchFlavours,
      crunchPacks,
      "crinkle-premium"
    ),
  },
  {
    slug: "lava-crinkles",
    name: "Lava Crinkles",
    categorySlug: "lava-crinkles",
    description: "Lava Crinkles.",
    allowsMixedFlavours: false,
    variants: lineVariants("lava", lavaFlavours, [
      { packSize: 1, label: "Individual", priceCents: 950 },
    ], "lava"),
  },
];

export function centsToDollars(cents: number): number {
  return Math.round(cents) / 100;
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}
