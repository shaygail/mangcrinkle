"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import {
  loadOrderConfirm,
  type OrderConfirmSession,
} from "@/lib/order-session";

export default function ConfirmationPageClient() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderConfirmSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = loadOrderConfirm();
    if (!session) {
      router.replace("/shop");
      return;
    }
    setOrder(session);
    setReady(true);
  }, [router]);

  if (!ready || !order) {
    return (
      <div className="bg-mang-cream-light min-h-[50vh] flex items-center justify-center">
        <p className="text-sm text-mang-brown-mid">Loading confirmation…</p>
      </div>
    );
  }

  return (
    <div className="bg-mang-cream-light">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 lg:px-20 pt-10 lg:pt-14 pb-16 lg:pb-20 space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-5 flex size-24 items-center justify-center rounded-full border-[3px] border-mang-brown bg-mang-orange shadow-[3px_3px_0_rgba(61,36,23,0.12)] text-5xl">
            🍪
          </div>
          <h1 className="menu-title-3d text-4xl sm:text-[42px] mb-3">
            Order is Confirmed!
          </h1>
          <p className="text-sm italic text-mang-brown-mid max-w-md mx-auto">
            Your fresh batch of soft-centred crinkle magic is officially locked
            in. Swing by during your window for the perfect warm cookie
            experience.
          </p>
        </div>

        <div className="bg-mang-cream border-2 border-mang-brown rounded-2xl p-5 sm:p-6 shadow-[3px_3px_0_rgba(61,36,23,0.12)] space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="menu-title-3d text-2xl">Order #{order.orderId}</p>
            <span className="bg-mang-orange-bright border border-mang-brown text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">
              Ready Soon
            </span>
          </div>
          <div className="border-t border-dashed border-mang-brown/30 pt-4 space-y-4">
            <div className="flex gap-3">
              <span className="text-xl" aria-hidden>
                📍
              </span>
              <div>
                <p className="text-[11px] font-extrabold uppercase text-mang-brown-mid">
                  Pickup Location
                </p>
                <p className="font-bold text-mang-brown text-sm">
                  Manila Town Kitchen (HQ)
                </p>
                <p className="text-xs text-mang-brown-mid">
                  Open 10:00 AM – 8:00 PM Daily
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-xl" aria-hidden>
                ⏰
              </span>
              <div>
                <p className="text-[11px] font-extrabold uppercase text-mang-brown-mid">
                  Selected Schedule Window
                </p>
                <p className="font-bold text-mang-brown text-sm">
                  {order.pickup}
                </p>
                <p className="text-xs italic text-mang-brown-mid">
                  Arrive during this window for fresh &amp; warm cookies.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-mang-brown rounded-2xl p-5 sm:p-6 shadow-[3px_3px_0_rgba(61,36,23,0.12)] space-y-3">
          <p className="menu-title-3d text-xl">Your Box Details</p>
          {order.lines.map((line) => (
            <div
              key={`${line.name}-${line.qty}`}
              className="flex justify-between gap-3 text-sm text-mang-brown"
            >
              <span>
                {line.name} (Qty: {line.qty})
              </span>
              <span className="font-bold shrink-0">
                ${line.total.toFixed(2)}
              </span>
            </div>
          ))}
          <div className="border-t border-dashed border-mang-brown/30 pt-3 flex justify-between items-end">
            <span className="menu-title-3d text-lg">Total</span>
            <div className="text-right">
              <p className="font-extrabold text-xl text-mang-brown">
                ${order.subtotal.toFixed(2)}
              </p>
              {order.payment && (
                <p className="text-[11px] font-bold uppercase text-mang-brown-mid opacity-80">
                  {order.payment}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Button href="/shop" variant="yellow" pop fullWidth>
            ← Back to Crinkle Shop
          </Button>
          <Link
            href="/shop"
            className="block w-full text-center text-sm font-bold text-mang-brown underline"
          >
            Keep browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
