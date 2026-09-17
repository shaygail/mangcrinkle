"use client";

import { Product } from "@/types";
import { getProductPlaceholder } from "@/lib/images";
import Button from "@/components/Button";
import ProductImage from "@/components/ProductImage";

interface PackGridCardProps {
  pack: Product;
  isActive: boolean;
  onChoose: () => void;
}

export default function PackGridCard({
  pack,
  isActive,
  onChoose,
}: PackGridCardProps) {
  return (
    <article
      className={`group flex flex-col bg-mang-cream-light border-2 rounded-2xl overflow-hidden shadow-[3px_3px_0_rgba(61,36,23,0.12)] h-full transition-colors ${
        isActive
          ? "border-mang-orange ring-2 ring-mang-orange/30"
          : "border-mang-brown"
      }`}
    >
      <div className="relative w-full h-[180px] sm:h-[220px] overflow-hidden bg-mang-cream">
        <ProductImage
          src={pack.image}
          alt={pack.name}
          fallback={getProductPlaceholder(pack)}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {pack.badge && (
          <span className="absolute top-3 left-3 z-[1] bg-mang-orange-bright text-mang-brown text-xs font-extrabold px-3 py-1.5 rounded-full uppercase border border-mang-brown">
            {pack.badge}
          </span>
        )}
      </div>

      <div className="relative z-[1] flex flex-col flex-1 min-w-0 p-4 sm:p-5 lg:p-6 gap-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
          <h3 className="menu-product-title text-lg sm:text-xl lg:text-2xl text-mang-brown uppercase tracking-wide leading-snug">
            {pack.name}
          </h3>
          <p className="font-bold text-mang-brown text-base sm:text-lg shrink-0">
            from ${pack.price.toFixed(2)}
          </p>
        </div>
        <p className="text-mang-brown-mid text-xs sm:text-[13px] leading-relaxed flex-1 line-clamp-3">
          {pack.description}
        </p>
        <Button
          type="button"
          variant="yellow"
          pop
          fullWidth
          className="min-h-11 text-xs sm:text-sm mt-auto"
          onClick={onChoose}
        >
          Choose Flavours
        </Button>
      </div>
    </article>
  );
}
