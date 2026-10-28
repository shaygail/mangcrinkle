export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category:
    | "crinkle-standard"
    | "crinkle-premium"
    | "crinkle-signature"
    | "crinkle-pack"
    | "lava"
    | "hot-drink"
    | "iced-drink";
  tier?: string;
  badge?: string;
  note?: string;
  /** Show in mobile shop “All” curated feed */
  featuredOnShop?: boolean;
  shopSortOrder?: number;
  /** Available as a flavour in the Box Builder */
  showInBoxBuilder?: boolean;
  boxBuilderSortOrder?: number;
  /** Pack builder page title override */
  builderTitle?: string;
  builderSubtitle?: string;
  /** False when the owner has marked this item sold out. */
  available?: boolean;
  /** Supabase product row. Present in the admin. */
  dbId?: string;
  revision?: number;
  status?: "draft" | "published" | "archived";
  hasUnpublishedChanges?: boolean;
  packSize?: number;
  /** Mixed-flavour box builder. Off unless explicitly enabled. */
  mixedFlavours?: boolean;
  ingredients?: string;
  allergens?: string;
  fullDescription?: string;
  variants?: ProductVariantOption[];
  lineSlug?: string;
  lineName?: string;
  categorySlug?: string;
}

export interface ProductVariantOption {
  sku: string;
  label: string;
  displayName: string;
  price: number;
  packSize: number;
  available: boolean;
  category: Product["category"];
}

export type MilkType = "whole" | "oat" | "soy" | "coconut" | "almond";

export interface CartItem {
  lineId: string;
  product: Product;
  quantity: number;
  milk?: MilkType;
  packSelections?: string[];
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface OrderItemPayload {
  productId: string;
  quantity: number;
  milk?: MilkType;
  packSelections?: string[];
}

export interface OrderRequest {
  customer: OrderCustomer;
  items: OrderItemPayload[];
  /** Honeypot — must be empty */
  website?: string;
}

export interface OrderLine {
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  milk?: string;
  packSummary?: string;
}

export interface OrderSummary {
  orderId: string;
  customer: OrderCustomer;
  lines: OrderLine[];
  subtotal: number;
  createdAt: string;
}
