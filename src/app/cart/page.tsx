import type { Metadata } from "next";
import CartPageClient from "@/components/cart/CartPageClient";
import { getStorefrontCopy, getStoreOutlet } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Your Sweet Box | Mang Crinkle",
  description: "Review your crinkles and choose a pickup window.",
};

export default async function CartPage() {
  const [copy, outlet] = await Promise.all([
    getStorefrontCopy(),
    getStoreOutlet(),
  ]);
  return <CartPageClient copy={copy} outlet={outlet} />;
}
