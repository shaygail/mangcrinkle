"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import {
  shopFilters,
  shopSections,
  getProductsForSection,
  ShopFilter,
} from "@/data/products";
import ProductCard from "@/components/ProductCard";
import PackSection from "@/components/shop/PackSection";
import AddedToCartDialog from "@/components/AddedToCartDialog";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";

function ShopContent() {
  const searchParams = useSearchParams();
  const activeFilter = (searchParams.get("category") as ShopFilter) || "all";
  const { products } = useProducts();
  const { openCart } = useCart();
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const visibleSections =
    activeFilter === "all"
      ? shopSections
      : shopSections.filter((s) => s.filter === activeFilter);

  return (
    <div className="bg-mang-cream min-h-screen">
      {/* Header */}
      <section className="py-12 lg:py-16 px-4 text-center border-b-2 border-mang-brown/20">
        <h1 className="menu-logo text-5xl sm:text-6xl lg:text-7xl leading-none mb-2">
          Mang Crinkle
        </h1>
        <p className="menu-logo-sub text-xl sm:text-2xl mb-4">made to crave</p>
        <p className="text-mang-brown text-xs sm:text-sm font-bold uppercase tracking-widest max-w-lg mx-auto">
          Pick your crinkles, packs, drinks &amp; extras — add each item to your
          cart individually.
        </p>
      </section>

      {/* Category filters */}
      <section className="sticky top-16 lg:top-20 z-30 bg-mang-cream/95 backdrop-blur-sm border-b border-mang-brown/20 py-4 px-4">
        <div className="max-w-6xl mx-auto flex gap-2 justify-start sm:justify-center flex-wrap overflow-x-auto">
          {shopFilters.map((filter) => (
            <Link
              key={filter.id}
              href={filter.id === "all" ? "/shop" : `/shop?category=${filter.id}`}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap border-2 transition-colors ${
                activeFilter === filter.id
                  ? "bg-mang-brown text-mang-cream border-mang-brown"
                  : "bg-mang-tan text-mang-brown border-mang-brown/30 hover:border-mang-brown"
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Product sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14 space-y-14 lg:space-y-20">
        {visibleSections.map((section) => {
          const sectionProducts = getProductsForSection(
            products,
            section.categories
          );
          if (sectionProducts.length === 0) return null;

          return (
            <section key={section.id} id={section.id}>
              <div className="mb-6 lg:mb-8">
                <h2 className="menu-title-3d text-3xl lg:text-4xl mb-2">
                  {section.title}
                </h2>
                <p className="text-mang-brown/80 text-sm lg:text-base font-serif italic">
                  {section.subtitle}
                </p>
              </div>

              {section.id === "packs" ? (
                <PackSection
                  packs={sectionProducts}
                  onAdded={(name) => setAddedItem(name)}
                />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                  {sectionProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
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
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center bg-mang-cream">
          <p className="text-mang-brown/60">Loading menu...</p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
