import type { Metadata } from "next";
import CheckoutPageClient from "@/components/cart/CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout | Mang Crinkle",
  description: "Confirm your details and place your Mang Crinkle order.",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
