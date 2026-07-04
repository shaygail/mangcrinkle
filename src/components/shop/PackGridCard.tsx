"use client";

import Image from "next/image";
import { Product } from "@/types";
import Button from "@/components/Button";

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
      className={`group flex flex-col bg-mang-tan border-2 rounded-2xl overflow-hidden shadow-[3px_3px_0_rgba(74,44,26,0.2)] transition-colors ${
        isActive
          ? "border-mang-orange ring-2 ring-mang-orange/30"
          : "border-mang-brown"
      }`}
    >
      <button
        type="button"
        onClick={onChoose}
        className="relative aspect-square overflow-hidden bg-mang-cream w-full cursor-pointer"
        aria-expanded={isActive}
      >
        <Image
          src={pack.image}
          alt={pack.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {pack.badge && (
          <span className="absolute top-3 left-3 bg-mang-orange text-mang-brown text-xs font-bold px-3 py-1 rounded-full uppercase border border-mang-brown">
            {pack.badge}
          </span>
        )}
      </button>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-mang-brown text-sm lg:text-base leading-tight mb-1">
          {pack.name}
        </h3>
        <p className="text-mang-brown/70 text-xs leading-relaxed mb-3 flex-1">
          {pack.description}
          <span className="block mt-1 text-mang-brown/50">
            Premium +$0.50 · Signature +$1.00 per crinkle
          </span>
        </p>
        <p className="font-bold text-mang-brown text-lg mb-3">
          from ${pack.price.toFixed(2)}
        </p>
        <Button variant="brown" pop fullWidth onClick={onChoose}>
          {isActive ? "Hide Flavours" : "Choose Flavours"}
        </Button>
      </div>
    </article>
  );
}
