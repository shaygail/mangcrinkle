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
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [pack.id, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`pack-modal-title-${pack.id}`}
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-mang-brown/45 backdrop-blur-[2px]"
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className="fade-in relative z-10 w-full max-w-3xl max-h-[92dvh] overflow-y-auto overscroll-contain
          bg-mang-cream border-2 border-mang-brown rounded-t-2xl sm:rounded-2xl
          shadow-[4px_4px_0_rgba(61,36,24,0.2)]
          px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]
          sm:px-6 sm:pt-6 sm:pb-6
          outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-mang-brown/20 sm:hidden" />

        <div className="grid sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-5 sm:gap-8 items-start">
          <div className="relative aspect-[4/3] sm:aspect-[4/5] bg-mang-tan overflow-hidden border border-mang-brown/15 rounded-xl hidden sm:block">
            <ProductImage
              src={pack.image}
              alt={pack.name}
              fallback={getProductPlaceholder(pack)}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 40vw"
              priority
            />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mang-brown/50 mb-1">
                  Choose your flavours
                </p>
                <h2
                  id={`pack-modal-title-${pack.id}`}
                  className="text-xl sm:text-3xl font-bold text-mang-brown uppercase tracking-wide leading-tight"
                >
                  {pack.name}
                </h2>
                <p className="mt-2 text-lg sm:text-2xl font-bold text-mang-brown">
                  from ${pack.price.toFixed(2)}
                </p>
                <p className="mt-1 text-xs text-mang-brown/55 tracking-wide">
                  Premium +$0.50 · Signature +$1.00 per crinkle
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 min-h-11 min-w-11 p-2.5 flex items-center justify-center text-mang-brown/40 hover:text-mang-brown transition-colors"
                aria-label="Close"
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
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="text-sm text-mang-brown/75 leading-relaxed mb-5 max-w-md">
              {pack.description}
            </p>

            <PackCustomizerForm
              key={pack.id}
              pack={pack}
              onAdded={onAdded}
              namePrefix={`modal-${pack.id}`}
              variant="editorial"
            />

            <div className="mt-6 border-t border-mang-brown/15 pt-4">
              <p className="text-xs text-mang-brown/60 leading-relaxed">
                Pick a flavour for each crinkle slot, then add to cart. You can
                edit flavours anytime from the cart.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
