"use client";

import Link from "next/link";
import { Product } from "@/types";
import { isDrink, isPack } from "@/lib/cart";
import { getProductPlaceholder } from "@/lib/images";
import ProductImage from "@/components/ProductImage";
import Button from "@/components/Button";

interface ProductCardProps {
  product: Product;
  onAdded?: (name: string) => void;
  /** Compact 2-col mobile card (homepage Fan Favourites) */
  compact?: boolean;
  /** Full-width shop mobile card (Figma 32:167) */
  shopMobile?: boolean;
}

export default function ProductCard({
  product,
  compact = false,
  shopMobile = false,
}: ProductCardProps) {
  const pack = isPack(product);
  const productHref = `/shop/${product.id}`;

  const ctaLabel = pack
    ? shopMobile
      ? "+ Add to Box"
      : "Choose Flavours"
    : isDrink(product)
      ? shopMobile
        ? "+ Add to Box"
        : "Choose Options"
      : "+ Add to Box";

  return (
    <article
      className={`group flex flex-col overflow-hidden h-full rounded-2xl ${
        compact
          ? "bg-mang-cream-light border-2 border-mang-cream shadow-[2px_2px_0_rgba(61,36,23,0.1)]"
          : "bg-mang-cream-light border-2 border-mang-brown shadow-[3px_3px_0_rgba(61,36,23,0.14)]"
      }`}
    >
      <Link
        href={productHref}
        className={`relative w-full shrink-0 overflow-hidden bg-mang-cream block ${
          compact
            ? "h-[130px]"
            : shopMobile
              ? "h-[180px]"
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
              ? "(max-width: 1024px) 50vw, 410px"
              : shopMobile
                ? "100vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
        />
        {product.badge && (
          <span className="absolute top-3 left-3 z-[1] bg-mang-orange-bright text-mang-brown text-[12px] font-extrabold px-3 py-1.5 rounded-full uppercase border-[1.5px] border-mang-brown">
            {product.badge}
          </span>
        )}
      </Link>

      <div
        className={`flex flex-col flex-1 min-w-0 ${
          compact
            ? "p-3 gap-2"
            : shopMobile
              ? "p-4 gap-2.5"
              : "p-4 sm:p-5 lg:p-6 gap-3"
        }`}
      >
        {shopMobile ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between gap-3">
              <Link
                href={productHref}
                className="min-w-0 hover:opacity-80"
              >
                <h3 className="menu-product-title text-[22px] text-mang-brown tracking-wide uppercase leading-tight">
                  {product.name}
                </h3>
              </Link>
              <p className="font-bold text-base text-mang-brown shrink-0 pt-1">
                ${product.price.toFixed(2)}
              </p>
            </div>
            <p className="text-xs text-mang-brown-mid leading-4 line-clamp-2">
              {product.description}
            </p>
          </div>
        ) : (
          <>
            <div
              className={
                compact
                  ? "flex flex-col gap-0.5"
                  : "flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2"
              }
            >
              <Link
                href={productHref}
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
                className={`font-semibold text-mang-brown-mid shrink-0 ${
                  compact
                    ? "text-xs"
                    : "font-bold text-mang-brown text-base sm:text-lg"
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
          </>
        )}

        <Button
          href={productHref}
          variant="yellow"
          pop
          fullWidth
          className={`mt-auto relative z-[1] min-h-11 text-[12px] ${
            compact ? "" : "sm:text-sm"
          }`}
        >
          {ctaLabel}
        </Button>
      </div>
    </article>
  );
}
