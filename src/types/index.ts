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

export interface Recipe {
  id: string;
  title: string;
  image: string;
  prep: string;
  cook: string;
  serves: string;
  description: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
}

export interface MenuLineItem {
  name: string;
  price: number;
  productId?: string;
}

export interface MenuTier {
  label: string;
  priceLabel: string;
  items: string[];
  productIds?: string[];
}
