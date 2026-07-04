"use client";

import { useEffect } from "react";

export default function AddedToCartDialog({
  open,
  itemName,
  onClose,
  onViewCart,
}: {
  open: boolean;
  itemName: string;
  onClose: () => void;
  onViewCart: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-5 py-10 bg-mang-brown/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="added-to-cart-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md border-2 border-mang-brown bg-mang-cream px-8 py-10 shadow-[4px_4px_0_rgba(61,36,24,0.2)] rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center text-mang-brown/60 hover:text-mang-brown text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
        <p className="text-[10px] tracking-[0.35em] uppercase text-mang-brown/50 mb-3">
          Mang Crinkle
        </p>
        <h2
          id="added-to-cart-title"
          className="menu-title-3d text-2xl leading-snug"
        >
          Added to your order
        </h2>
        <p className="mt-3 text-sm text-mang-brown leading-relaxed">{itemName}</p>
        <p className="mt-4 text-xs text-mang-brown/60 leading-relaxed">
          Go to your cart to review and pay, or keep browsing the menu.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3.5 text-[11px] tracking-[0.25em] uppercase border-2 border-mang-brown/25 text-mang-brown hover:bg-mang-tan transition-colors rounded-full"
          >
            Keep shopping
          </button>
          <button
            type="button"
            onClick={onViewCart}
            className="w-full sm:w-auto px-8 py-3.5 text-[11px] tracking-[0.25em] uppercase border-2 border-mang-brown bg-mang-brown text-mang-cream text-center hover:bg-mang-brown-mid transition-colors rounded-full"
          >
            View cart
          </button>
        </div>
      </div>
    </div>
  );
}
