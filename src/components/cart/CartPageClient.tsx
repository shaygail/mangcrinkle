"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { getBestSellers } from "@/data/products";
import { getProductPlaceholder } from "@/lib/images";
import {
  buildPickupSummary,
  formatPickupDate,
  loadPickupSession,
  savePickupSession,
} from "@/lib/order-session";
import {
  formatPackSelectionsSummary,
  getItemUnitPrice,
  isDrink,
  isPack,
  milkOptions,
} from "@/lib/cart";
import { MilkType } from "@/types";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import Button from "@/components/Button";
import { PackFlavourPicker } from "@/components/shop/PackFlavourPicker";
import type { StorefrontCopy } from "@/data/storefront-copy";
import type { StoreOutlet } from "@/data/store-outlet";

export default function CartPageClient({
  copy,
  outlet,
}: {
  copy: StorefrontCopy;
  outlet: StoreOutlet;
}) {
  const router = useRouter();
  const { products } = useProducts();
  const {
    items,
    removeItem,
    updateQuantity,
    updateMilk,
    updatePackSelections,
    subtotal,
    itemCount,
  } = useCart();

  const pickupWindows = outlet.pickupWindows;
  const [expandedPackLine, setExpandedPackLine] = useState<string | null>(null);
  const [pickupDay, setPickupDay] = useState(0);
  const [pickupTime, setPickupTime] = useState<string>(
    pickupWindows[Math.min(4, Math.max(0, pickupWindows.length - 1))] ??
      pickupWindows[0] ??
      ""
  );
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [ready, setReady] = useState(false);

  const suggestions = useMemo(
    () => getBestSellers(products).slice(0, 3),
    [products]
  );

  useEffect(() => {
    const session = loadPickupSession(pickupWindows);
    setPickupDay(session.dayOffset);
    setPickupTime(session.time);
    setPromo(session.promo);
    setPromoApplied(session.promo.trim().toUpperCase() === "CRINKLELOVE20");
    setReady(true);
  }, [pickupWindows]);

  useEffect(() => {
    if (!ready) return;
    savePickupSession({
      dayOffset: pickupDay,
      time: pickupTime,
      summary: buildPickupSummary(pickupDay, pickupTime),
      promo,
    });
  }, [pickupDay, pickupTime, promo, ready]);

  const activeExpandedPackLine =
    expandedPackLine && items.some((item) => item.lineId === expandedPackLine)
      ? expandedPackLine
      : null;

  const goCheckout = () => {
    savePickupSession({
      dayOffset: pickupDay,
      time: pickupTime,
      summary: buildPickupSummary(pickupDay, pickupTime),
      promo,
    });
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="bg-mang-cream-light">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-20 py-12 lg:py-16 space-y-12">
          <div className="bg-mang-cream border-2 border-mang-brown rounded-[20px] p-8 sm:p-10 text-center shadow-[3px_3px_0_rgba(61,36,23,0.12)] max-w-3xl mx-auto">
            <div className="mx-auto mb-5 flex size-[140px] items-center justify-center rounded-2xl border-2 border-mang-brown bg-mang-tan text-4xl">
              🍪✨
            </div>
            <h1 className="menu-title-3d text-4xl sm:text-[42px] mb-3">
              {copy.cartEmptyTitle}
            </h1>
            <p className="text-sm italic text-mang-brown-mid max-w-md mx-auto mb-8">
              {copy.cartEmptyBody}
            </p>
            <Button href="/shop" variant="yellow" pop className="min-w-[280px]">
              {copy.cartEmptyCta}
            </Button>
          </div>

          {suggestions.length > 0 && (
            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-mang-brown-mid text-center mb-1">
                Craved Favourites
              </p>
              <h2 className="menu-title-3d text-3xl text-center mb-6">
                Popular Additions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                {suggestions.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-mang-cream-light">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-20 pt-8 lg:pt-10 pb-16 lg:pb-20">
        <div className="mb-6 lg:mb-8">
          <h1 className="menu-title-3d text-4xl lg:text-[42px] leading-none">
            {copy.cartTitle}
          </h1>
          <p className="text-sm italic text-mang-brown-mid mt-1">
            Review your sweet assorted crinkles &amp; configure pickup windows
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-8 items-start">
          {/* Left: items */}
          <div className="flex-1 w-full min-w-0 space-y-4 lg:space-y-6">
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
                    className="bg-white border-2 border-mang-brown rounded-2xl p-4 shadow-[3px_3px_0_rgba(61,36,23,0.12)]"
                  >
                    <div className="flex gap-4 items-start sm:items-center">
                      <div className="relative size-[80px] sm:size-[100px] shrink-0 rounded-[10px] overflow-hidden border-[1.5px] border-mang-brown bg-mang-tan">
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
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            {item.product.badge && (
                              <span className="inline-block mb-1 bg-mang-orange-bright border border-mang-brown text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                                {item.product.badge}
                              </span>
                            )}
                            <h2 className="menu-product-title text-xl sm:text-2xl uppercase tracking-wide leading-tight">
                              {item.product.name}
                            </h2>
                          </div>
                          <p className="font-extrabold text-mang-brown shrink-0">
                            ${lineTotal.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
                          <p className="text-[13px] text-mang-brown-mid">
                            Unit Price: ${unitPrice.toFixed(2)} each
                          </p>
                          <div className="inline-flex items-center gap-3 self-start rounded-full border-[1.5px] border-mang-brown bg-mang-cream-light px-3 py-1.5 text-sm font-extrabold">
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
                          <div className="mt-3">
                            <p className="text-xs text-mang-brown/80 mb-2">
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
                              className="text-xs font-bold underline text-mang-brown"
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
                                  namePrefix={`cart-page-${item.lineId}`}
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {drink && (
                          <div className="mt-3 max-w-xs">
                            <label
                              htmlFor={`milk-page-${item.lineId}`}
                              className="text-[10px] font-bold uppercase tracking-wider text-mang-brown/60 block mb-1"
                            >
                              Milk
                            </label>
                            <select
                              id={`milk-page-${item.lineId}`}
                              value={item.milk ?? "whole"}
                              onChange={(e) =>
                                updateMilk(
                                  item.lineId,
                                  e.target.value as MilkType
                                )
                              }
                              className="w-full min-h-11 text-sm bg-mang-cream-light border border-mang-brown/25 rounded-lg px-3 py-2"
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
                          className="mt-2 text-xs text-mang-brown/50 hover:text-mang-brown underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={promo}
                onChange={(e) => {
                  setPromo(e.target.value);
                  setPromoApplied(false);
                }}
                placeholder="Promo code"
                className="flex-1 min-h-12 rounded-full border-2 border-mang-brown bg-white px-4 text-sm text-mang-brown focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setPromoApplied(
                    promo.trim().toUpperCase() === "CRINKLELOVE20"
                  )
                }
                className="shrink-0 min-h-12 px-6 rounded-full border-2 border-mang-brown bg-mang-tan text-[13px] font-extrabold uppercase text-mang-brown"
              >
                Apply Promo
              </button>
            </div>
            {promoApplied && (
              <p className="text-xs font-bold text-mang-brown">
                Promo noted — we&apos;ll confirm any discount when arranging
                pickup.
              </p>
            )}
          </div>

          {/* Right: sidebar */}
          <aside className="w-full lg:w-[400px] shrink-0 space-y-6 lg:sticky lg:top-28">
            <div className="bg-mang-cream border-2 border-mang-brown rounded-2xl p-5 space-y-4 shadow-[3px_3px_0_rgba(61,36,23,0.12)]">
              <p className="menu-title-3d text-2xl flex items-center gap-2">
                <span aria-hidden>📍</span> Select Pickup Schedule
              </p>
              <div className="bg-white border-[1.5px] border-mang-brown rounded-lg p-3">
                <p className="text-[11px] font-extrabold uppercase text-mang-brown-mid">
                  Store Outlet
                </p>
                <p className="font-bold text-sm text-mang-brown">
                  {outlet.cartLabel}
                </p>
                <p className="text-xs text-mang-brown-mid">{outlet.hours}</p>
                {outlet.address ? (
                  <p className="text-xs text-mang-brown-mid mt-1">
                    {outlet.address}
                  </p>
                ) : null}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2.5">
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
                  {pickupWindows.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-mang-cream border-2 border-mang-brown rounded-[20px] p-6 space-y-3.5 shadow-[3px_3px_0_rgba(61,36,23,0.12)]">
              <p className="menu-title-3d text-[28px] leading-none">
                Order Summary
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-mang-brown-mid">
                  Subtotal ({itemCount} items)
                </span>
                <span className="font-bold text-mang-brown">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-dashed border-mang-brown/30 pt-3 flex justify-between items-center">
                <span className="menu-title-3d text-[26px]">
                  Estimated Total
                </span>
                <span className="font-extrabold text-2xl text-mang-brown">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <Button variant="yellow" pop fullWidth onClick={goCheckout}>
                {copy.cartCheckoutCta}
              </Button>
              <Link
                href="/shop"
                className="block text-center text-sm text-mang-brown/60 hover:text-mang-brown underline"
              >
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
