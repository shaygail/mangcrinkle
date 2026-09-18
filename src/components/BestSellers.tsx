"use client";

import { getBestSellers } from "@/data/products";
import { useProducts } from "@/context/ProductsContext";
import ProductCard from "@/components/ProductCard";
import Button from "@/components/Button";
import AddedToCartDialog from "@/components/AddedToCartDialog";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

interface BestSellersProps {
  title?: string;
  eyebrow?: string;
  subtitle?: string;
}

export default function BestSellers({
  title = "Fan Favourites",
  eyebrow = "Craving Starts Here",
  subtitle = "Freshly baked, fudgy, and ready to order — browse our most-loved crinkles, packs, and drinks.",
}: BestSellersProps) {
  const { products } = useProducts();
  const { openCart } = useCart();
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const bestSellers = getBestSellers(products);

  if (bestSellers.length === 0) return null;

  // Mobile Figma (32:28) shows 4 in a 2×2; desktop shows up to 6
  const mobileFour = bestSellers.slice(0, 4);
  const desktopSix = bestSellers.slice(0, 6);

  return (
    <section className="py-10 sm:py-14 lg:py-[72px] bg-mang-cream-light">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-20">
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-mang-brown-mid mb-1.5">
            {eyebrow}
          </p>
          <h2 className="menu-title-3d text-4xl lg:text-5xl mb-2 leading-tight">
            {title}
          </h2>
          <p className="hidden sm:block text-mang-brown-mid text-base italic max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Mobile 2×2 */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden mb-6">
          {mobileFour.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              compact
              onAdded={(name) => setAddedItem(name)}
            />
          ))}
        </div>

        {/* Desktop / tablet grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 mb-8">
          {desktopSix.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              compact
              onAdded={(name) => setAddedItem(name)}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            href="/shop"
            variant="outline-dark"
            pop
            fullWidth
            className="sm:w-auto sm:min-w-[280px]"
          >
            Explore the Full Shop →
          </Button>
        </div>
      </div>

      <AddedToCartDialog
        open={addedItem !== null}
        itemName={addedItem ?? ""}
        onClose={() => setAddedItem(null)}
        onViewCart={() => {
          setAddedItem(null);
          openCart();
        }}
      />
    </section>
  );
}
