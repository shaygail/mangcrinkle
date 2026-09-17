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
