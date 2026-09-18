import type { Metadata } from "next";
import CartPageClient from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Your Sweet Box | Mang Crinkle",
  description: "Review your crinkles and choose a pickup window.",
};

export default function CartPage() {
  return <CartPageClient />;
}
