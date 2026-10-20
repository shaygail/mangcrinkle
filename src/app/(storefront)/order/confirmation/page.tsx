import type { Metadata } from "next";
import ConfirmationPageClient from "@/components/cart/ConfirmationPageClient";
import { getStorefrontCopy, getStoreOutlet } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Order Confirmed | Mang Crinkle",
  description: "Your Mang Crinkle order is confirmed for pickup.",
};

export default async function OrderConfirmationPage() {
  const [copy, outlet] = await Promise.all([
    getStorefrontCopy(),
    getStoreOutlet(),
  ]);
  return <ConfirmationPageClient copy={copy} outlet={outlet} />;
}
