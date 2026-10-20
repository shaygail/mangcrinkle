import type { Metadata } from "next";
import CheckoutPageClient from "@/components/cart/CheckoutPageClient";
import { getStorefrontCopy, getStoreOutlet } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Checkout | Mang Crinkle",
  description: "Confirm your details and place your Mang Crinkle order.",
};

export default async function CheckoutPage() {
  const [copy, outlet] = await Promise.all([
    getStorefrontCopy(),
    getStoreOutlet(),
  ]);
  return <CheckoutPageClient copy={copy} outlet={outlet} />;
}
