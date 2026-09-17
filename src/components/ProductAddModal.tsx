"use client";

import { useEffect, useState } from "react";
import { MilkType, Product } from "@/types";
import { ALT_MILK_PRICE, isDrink, milkOptions } from "@/lib/cart";
import { getProductPlaceholder } from "@/lib/images";
import { useCart } from "@/context/CartContext";
import ProductImage from "@/components/ProductImage";
import Button from "@/components/Button";

interface ProductAddModalProps {
  product: Product;
  onClose: () => void;
  onAdded?: (name: string) => void;
}

export default function ProductAddModal({
  product,
  onClose,
  onAdded,
}: ProductAddModalProps) {
  const { addItem } = useCart();
  const drink = isDrink(product);
  const [quantity, setQuantity] = useState(1);
  const [milk, setMilk] = useState<MilkType>("whole");

  const unitPrice =
    product.price + (drink && milk !== "whole" ? ALT_MILK_PRICE : 0);
  const lineTotal = unitPrice * quantity;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const handleAdd = () => {
    addItem(product, quantity, {
      ...(drink ? { milk } : {}),
      openCart: onAdded ? false : true,
    });
    onAdded?.(product.name);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`product-modal-title-${product.id}`}
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-mang-brown/45 backdrop-blur-[2px]"
        aria-hidden="true"
      />

      <div
        className="fade-in relative z-10 w-full max-w-lg max-h-[92dvh] overflow-y-auto overscroll-contain
          bg-mang-cream border-2 border-mang-brown rounded-t-2xl sm:rounded-2xl
          shadow-[4px_4px_0_rgba(61,36,24,0.2)]
          px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]
          sm:px-6 sm:pt-6 sm:pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-mang-brown/20 sm:hidden" />

        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mang-brown/50 mb-1">
              {drink ? "Customise your drink" : "Add to order"}
            </p>
            <h2
              id={`product-modal-title-${product.id}`}
              className="text-xl sm:text-2xl font-bold text-mang-brown uppercase tracking-wide leading-tight"
            >
              {product.name}
            </h2>
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

        <div className="relative aspect-[16/10] bg-mang-tan overflow-hidden border border-mang-brown/15 rounded-xl mb-4">
          <ProductImage
            src={product.image}
            alt={product.name}
            fallback={getProductPlaceholder(product)}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 512px"
            priority
          />
        </div>

        <p className="text-sm text-mang-brown/75 leading-relaxed mb-5">
          {product.description}
        </p>

        {drink && (
          <fieldset className="mb-5">
            <legend className="text-[11px] font-bold uppercase tracking-[0.18em] text-mang-brown mb-3">
              Choose milk
            </legend>
            <div className="grid grid-cols-1 gap-2">
              {milkOptions.map((opt) => {
                const selected = milk === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 min-h-11 px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-colors ${
                      selected
                        ? "border-mang-brown bg-mang-tan"
                        : "border-mang-brown/20 bg-mang-cream hover:border-mang-brown/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`milk-${product.id}`}
                      value={opt.value}
                      checked={selected}
                      onChange={() => setMilk(opt.value)}
                      className="sr-only"
                    />
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        selected
                          ? "border-mang-brown bg-mang-brown"
                          : "border-mang-brown/40"
                      }`}
                      aria-hidden
                    >
                      {selected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-mang-cream" />
                      )}
                    </span>
                    <span className="text-sm font-medium text-mang-brown">
                      {opt.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        <div className="flex items-center justify-between gap-4 mb-5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-mang-brown">
            Quantity
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="min-h-11 min-w-11 border-2 border-mang-brown/25 rounded-full text-mang-brown hover:border-mang-brown transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-8 text-center font-bold text-mang-brown">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="min-h-11 min-w-11 border-2 border-mang-brown/25 rounded-full text-mang-brown hover:border-mang-brown transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-mang-brown/50">
              Total
            </p>
            <p className="menu-price text-2xl">${lineTotal.toFixed(2)}</p>
          </div>
          {drink && milk !== "whole" && (
            <p className="text-xs text-mang-brown/60 text-right">
              Incl. alt. milk +${ALT_MILK_PRICE.toFixed(2)} each
            </p>
          )}
        </div>

        <Button variant="brown" pop fullWidth onClick={handleAdd}>
          Add to Cart — ${lineTotal.toFixed(2)}
        </Button>
      </div>
    </div>
  );
}
