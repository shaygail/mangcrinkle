"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import CheckoutForm, {
  type CheckoutSuccessMeta,
} from "@/components/CheckoutForm";
import {
  loadPickupSession,
  saveOrderConfirm,
} from "@/lib/order-session";

export default function CheckoutPageClient() {
  const router = useRouter();
  const { items } = useCart();
  const [pickupSummary, setPickupSummary] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
      return;
    }
    const session = loadPickupSession();
    setPickupSummary(session.summary);
    setReady(true);
  }, [items.length, router]);

  const handleSuccess = (orderId: string, meta: CheckoutSuccessMeta) => {
    saveOrderConfirm({ orderId, ...meta });
    router.push("/order/confirmation");
  };

  if (!ready || items.length === 0) {
    return (
      <div className="bg-mang-cream-light min-h-[50vh] flex items-center justify-center">
        <p className="text-sm text-mang-brown-mid">Loading checkout…</p>
      </div>
    );
  }

  return (
    <div className="bg-mang-cream-light">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-20 pt-8 lg:pt-10 pb-16 lg:pb-20">
        <div className="mb-6 lg:mb-8">
          <h1 className="menu-title-3d text-4xl lg:text-[42px] leading-none">
            Secure Checkout
          </h1>
          <p className="text-sm italic text-mang-brown-mid mt-1">
            Confirm your details — we&apos;ll email when your order is locked in
          </p>
        </div>

        <CheckoutForm
          onBack={() => router.push("/cart")}
          pickupSummary={pickupSummary}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
