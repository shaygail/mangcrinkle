"use client";

import { useEffect, useRef } from "react";
import { Product } from "@/types";
import { getProductPlaceholder } from "@/lib/images";
import ProductImage from "@/components/ProductImage";
import PackCustomizerForm from "./PackCustomizerForm";

interface PackExpandedPanelProps {
  pack: Product;
  onClose: () => void;
  onAdded?: (name: string) => void;
}

export default function PackExpandedPanel({
  pack,
  onClose,
  onAdded,
}: PackExpandedPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [pack.id]);

  return (
    <div
      ref={panelRef}
      className="mt-10 lg:mt-14 border-t border-mang-brown/20 pt-10 lg:pt-14 fade-in"
    >
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
        {/* Product image */}
        <div className="relative aspect-[4/5] bg-mang-tan overflow-hidden border border-mang-brown/15">
          <ProductImage
            src={pack.image}
            alt={pack.name}
            fallback={getProductPlaceholder(pack)}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Product details */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-mang-brown uppercase tracking-wide leading-tight">
                {pack.name}
              </h2>
              <p className="mt-3 text-xl sm:text-2xl font-bold text-mang-brown">
                from ${pack.price.toFixed(2)}
              </p>
              <p className="mt-2 text-xs text-mang-brown/55 tracking-wide">
                Premium upgrades +$0.50 · Signature upgrades +$1.00 per crinkle
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 p-2 text-mang-brown/40 hover:text-mang-brown transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="text-sm text-mang-brown/75 leading-relaxed mb-8 max-w-md">
            {pack.description}
          </p>

          <PackCustomizerForm
            key={pack.id}
            pack={pack}
            onAdded={onAdded}
            namePrefix={`expanded-${pack.id}`}
            variant="editorial"
          />

          <div className="mt-10 border-t border-mang-brown/15 divide-y divide-mang-brown/15">
            <details className="group py-4">
              <summary className="flex items-center justify-between cursor-pointer list-none text-[11px] font-bold tracking-[0.2em] uppercase text-mang-brown [&::-webkit-details-marker]:hidden">
                Pack details
                <span className="text-mang-brown/40 group-open:hidden">+</span>
                <span className="text-mang-brown/40 hidden group-open:inline">
                  −
                </span>
              </summary>
              <div className="pt-4 text-sm text-mang-brown/70 leading-relaxed space-y-2">
                <p>Mix &amp; match any crinkle flavours in your pack.</p>
                <p>Standard flavours included at base price.</p>
                <p>Premium flavours add $0.50 per crinkle.</p>
                <p>Signature flavours add $1.00 per crinkle.</p>
              </div>
            </details>

            <details className="group py-4">
              <summary className="flex items-center justify-between cursor-pointer list-none text-[11px] font-bold tracking-[0.2em] uppercase text-mang-brown [&::-webkit-details-marker]:hidden">
                How to order
                <span className="text-mang-brown/40 group-open:hidden">+</span>
                <span className="text-mang-brown/40 hidden group-open:inline">
                  −
                </span>
              </summary>
              <div className="pt-4 text-sm text-mang-brown/70 leading-relaxed">
                <p>
                  Choose a flavour for each crinkle slot, set your quantity, then
                  add to cart. You can edit your selections anytime from the cart.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
