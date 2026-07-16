"use client";

import { useState } from "react";
import { Product } from "@/types";
import { getCrinkleFlavours } from "@/data/products";
import { useProducts } from "@/context/ProductsContext";
import {
  getCrinkleLabel,
  getCrinkleUpgradeFee,
  getPackSize,
} from "@/lib/cart";

function upgradeSuffix(products: Product[], crinkleId: string): string {
  const fee = getCrinkleUpgradeFee(products, crinkleId);
  if (fee === 0) return "";
  return fee === 0.5 ? " +$0.50" : " +$1.00";
}

interface PackFlavourPickerProps {
  pack: Product;
  selections: string[];
  onChange: (selections: string[]) => void;
  namePrefix?: string;
  variant?: "default" | "editorial";
}

function FlavourPills({
  pack,
  slotIndex,
  selections,
  onSelect,
  namePrefix,
  variant,
  products,
}: {
  pack: Product;
  slotIndex: number;
  selections: string[];
  onSelect: (crinkleId: string) => void;
  namePrefix: string;
  variant: "default" | "editorial";
  products: Product[];
}) {
  const crinkleFlavours = getCrinkleFlavours(products);
  const tiers = [
    {
      label: "Standard",
      items: crinkleFlavours.filter((c) => c.category === "crinkle-standard"),
    },
    {
      label: "Premium",
      items: crinkleFlavours.filter((c) => c.category === "crinkle-premium"),
    },
    {
      label: "Signature",
      items: crinkleFlavours.filter((c) => c.category === "crinkle-signature"),
    },
  ];

  const allFlavours = [
    ...tiers[0].items,
    ...tiers[1].items,
    ...tiers[2].items,
  ];

  const pillClass =
    variant === "editorial"
      ? "inline-flex min-h-11 items-center justify-center px-4 py-2.5 text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase border border-mang-brown/30 text-mang-brown leading-tight text-center peer-checked:bg-mang-brown peer-checked:text-mang-cream peer-checked:border-mang-brown transition-colors hover:border-mang-brown/60"
      : "block px-3 py-2 text-[10px] sm:text-[11px] tracking-[0.12em] uppercase border border-mang-brown/25 text-mang-brown leading-snug peer-checked:bg-mang-brown peer-checked:text-mang-cream peer-checked:border-mang-brown transition-colors";

  if (variant === "editorial") {
    return (
      <div className="flex flex-wrap gap-2 pt-1 pb-2">
        {allFlavours.map((crinkle) => (
          <label key={crinkle.id} className="cursor-pointer">
            <input
              type="radio"
              name={`${namePrefix}-${pack.id}-slot-${slotIndex}`}
              value={crinkle.id}
              checked={selections[slotIndex] === crinkle.id}
              onChange={() => onSelect(crinkle.id)}
              className="sr-only peer"
            />
            <span className={pillClass}>
              {crinkle.name}
              {upgradeSuffix(products, crinkle.id)}
            </span>
          </label>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pt-1 pb-2">
      {tiers.map((tier) => (
        <div key={tier.label}>
          <p className="text-[9px] tracking-[0.2em] uppercase text-mang-brown/45 mb-1.5">
            {tier.label}
            {tier.label === "Premium" && " (+$0.50 each)"}
            {tier.label === "Signature" && " (+$1.00 each)"}
          </p>
          <div className="flex gap-2 flex-wrap">
            {tier.items.map((crinkle) => (
              <label key={crinkle.id} className="cursor-pointer">
                <input
                  type="radio"
                  name={`${namePrefix}-${pack.id}-slot-${slotIndex}`}
                  value={crinkle.id}
                  checked={selections[slotIndex] === crinkle.id}
                  onChange={() => onSelect(crinkle.id)}
                  className="sr-only peer"
                />
                <span className={pillClass}>
                  {crinkle.name}
                  {upgradeSuffix(products, crinkle.id)}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PackFlavourPicker({
  pack,
  selections,
  onChange,
  namePrefix = "pack",
  variant = "default",
}: PackFlavourPickerProps) {
  const { products } = useProducts();
  const packSize = getPackSize(pack);
  const [openSlot, setOpenSlot] = useState(0);

  const isSlotUnlocked = (index: number) => {
    if (index === 0) return true;
    return selections.slice(0, index).every((id) => id !== "");
  };

  const updateSlot = (index: number, crinkleId: string) => {
    const next = [...selections];
    const wasEmpty = next[index] === "";
    next[index] = crinkleId;
    onChange(next);

    if (wasEmpty && index + 1 < packSize) {
      setOpenSlot(index + 1);
    } else if (wasEmpty) {
      setOpenSlot(-1);
    }
  };

  const toggleSlot = (index: number) => {
    if (!isSlotUnlocked(index)) return;
    setOpenSlot((current) => (current === index ? -1 : index));
  };

  return (
    <div className="divide-y divide-mang-brown/15 border-t border-mang-brown/15">
      {Array.from({ length: packSize }, (_, i) => {
        const selected = selections[i] !== "";
        const unlocked = isSlotUnlocked(i);
        const isOpen = unlocked && openSlot === i;

        return (
          <details
            key={i}
            className={`group ${!unlocked ? "opacity-50" : ""}`}
            open={isOpen}
          >
            <summary
              className={`flex items-start justify-between gap-4 py-4 list-none [&::-webkit-details-marker]:hidden ${
                unlocked ? "cursor-pointer" : "cursor-not-allowed"
              }`}
              onClick={(e) => {
                e.preventDefault();
                toggleSlot(i);
              }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-mang-brown">
                    Crinkle {i + 1}
                  </span>
                  {unlocked && !selected && (
                    <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-mang-orange">
                      Required
                    </span>
                  )}
                  {!unlocked && (
                    <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-mang-brown/45">
                      Locked
                    </span>
                  )}
                </div>
                <span
                  className={`block mt-1 text-xs leading-relaxed ${
                    selected
                      ? "text-mang-brown font-medium"
                      : unlocked
                        ? "text-mang-brown/50 italic"
                        : "text-mang-brown/40 italic"
                  }`}
                >
                  {selected
                    ? getCrinkleLabel(products, selections[i])
                    : unlocked
                      ? "Choose a flavour to continue"
                      : `Pick crinkle ${i} first`}
                </span>
              </div>
              {unlocked && (
                <span className="text-xs text-mang-brown/40 tracking-widest shrink-0 mt-0.5">
                  {isOpen ? "−" : "+"}
                </span>
              )}
            </summary>

            {unlocked && (
              <FlavourPills
                pack={pack}
                slotIndex={i}
                selections={selections}
                onSelect={(crinkleId) => updateSlot(i, crinkleId)}
                namePrefix={namePrefix}
                variant={variant}
                products={products}
              />
            )}
          </details>
        );
      })}
    </div>
  );
}
