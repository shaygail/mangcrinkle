"use client";

import { useState } from "react";
import { Product } from "@/types";
import { isDrink } from "@/lib/cart";
import { getProductPlaceholder } from "@/lib/images";
import ProductImage from "@/components/ProductImage";
import Button from "@/components/Button";
import ProductAddModal from "@/components/ProductAddModal";

interface ProductCardProps {
  product: Product;
  onAdded?: (name: string) => void;
}

export default function ProductCard({ product, onAdded }: ProductCardProps) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <article className="group flex flex-row sm:flex-col items-stretch bg-mang-tan border-2 border-mang-brown rounded-2xl overflow-hidden shadow-[3px_3px_0_rgba(74,44,26,0.2)]">
        <div className="relative w-[7.75rem] sm:w-full shrink-0 self-stretch sm:self-auto sm:aspect-[4/3] md:aspect-square overflow-hidden bg-mang-cream">
          <ProductImage
            src={product.image}
            alt={product.name}
            fallback={getProductPlaceholder(product)}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 124px, (max-width: 1024px) 50vw, 25vw"
          />
          {product.badge && (
            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-[1] bg-mang-orange text-mang-brown text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase border border-mang-brown">
              {product.badge}
            </span>
          )}
        </div>

        <div className="relative z-[1] flex flex-col flex-1 min-w-0 p-3 sm:p-4 bg-mang-tan">
          {product.tier && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-mang-brown/60 mb-0.5 sm:mb-1">
              {product.tier}
            </p>
          )}
          <h3 className="menu-product-title text-sm sm:text-base mb-1 line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="menu-body-text text-xs mb-2 sm:mb-3 flex-1 opacity-90 line-clamp-2 sm:line-clamp-3">
            {product.description}
            {isDrink(product) && (
              <span className="hidden sm:block mt-1 text-mang-brown/50">
                Whole milk included. Choose oat, soy, coconut, or almond when
                adding (+$1.00).
              </span>
            )}
          </p>
          {product.note && (
            <p className="text-[11px] text-mang-brown/80 bg-mang-brown/10 rounded-lg px-2 py-1 mb-2 sm:mb-3 line-clamp-2">
              {product.note}
            </p>
          )}
          <div className="mt-auto flex flex-col gap-2 sm:gap-3">
            <p className="menu-price text-lg sm:text-xl">
              ${product.price.toFixed(2)}
            </p>
            <Button
              type="button"
              variant="brown"
              pop
              fullWidth
              className="min-h-11 text-xs sm:text-sm relative z-[1]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setAddOpen(true);
              }}
            >
              {isDrink(product) ? "Choose Options" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </article>

      {addOpen && (
        <ProductAddModal
          product={product}
          onClose={() => setAddOpen(false)}
          onAdded={onAdded}
        />
      )}
    </>
  );
}
