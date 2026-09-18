import type { Metadata } from "next";
import ConfirmationPageClient from "@/components/cart/ConfirmationPageClient";

export const metadata: Metadata = {
  title: "Order Confirmed | Mang Crinkle",
  description: "Your Mang Crinkle order is confirmed for pickup.",
};

export default function OrderConfirmationPage() {
  return <ConfirmationPageClient />;
}
