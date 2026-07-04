"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import {
  calculatePackUnitPrice,
  createEmptyPackSelections,
  getPackSize,
  isPackSelectionsComplete,
} from "@/lib/cart";
import { PackFlavourPicker } from "./PackFlavourPicker";

interface PackCustomizerFormProps {
  pack: Product;
  onAdded?: (name: string) => void;
  namePrefix?: string;
  variant?: "default" | "editorial";
}

export default function PackCustomizerForm({
  pack,
  onAdded,
  namePrefix = "shop",
  variant = "default",
}: PackCustomizerFormProps) {
  const { addItem } = useCart();
  const packSize = getPackSize(pack);
  const [selections, setSelections] = useState(() =>
    createEmptyPackSelections(pack)
  );
  const [quantity, setQuantity] = useState(1);

  const isComplete = isPackSelectionsComplete(selections, packSize);
  const unitTotal = calculatePackUnitPrice(pack, selections);
  const lineTotal = unitTotal * quantity;
  const incompleteCount = selections.filter((id) => id === "").length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;
    addItem(pack, quantity, { packSelections: selections });
    onAdded?.(pack.name);
  };

  const isEditorial = variant === "editorial";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <PackFlavourPicker
        pack={pack}
        selections={selections}
        onChange={setSelections}
        namePrefix={namePrefix}
        variant={variant}
      />

      {!isComplete && (
        <p className="text-xs text-mang-orange font-medium tracking-wide">
          {incompleteCount === 1
            ? "Choose a flavour for the remaining crinkle before adding to cart."
            : `Choose a flavour for all ${incompleteCount} remaining crinkles before adding to cart.`}
        </p>
      )}

      {isEditorial ? (
        <div className="space-y-6 pt-2 border-t border-mang-brown/15">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-mang-brown mb-3">
              Quantity
            </p>
            <div className="inline-flex items-center border border-mang-brown/30">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-12 h-12 flex items-center justify-center text-mang-brown hover:bg-mang-tan/50 transition-colors text-lg"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-12 h-12 flex items-center justify-center text-sm font-bold text-mang-brown border-x border-mang-brown/30">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-12 h-12 flex items-center justify-center text-mang-brown hover:bg-mang-tan/50 transition-colors text-lg"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-4">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-mang-brown">
              Total
            </span>
            <span className="text-xl font-bold text-mang-brown">
              {isComplete ? `$${lineTotal.toFixed(2)}` : "—"}
            </span>
          </div>

          <button
            type="submit"
            disabled={!isComplete}
            className="w-full py-4 text-[11px] font-bold tracking-[0.25em] uppercase bg-mang-brown text-mang-cream hover:bg-mang-brown-mid transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-mang-brown"
          >
            Add to Cart
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center pt-2 border-t border-mang-brown/10">
            <span className="text-[10px] tracking-[0.25em] uppercase text-mang-brown/60">
              Pack total
            </span>
            <span className="font-bold text-mang-brown text-lg">
              {isComplete ? `$${unitTotal.toFixed(2)}` : "—"}
            </span>
          </div>

          <button
            type="submit"
            disabled={!isComplete}
            className="w-full sm:w-auto px-8 py-3 text-[11px] tracking-[0.3em] uppercase border bg-mang-brown border-mang-brown text-mang-cream text-center cursor-pointer hover:bg-mang-brown-mid transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-mang-brown"
          >
            {isComplete
              ? `Add to Order — $${unitTotal.toFixed(2)}`
              : "Complete all crinkles to add"}
          </button>
        </div>
      )}
    </form>
  );
}
