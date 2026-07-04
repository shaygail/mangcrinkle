"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Button from "@/components/Button";
import { PackFlavourPicker } from "@/components/shop/PackFlavourPicker";
import {
  formatPackSelectionsSummary,
  getItemUnitPrice,
  isDrink,
  isPack,
  milkOptions,
} from "@/lib/cart";
import { MilkType } from "@/types";

export default function CartDrawer() {
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

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-mang-brown/40 z-50 fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-mang-cream z-50 shadow-2xl cart-slide-in flex flex-col border-l-2 border-mang-brown/20">
        <div className="flex items-center justify-between p-6 border-b border-mang-brown/15">
          <h2 className="menu-title-3d text-2xl">
            Your Cart{itemCount > 0 ? ` (${itemCount})` : ""}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 text-mang-brown hover:text-mang-orange transition-colors"
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

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-5xl mb-4">🍪</p>
              <p className="text-mang-brown/60 text-lg">Your cart is empty.</p>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => {
                const unitPrice = getItemUnitPrice(item);
                const drink = isDrink(item.product);
                const pack = isPack(item.product);
                const packExpanded = expandedPackLine === item.lineId;

                return (
                  <li key={item.lineId} className="flex gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-mang-tan border border-mang-brown/20">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-mang-brown leading-tight mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-mang-orange font-bold text-sm">
                        ${unitPrice.toFixed(2)}
                        {item.milk && item.milk !== "whole" && (
                          <span className="text-mang-brown/60 font-normal text-xs ml-1">
                            incl. alt. milk
                          </span>
                        )}
                      </p>

                      {pack && item.packSelections && (
                        <div className="mt-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-mang-brown/60 mb-1">
                            Your crinkles
                          </p>
                          <p className="text-xs text-mang-brown/80 mb-2 leading-relaxed">
                            {formatPackSelectionsSummary(item.packSelections)}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedPackLine(
                                packExpanded ? null : item.lineId
                              )
                            }
                            className="text-xs text-mang-brown font-bold underline hover:text-mang-orange"
                          >
                            {packExpanded ? "Hide flavours" : "Edit flavours"}
                          </button>
                          {packExpanded && (
                            <div className="mt-3 p-3 bg-mang-tan/60 rounded-xl border border-mang-brown/15">
                              <PackFlavourPicker
                                pack={item.product}
                                selections={item.packSelections}
                                onChange={(selections) =>
                                  updatePackSelections(item.lineId, selections)
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
                            className="w-full text-xs bg-mang-cream border border-mang-brown/25 rounded-lg px-2 py-1.5 text-mang-brown focus:outline-none focus:border-mang-orange"
                          >
                            {milkOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-mang-brown/25 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.lineId, item.quantity - 1)
                            }
                            className="px-2 py-1 hover:bg-mang-tan text-sm text-mang-brown"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 text-sm border-x border-mang-brown/25 text-mang-brown">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.lineId, item.quantity + 1)
                            }
                            className="px-2 py-1 hover:bg-mang-tan text-sm text-mang-brown"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.lineId)}
                          className="text-xs text-mang-brown/50 hover:text-mang-brown underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="font-bold text-sm text-mang-brown">
                      ${(unitPrice * item.quantity).toFixed(2)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-mang-brown/15 p-6 space-y-4 bg-mang-tan/50">
            <div className="flex justify-between items-center">
              <span className="font-bold text-mang-brown">Subtotal</span>
              <span className="menu-title-3d text-2xl">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <Button variant="brown" fullWidth>
              Checkout
            </Button>
            <button
              onClick={closeCart}
              className="w-full text-center text-sm text-mang-brown/60 hover:text-mang-brown underline"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
