"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { getProductPlaceholder } from "@/lib/images";
import { getBestSellers } from "@/data/products";
import Button from "@/components/Button";
import CheckoutForm from "@/components/CheckoutForm";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import { PackFlavourPicker } from "@/components/shop/PackFlavourPicker";
import {
  formatPackSelectionsSummary,
  getItemUnitPrice,
  isDrink,
  isPack,
  milkOptions,
} from "@/lib/cart";
import { MilkType } from "@/types";

const PICKUP_TIMES = [
  "10:00 - 10:30 AM",
  "11:00 - 11:30 AM",
  "12:00 - 12:30 PM",
  "1:30 - 2:00 PM",
  "3:30 - 4:00 PM",
  "5:00 - 5:30 PM",
  "6:30 - 7:00 PM",
] as const;

function formatPickupDate(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  if (offsetDays === 0) return `Today, ${d.toLocaleDateString("en-NZ", { month: "short", day: "numeric" })}`;
  if (offsetDays === 1) return `Tomorrow, ${d.toLocaleDateString("en-NZ", { month: "short", day: "numeric" })}`;
  return d.toLocaleDateString("en-NZ", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function CartDrawer() {
  const { products } = useProducts();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    updateMilk,
    updatePackSelections,
    subtotal,
    itemCount,
  } = useCart();

  const [expandedPackLine, setExpandedPackLine] = useState<string | null>(null);
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [pickupDay, setPickupDay] = useState(0);
  const [pickupTime, setPickupTime] = useState<string>(PICKUP_TIMES[4]);
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [lastOrderLines, setLastOrderLines] = useState<
    { name: string; qty: number; total: number }[]
  >([]);
  const [lastSubtotal, setLastSubtotal] = useState(0);
  const [lastPickup, setLastPickup] = useState("");
  const [lastPayment, setLastPayment] = useState("");

  const suggestions = useMemo(
    () => getBestSellers(products).slice(0, 3),
    [products]
  );

  const pickupSummary = `${formatPickupDate(pickupDay)} @ ${pickupTime}`;

  const handleClose = useCallback(() => {
    setStep("cart");
    setOrderId(null);
    setExpandedPackLine(null);
    closeCart();
  }, [closeCart]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const activeExpandedPackLine =
    expandedPackLine && items.some((item) => item.lineId === expandedPackLine)
      ? expandedPackLine
      : null;

  if (!isOpen) return null;

  const title =
    step === "checkout"
      ? "Secure Pickup Checkout"
      : step === "success"
        ? "Order Confirmed"
        : "Your Sweet Box";

  return (
    <>
      <div
        className="fixed inset-0 bg-mang-brown/40 z-50 fade-in"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="fixed right-0 top-0 h-[100dvh] w-full max-w-lg lg:max-w-xl bg-mang-cream-light z-50 shadow-2xl cart-slide-in flex flex-col border-l-2 border-mang-brown/20">
        <div className="flex items-start justify-between gap-3 p-4 sm:p-6 border-b border-mang-cream shrink-0">
          <div>
            <h2 className="menu-title-3d text-2xl sm:text-3xl leading-none">
              {title}
            </h2>
            {step === "cart" && (
              <p className="text-sm italic text-mang-brown-mid mt-1">
                Review your sweet assorted crinkles &amp; configure pickup
              </p>
            )}
            {step === "checkout" && (
              <p className="text-sm italic text-mang-brown-mid mt-1">
                Complete your contact details below
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="min-h-11 min-w-11 p-2.5 flex items-center justify-center text-mang-brown hover:text-mang-orange transition-colors shrink-0"
            aria-label="Close cart"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain">
          {step === "success" ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full border-[3px] border-mang-brown bg-mang-orange shadow-[3px_3px_0_rgba(61,36,23,0.12)] text-4xl">
                  🍪
                </div>
                <h3 className="menu-title-3d text-3xl mb-2">
                  Order is Confirmed!
                </h3>
                <p className="text-sm italic text-mang-brown-mid max-w-sm mx-auto">
                  Your fresh batch of soft-centred crinkle magic is officially
                  locked in. Swing by during your window for the perfect warm
                  cookie experience.
                </p>
              </div>

              <div className="bg-mang-cream border-2 border-mang-brown rounded-2xl p-5 shadow-[3px_3px_0_rgba(61,36,23,0.12)] space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="menu-title-3d text-xl">
                    Order #{orderId ?? "—"}
                  </p>
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
                        {lastPickup || pickupSummary}
                      </p>
                      <p className="text-xs italic text-mang-brown-mid">
                        Arrive during this window for fresh &amp; warm cookies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-mang-brown rounded-2xl p-5 shadow-[3px_3px_0_rgba(61,36,23,0.12)] space-y-3">
                <p className="menu-title-3d text-xl">Your Box Details</p>
                {lastOrderLines.map((line) => (
                  <div
                    key={line.name}
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
                      ${lastSubtotal.toFixed(2)}
                    </p>
                    {lastPayment && (
                      <p className="text-[11px] font-bold uppercase text-mang-brown-mid opacity-80">
                        {lastPayment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : step === "checkout" ? (
            <CheckoutForm
              onBack={() => setStep("cart")}
              pickupSummary={pickupSummary}
              onSuccess={(id, meta) => {
                setOrderId(id);
                setLastOrderLines(meta.lines);
                setLastSubtotal(meta.subtotal);
                setLastPickup(meta.pickup);
                setLastPayment(meta.payment);
                setStep("success");
              }}
            />
          ) : items.length === 0 ? (
            <div className="space-y-8">
              <div className="bg-mang-cream border-2 border-mang-brown rounded-2xl p-8 text-center shadow-[3px_3px_0_rgba(61,36,23,0.12)]">
                <div className="mx-auto mb-4 flex size-28 items-center justify-center rounded-2xl border-2 border-mang-brown bg-mang-tan text-4xl">
                  🍪✨
                </div>
                <h3 className="menu-title-3d text-3xl mb-2">
                  Your Box is Empty!
                </h3>
                <p className="text-sm italic text-mang-brown-mid mb-6 max-w-sm mx-auto">
                  There is currently no handcrafted sweet cookie magic inside
                  your box. Create a custom bundle of fudgy crinkles for
                  same-day pickup now!
                </p>
                <Button
                  href="/shop"
                  variant="yellow"
                  pop
                  fullWidth
                  onClick={handleClose}
                >
                  🍪 Start Building Your Box
                </Button>
              </div>

              {suggestions.length > 0 && (
                <div>
                  <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-mang-brown-mid text-center mb-1">
                    Craved Favourites
                  </p>
                  <h3 className="menu-title-3d text-2xl text-center mb-4">
                    Popular Additions
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {suggestions.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        compact
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <ul className="space-y-4">
                {items.map((item) => {
                  const unitPrice = getItemUnitPrice(products, item);
                  const drink = isDrink(item.product);
                  const pack = isPack(item.product);
                  const packExpanded = activeExpandedPackLine === item.lineId;
                  const lineTotal = unitPrice * item.quantity;

                  return (
                    <li
                      key={item.lineId}
                      className="bg-white border-2 border-mang-brown rounded-2xl p-3 sm:p-4 shadow-[3px_3px_0_rgba(61,36,23,0.12)]"
                    >
                      <div className="flex gap-3 sm:gap-4">
                        <div className="relative size-[72px] sm:size-[100px] shrink-0 rounded-[10px] overflow-hidden border-[1.5px] border-mang-brown bg-mang-tan">
                          <ProductImage
                            src={item.product.image}
                            alt={item.product.name}
                            fallback={getProductPlaceholder(item.product)}
                            fill
                            className="object-cover"
                            sizes="100px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              {item.product.badge && (
                                <span className="inline-block mb-1 bg-mang-orange-bright border border-mang-brown text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                                  {item.product.badge}
                                </span>
                              )}
                              <h3 className="menu-product-title text-lg sm:text-xl uppercase tracking-wide leading-tight">
                                {item.product.name}
                              </h3>
                            </div>
                            <p className="font-extrabold text-mang-brown shrink-0">
                              ${lineTotal.toFixed(2)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-2 mt-2">
                            <p className="text-xs text-mang-brown-mid">
                              Unit Price: ${unitPrice.toFixed(2)} each
                            </p>
                            <div className="inline-flex items-center gap-3 rounded-full border-[1.5px] border-mang-brown bg-mang-cream-light px-3 py-1.5 text-sm font-extrabold">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.lineId, item.quantity - 1)
                                }
                                className="min-h-8 min-w-8 text-mang-brown-mid"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="min-w-4 text-center text-mang-brown">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.lineId, item.quantity + 1)
                                }
                                className="min-h-8 min-w-8 text-mang-brown-mid"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {pack && item.packSelections && (
                            <div className="mt-2">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-mang-brown/60 mb-1">
                                Your crinkles
                              </p>
                              <p className="text-xs text-mang-brown/80 mb-2 leading-relaxed">
                                {formatPackSelectionsSummary(
                                  products,
                                  item.packSelections
                                )}
                              </p>
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedPackLine(
                                    packExpanded ? null : item.lineId
                                  )
                                }
                                className="min-h-11 inline-flex items-center py-2 text-xs text-mang-brown font-bold underline hover:text-mang-orange"
                              >
                                {packExpanded ? "Hide flavours" : "Edit flavours"}
                              </button>
                              {packExpanded && (
                                <div className="mt-3 p-3 bg-mang-tan/60 rounded-xl border border-mang-brown/15">
                                  <PackFlavourPicker
                                    pack={item.product}
                                    selections={item.packSelections}
                                    onChange={(selections) =>
                                      updatePackSelections(
                                        item.lineId,
                                        selections
                                      )
                                    }
                                    namePrefix={`cart-${item.lineId}`}
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          {drink && (
                            <div className="mt-2">
                              <label
                                htmlFor={`milk-${item.lineId}`}
                                className="text-[10px] font-bold uppercase tracking-wider text-mang-brown/60 block mb-1"
                              >
                                Milk
                              </label>
                              <select
                                id={`milk-${item.lineId}`}
                                value={item.milk ?? "whole"}
                                onChange={(e) =>
                                  updateMilk(
                                    item.lineId,
                                    e.target.value as MilkType
                                  )
                                }
                                className="w-full min-h-11 text-sm bg-mang-cream-light border border-mang-brown/25 rounded-lg px-3 py-2 text-mang-brown focus:outline-none focus:border-mang-orange"
                              >
                                {milkOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => removeItem(item.lineId)}
                            className="mt-2 min-h-11 inline-flex items-center text-xs text-mang-brown/50 hover:text-mang-brown underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={promo}
                  onChange={(e) => {
                    setPromo(e.target.value);
                    setPromoApplied(false);
                  }}
                  placeholder="Promo code"
                  className="flex-1 min-h-11 rounded-full border-2 border-mang-brown bg-white px-4 text-sm text-mang-brown focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPromoApplied(promo.trim().toUpperCase() === "CRINKLELOVE20")
                  }
                  className="shrink-0 min-h-11 px-5 rounded-full border-2 border-mang-brown bg-mang-tan text-[12px] font-extrabold uppercase text-mang-brown"
                >
                  Apply Promo
                </button>
              </div>
              {promoApplied && (
                <p className="text-xs font-bold text-mang-brown">
                  Promo noted for pickup — we&apos;ll confirm any discount by
                  email.
                </p>
              )}

              <div className="bg-mang-cream border-2 border-mang-brown rounded-2xl p-4 space-y-3 shadow-[3px_3px_0_rgba(61,36,23,0.12)]">
                <p className="menu-title-3d text-xl flex items-center gap-2">
                  <span aria-hidden>📍</span> Select Pickup Schedule
                </p>
                <div className="bg-white border-[1.5px] border-mang-brown rounded-lg p-3">
                  <p className="text-[11px] font-extrabold uppercase text-mang-brown-mid">
                    Store Outlet
                  </p>
                  <p className="font-bold text-sm text-mang-brown">
                    Mang Crinkle HQ – Manila Town Kitchen
                  </p>
                  <p className="text-xs text-mang-brown-mid">
                    Open 10:00 AM – 8:00 PM Daily
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={pickupDay}
                    onChange={(e) => setPickupDay(Number(e.target.value))}
                    className="min-h-11 rounded-lg border-[1.5px] border-mang-brown bg-white px-3 text-sm font-bold text-mang-brown"
                  >
                    {[0, 1, 2].map((d) => (
                      <option key={d} value={d}>
                        {formatPickupDate(d)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="min-h-11 rounded-lg border-[1.5px] border-mang-brown bg-white px-3 text-sm font-bold text-mang-brown"
                  >
                    {PICKUP_TIMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {step === "cart" && items.length > 0 && (
          <div className="border-t border-mang-cream p-4 sm:p-6 space-y-4 bg-mang-cream shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="flex justify-between items-center">
              <span className="text-sm text-mang-brown-mid">
                Subtotal ({itemCount} items)
              </span>
              <span className="menu-title-3d text-2xl">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <Button
              variant="yellow"
              pop
              fullWidth
              onClick={() => setStep("checkout")}
            >
              🔒 Proceed to Secure Checkout
            </Button>
            <button
              onClick={handleClose}
              className="w-full text-center text-sm text-mang-brown/60 hover:text-mang-brown underline"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="border-t border-mang-cream p-4 sm:p-6 space-y-3 bg-mang-cream shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Button
              href="/shop"
              variant="yellow"
              pop
              fullWidth
              onClick={handleClose}
            >
              ← Back to Crinkle Shop
            </Button>
            <Link
              href="/shop"
              onClick={handleClose}
              className="block w-full text-center text-sm font-bold text-mang-brown underline"
            >
              Keep browsing
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
