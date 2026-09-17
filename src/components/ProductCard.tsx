"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { isDrink, isPack } from "@/lib/cart";
import { getProductPlaceholder } from "@/lib/images";
import ProductImage from "@/components/ProductImage";
import Button from "@/components/Button";
import ProductAddModal from "@/components/ProductAddModal";

interface ProductCardProps {
  product: Product;
  onAdded?: (name: string) => void;
  /** Compact 2-col mobile card (homepage Fan Favourites) */
  compact?: boolean;
}

export default function ProductCard({
  product,
  onAdded,
  compact = false,
}: ProductCardProps) {
  const [addOpen, setAddOpen] = useState(false);
  const pack = isPack(product);

  const ctaLabel = pack
    ? "Choose Flavours"
    : isDrink(product)
      ? "Choose Options"
      : "+ Add to Box";

  return (
    <>
      <article className="group flex flex-col bg-mang-cream-light border-2 border-mang-brown rounded-2xl overflow-hidden shadow-[3px_3px_0_rgba(61,36,23,0.12)] h-full">
        <Link
          href={`/shop/${product.id}`}
          className={`relative w-full shrink-0 overflow-hidden bg-mang-cream block ${
            compact
              ? "aspect-[4/3] sm:h-[130px] sm:aspect-auto"
              : "h-[180px] sm:h-[220px] lg:h-[260px]"
          }`}
        >
          <ProductImage
            src={product.image}
            alt={product.name}
            fallback={getProductPlaceholder(product)}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes={
              compact
                ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 410px"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
          />
          {product.badge && (
            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-[1] bg-mang-orange-bright text-mang-brown text-[10px] sm:text-xs font-extrabold px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-full uppercase border border-mang-brown">
              {product.badge}
            </span>
          )}
        </Link>

        <div
          className={`flex flex-col flex-1 min-w-0 ${
            compact ? "p-3 gap-2" : "p-4 sm:p-5 lg:p-6 gap-3"
          }`}
        >
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
            <Link
              href={`/shop/${product.id}`}
              className="min-w-0 hover:opacity-80"
            >
              <h3
                className={`menu-product-title text-mang-brown tracking-wide uppercase leading-snug line-clamp-2 ${
                  compact ? "text-base" : "text-lg sm:text-xl lg:text-2xl"
                }`}
              >
                {product.name}
              </h3>
            </Link>
            <p
              className={`font-bold text-mang-brown shrink-0 ${
                compact ? "text-xs sm:text-sm" : "text-base sm:text-lg"
              }`}
            >
              {pack ? "from " : ""}${product.price.toFixed(2)}
            </p>
          </div>

          {!compact && (
            <p className="menu-body-text text-xs sm:text-[13px] text-mang-brown-mid flex-1 line-clamp-2 sm:line-clamp-3">
              {product.description}
            </p>
          )}

          {pack ? (
            <Button
              href="/shop?category=packs"
              variant="yellow"
              pop
              fullWidth
              className={`mt-auto relative z-[1] ${compact ? "min-h-11 text-[11px] sm:text-xs" : "min-h-11 text-xs sm:text-sm"}`}
            >
              {ctaLabel}
            </Button>
          ) : (
            <Button
              type="button"
              variant="yellow"
              pop
              fullWidth
              className={`mt-auto relative z-[1] ${compact ? "min-h-11 text-[11px] sm:text-xs" : "min-h-11 text-xs sm:text-sm"}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setAddOpen(true);
              }}
            >
              {ctaLabel}
            </Button>
          )}
        </div>
      </article>

      {addOpen && !pack && (
        <ProductAddModal
          product={product}
          onClose={() => setAddOpen(false)}
          onAdded={onAdded}
        />
      )}
    </>
  );
}
