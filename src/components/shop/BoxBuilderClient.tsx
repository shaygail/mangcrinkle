"use client";

import { useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { getBoxBuilderFlavours, getProductById } from "@/data/products";
import { getProductPlaceholder } from "@/lib/images";
import {
  calculatePackUnitPrice,
  getPackSize,
  isPack,
  isPackSelectionsComplete,
} from "@/lib/cart";
import ProductImage from "@/components/ProductImage";
import Button from "@/components/Button";
import AddedToCartDialog from "@/components/AddedToCartDialog";

const FLAVOUR_META: Record<string, { initials: string; color: string }> = {
  "classic-chocolate": { initials: "CC", color: "#3d2418" },
  ube: { initials: "SU", color: "#7a539b" },
  "coconut-pandan": { initials: "CP", color: "#4e8264" },
  "lava-choco": { initials: "LC", color: "#c65135" },
  "lava-ube": { initials: "LU", color: "#7a539b" },
  "red-velvet": { initials: "RV", color: "#9b3b4a" },
  "chocolate-mint": { initials: "CM", color: "#3d5c4a" },
  "chocolate-butternut": { initials: "CB", color: "#8a5a2b" },
  "chocolate-pistachio": { initials: "PI", color: "#5c6b3d" },
  "ube-matcha": { initials: "UM", color: "#5c7a4a" },
};

function flavourMeta(id: string) {
  if (FLAVOUR_META[id]) return FLAVOUR_META[id];
  const initials = id
    .split("-")
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
  return { initials: initials || "??", color: "#3d2418" };
}

function countsToSelections(
  counts: Record<string, number>,
  packSize: number
): string[] {
  const filled: string[] = [];
  for (const [id, count] of Object.entries(counts)) {
    for (let i = 0; i < count; i++) filled.push(id);
  }
  while (filled.length < packSize) filled.push("");
  return filled.slice(0, packSize);
}

function packCopy(pack: {
  id: string;
  name: string;
  builderTitle?: string;
  builderSubtitle?: string;
}, packSize: number) {
  const slotsLabel =
    packSize >= 12
      ? "Physical Box Slots (12 Pack)"
      : packSize === 3
        ? "Physical Box Slots (3 Pack)"
        : "Physical Box Slots (6 Pack)";

  return {
    title: pack.builderTitle || pack.name,
    subtitle:
      pack.builderSubtitle ||
      `Choose ${packSize} of your favorite freshly baked flavors.`,
    slotsLabel,
  };
}

interface BoxBuilderClientProps {
  packId: string;
}

export default function BoxBuilderClient({ packId }: BoxBuilderClientProps) {
  const { products } = useProducts();
  const { addItem, openCart } = useCart();
  const pack = getProductById(products, packId);
  const packSize = pack && isPack(pack) ? getPackSize(pack) : 0;
  const flavours = getBoxBuilderFlavours(products);

  const [counts, setCounts] = useState<Record<string, number>>({});
  const [addedOpen, setAddedOpen] = useState(false);

  const selections = useMemo(
    () => countsToSelections(counts, packSize),
    [counts, packSize]
  );
  const filled = selections.filter((id) => id !== "").length;
  const remaining = Math.max(0, packSize - filled);
  const isFull = packSize > 0 && remaining === 0;
  const isComplete =
    !!pack &&
    isPack(pack) &&
    isPackSelectionsComplete(products, selections, packSize);
  const estimated =
    pack && isPack(pack)
      ? calculatePackUnitPrice(products, pack, selections)
      : 0;
  const progress = packSize > 0 ? (filled / packSize) * 100 : 0;
  const slotCols = packSize >= 12 ? "grid-cols-4" : "grid-cols-3";
  const copy = pack
    ? packCopy(pack, packSize)
    : packCopy({ id: packId, name: packId }, packSize);

  if (!pack || !isPack(pack) || packSize === 0) {
    notFound();
  }

  const setFlavourCount = (flavourId: string, next: number) => {
    setCounts((prev) => {
      const current = prev[flavourId] ?? 0;
      const clamped = Math.max(0, next);
      const others = Object.entries(prev).reduce(
        (sum, [id, n]) => (id === flavourId ? sum : sum + n),
        0
      );
      const value = Math.min(clamped, packSize - others);
      if (value === current) return prev;
      const updated = { ...prev };
      if (value === 0) delete updated[flavourId];
      else updated[flavourId] = value;
      return updated;
    });
  };

  const handleAdd = () => {
    if (!isComplete) return;
    addItem(pack, 1, {
      packSelections: selections,
      openCart: false,
    });
    setAddedOpen(true);
    setCounts({});
  };

  return (
    <div className="bg-mang-cream-light min-h-screen pb-28">
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-10 lg:px-8 lg:pt-10 space-y-5">
        <header className="text-center space-y-1">
          <h1 className="menu-logo text-[32px] leading-none text-mang-brown">
            {copy.title}
          </h1>
          <p className="text-[13px] italic text-mang-brown-mid">
            {copy.subtitle}
          </p>
        </header>

        <section className="border-b border-mang-tan pb-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <h2 className="menu-title-3d text-[28px] leading-none text-mang-brown">
                Your Custom Box
              </h2>
              {isFull ? (
                <span className="bg-mang-brown text-mang-cream text-[11px] font-extrabold uppercase px-2 py-1 rounded-md">
                  Box Full
                </span>
              ) : (
                <span className="bg-mang-orange-bright text-mang-brown text-[11px] font-extrabold uppercase px-2 py-1 rounded-md">
                  {filled} / {packSize} Added
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setCounts({})}
              className="text-[13px] font-bold text-mang-brown-mid underline underline-offset-2 shrink-0"
            >
              Reset Box
            </button>
          </div>

          <div className="h-3 rounded-full bg-[#ece0d1] overflow-hidden">
            <div
              className="h-full bg-mang-orange transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-start justify-between gap-3 text-[13px]">
            <p className="font-semibold text-mang-brown-mid">
              {isFull
                ? "Ready to pack and checkout!"
                : `Add ${remaining} more to complete your box`}
            </p>
            <p className="font-extrabold text-mang-brown shrink-0">
              ${estimated.toFixed(2)}
            </p>
          </div>
        </section>

        <section className="bg-mang-cream border-2 border-mang-brown rounded-xl p-3 space-y-2">
          <p className="menu-product-title text-[14px] tracking-wide text-mang-brown">
            {copy.slotsLabel}
          </p>
          <div className={`grid ${slotCols} gap-2`}>
            {selections.map((flavourId, index) => {
              const empty = !flavourId;
              const meta = empty ? null : flavourMeta(flavourId);
              return (
                <div
                  key={index}
                  className={`flex h-[60px] items-center justify-center gap-1 rounded-lg p-2 ${
                    empty
                      ? "border-2 border-dashed border-mang-brown/35 bg-mang-cream-light/60"
                      : "border-[2.5px] bg-white"
                  }`}
                  style={
                    empty
                      ? undefined
                      : { borderColor: meta!.color, color: meta!.color }
                  }
                >
                  <span className="font-[family-name:var(--font-display)] text-[11px] tracking-wide uppercase">
                    Slot {index + 1}
                  </span>
                  {empty ? (
                    <span className="text-mang-brown/40 text-lg font-extrabold leading-none">
                      +
                    </span>
                  ) : (
                    <span
                      className="rounded px-1 py-0.5 text-[10px] font-extrabold text-mang-cream-light"
                      style={{ backgroundColor: meta!.color }}
                    >
                      {meta!.initials}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          {flavours.map((flavour) => {
            const selected = counts[flavour.id] ?? 0;
            const canAdd = filled < packSize;
            return (
              <article
                key={flavour.id}
                className="bg-mang-cream-light border-2 border-mang-brown rounded-2xl overflow-hidden shadow-[3px_3px_0_rgba(61,36,23,0.12)]"
              >
                <div className="relative h-[140px] bg-mang-cream">
                  <ProductImage
                    src={flavour.image}
                    alt={flavour.name}
                    fallback={getProductPlaceholder(flavour)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                  {flavour.badge && (
                    <span className="absolute top-3 left-3 z-[1] bg-mang-orange-bright text-mang-brown text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase border-[1.5px] border-mang-brown">
                      {flavour.badge}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h3 className="menu-product-title text-[22px] text-mang-brown tracking-wide uppercase leading-tight">
                      {flavour.name}
                    </h3>
                    <p className="text-xs text-mang-brown-mid leading-[18px] line-clamp-2">
                      {flavour.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold text-mang-brown">
                      Selected: {selected}
                    </p>
                    <div className="inline-flex items-center gap-4 rounded-full border-2 border-mang-brown bg-mang-cream-light px-3.5 py-2 font-extrabold">
                      <button
                        type="button"
                        aria-label={`Remove one ${flavour.name}`}
                        disabled={selected === 0}
                        onClick={() =>
                          setFlavourCount(flavour.id, selected - 1)
                        }
                        className="min-h-8 min-w-8 text-lg text-mang-brown-mid disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="min-w-4 text-center text-base text-mang-brown">
                        {selected}
                      </span>
                      <button
                        type="button"
                        aria-label={`Add one ${flavour.name}`}
                        disabled={!canAdd}
                        onClick={() =>
                          setFlavourCount(flavour.id, selected + 1)
                        }
                        className="min-h-8 min-w-8 text-lg disabled:text-[#a89890] text-mang-brown-mid"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>

      <div className="fixed bottom-0 inset-x-0 z-40 bg-mang-cream border-t-2 border-mang-brown px-4 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-mang-brown-mid">Estimated Price</p>
            <p className="text-xl font-extrabold text-mang-brown leading-tight">
              ${estimated.toFixed(2)}
            </p>
          </div>
          <div className="w-[min(220px,55%)] shrink-0">
            {isComplete ? (
              <Button
                type="button"
                variant="yellow"
                pop
                fullWidth
                className="!text-[13px]"
                onClick={handleAdd}
              >
                Add to Box
              </Button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full min-h-11 rounded-full border-2 border-mang-brown/40 bg-mang-tan px-4 py-3 text-[13px] font-extrabold uppercase text-mang-brown/70 cursor-not-allowed"
              >
                Choose {remaining} More
              </button>
            )}
          </div>
        </div>
      </div>

      <AddedToCartDialog
        open={addedOpen}
        itemName={pack.name}
        onClose={() => setAddedOpen(false)}
        onViewCart={() => {
          setAddedOpen(false);
          openCart();
        }}
      />
    </div>
  );
}
