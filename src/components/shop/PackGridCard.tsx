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
      className={`group flex flex-row sm:flex-col items-stretch bg-mang-tan border-2 rounded-2xl overflow-hidden shadow-[3px_3px_0_rgba(74,44,26,0.2)] transition-colors ${
        isActive
          ? "border-mang-orange ring-2 ring-mang-orange/30"
          : "border-mang-brown"
      }`}
    >
      <div className="relative w-[7.75rem] sm:w-full shrink-0 self-stretch sm:self-auto sm:aspect-[4/3] md:aspect-square overflow-hidden bg-mang-cream">
        <ProductImage
          src={pack.image}
          alt={pack.name}
          fallback={getProductPlaceholder(pack)}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 124px, (max-width: 1024px) 50vw, 25vw"
        />
        {pack.badge && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-[1] bg-mang-orange text-mang-brown text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase border border-mang-brown">
            {pack.badge}
          </span>
        )}
      </div>

      <div className="relative z-[1] flex flex-col flex-1 min-w-0 p-3 sm:p-4 bg-mang-tan">
        <h3 className="font-bold text-mang-brown text-sm sm:text-base leading-snug mb-1 line-clamp-2">
          {pack.name}
        </h3>
        <p className="text-mang-brown/70 text-xs leading-relaxed mb-2 sm:mb-3 flex-1 line-clamp-2 sm:line-clamp-none">
          {pack.description}
          <span className="hidden sm:block mt-1 text-mang-brown/50">
            Premium +$0.50 · Signature +$1.00 per crinkle
          </span>
        </p>
        <div className="mt-auto flex flex-col gap-2 sm:gap-3">
          <p className="font-bold text-mang-brown text-lg">
            from ${pack.price.toFixed(2)}
          </p>
          <Button
            type="button"
            variant="brown"
            pop
            fullWidth
            className="min-h-11 text-xs sm:text-sm relative z-[1]"
            onClick={onChoose}
          >
            Choose Flavours
          </Button>
        </div>
      </div>
    </article>
  );
}
