import { CartItem, MilkType, Product } from "@/types";
import { getProductById } from "@/data/products";

export const ALT_MILK_PRICE = 1.0;
export const PREMIUM_UPGRADE = 0.5;
export const SIGNATURE_UPGRADE = 1.0;

export const milkOptions: { value: MilkType; label: string }[] = [
  { value: "whole", label: "Whole milk" },
  { value: "oat", label: "Oat (+$1.00)" },
  { value: "soy", label: "Soy (+$1.00)" },
  { value: "coconut", label: "Coconut (+$1.00)" },
  { value: "almond", label: "Almond (+$1.00)" },
];

export function isDrink(product: Product): boolean {
  return product.category === "hot-drink" || product.category === "iced-drink";
}

export function isPack(product: Product): boolean {
  return product.category === "crinkle-pack";
}

export function getPackSize(product: Product): number {
  if (product.id === "pack-3") return 3;
  if (product.id === "pack-6") return 6;
  if (product.id === "pack-12") return 12;
  return 0;
}

export function getCrinkleUpgradeFee(
  products: Product[],
  crinkleId: string
): number {
  const crinkle = getProductById(products, crinkleId);
  if (!crinkle) return 0;
  if (crinkle.category === "crinkle-premium") return PREMIUM_UPGRADE;
  if (crinkle.category === "crinkle-signature") return SIGNATURE_UPGRADE;
  return 0;
}

export function getDefaultPackSelections(pack: Product): string[] {
  const size = getPackSize(pack);
  return Array.from({ length: size }, () => "classic-chocolate");
}

export function createEmptyPackSelections(pack: Product): string[] {
  return Array.from({ length: getPackSize(pack) }, () => "");
}

export function isPackSelectionsComplete(
  products: Product[],
  selections: string[],
  packSize: number
): boolean {
  if (selections.length !== packSize) return false;
  return selections.every(
    (id) => id !== "" && getProductById(products, id) !== undefined
  );
}

export function calculatePackUnitPrice(
  products: Product[],
  pack: Product,
  selections: string[]
): number {
  const upgrades = selections
    .filter((id) => id !== "")
    .reduce((sum, id) => sum + getCrinkleUpgradeFee(products, id), 0);
  return pack.price + upgrades;
}

export function getCartLineId(
  product: Product,
  options?: { milk?: MilkType; packSelections?: string[] }
): string {
  if (isDrink(product)) {
    return `${product.id}::${options?.milk ?? "whole"}`;
  }
  if (isPack(product) && options?.packSelections?.length) {
    return `${product.id}::${options.packSelections.join(",")}`;
  }
  return product.id;
}

export function getItemUnitPrice(
  products: Product[],
  item: CartItem
): number {
  if (isPack(item.product) && item.packSelections?.length) {
    return calculatePackUnitPrice(products, item.product, item.packSelections);
  }

  const base = item.product.price;
  if (isDrink(item.product) && item.milk && item.milk !== "whole") {
    return base + ALT_MILK_PRICE;
  }
  return base;
}

export function getMilkLabel(milk: MilkType): string {
  return milkOptions.find((o) => o.value === milk)?.label ?? milk;
}

export function getCrinkleLabel(
  products: Product[],
  crinkleId: string
): string {
  return getProductById(products, crinkleId)?.name ?? crinkleId;
}

export function formatPackSelectionsSummary(
  products: Product[],
  selections: string[]
): string {
  const counts = selections.reduce<Record<string, number>>((acc, id) => {
    acc[id] = (acc[id] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([id, count]) =>
      count > 1
        ? `${getCrinkleLabel(products, id)} ×${count}`
        : getCrinkleLabel(products, id)
    )
    .join(", ");
}

export function normalizeCartItem(
  raw: Partial<CartItem> & { product: Product }
): CartItem {
  const milk = isDrink(raw.product) ? (raw.milk ?? "whole") : undefined;
  const packSelections = isPack(raw.product)
    ? raw.packSelections ?? getDefaultPackSelections(raw.product)
    : undefined;

  return {
    lineId:
      raw.lineId ??
      getCartLineId(raw.product, { milk, packSelections }),
    product: raw.product,
    quantity: raw.quantity ?? 1,
    milk,
    packSelections,
  };
}
