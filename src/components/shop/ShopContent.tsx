"use client";

import { useState } from "react";
import Link from "next/link";
import {
  shopFilters,
  getProductsForSection,
  ShopFilter,
  shopSections,
} from "@/data/products";
import { ShopPageContent } from "@/data/shop-page";
import ProductCard from "@/components/ProductCard";
import PackSection from "@/components/shop/PackSection";
import AddedToCartDialog from "@/components/AddedToCartDialog";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";

type ShopSection = (typeof shopSections)[number];

interface ShopContentProps {
  content: ShopPageContent;
  sections: ShopSection[];
  activeFilter?: ShopFilter;
}

export default function ShopContent({
  content,
  sections,
  activeFilter = "all",
}: ShopContentProps) {
  const { products } = useProducts();
  const { openCart } = useCart();
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const visibleSections =
    activeFilter === "all"
      ? sections
      : sections.filter((s) => s.filter === activeFilter);

  return (
    <div className="bg-mang-cream-light min-h-screen">
      <section className="bg-mang-cream border-b border-mang-tan py-10 sm:py-12 lg:py-14 px-5 text-center">
        <p className="text-[12px] sm:text-[13px] font-extrabold uppercase tracking-[0.15em] text-mang-brown-mid mb-2">
          {content.subtitle}
        </p>
        <h1 className="menu-logo text-4xl sm:text-5xl lg:text-[64px] leading-none mb-3">
          {content.title}
        </h1>
        <p className="text-mang-brown-mid text-sm sm:text-base italic max-w-2xl mx-auto leading-relaxed">
          {content.description}
        </p>
      </section>

      <section className="sticky top-14 sm:top-16 lg:top-[73px] z-30 bg-mang-cream-light/95 backdrop-blur-sm border-b border-mang-tan py-4 px-5">
        <div className="max-w-7xl mx-auto flex gap-2 sm:gap-3 items-center overflow-x-auto">
          <span className="hidden sm:inline text-[13px] font-extrabold uppercase tracking-wide text-mang-brown-mid shrink-0">
            Filter by:
          </span>
          {shopFilters.map((filter) => (
            <Link
              key={filter.id}
              href={
                filter.id === "all" ? "/shop" : `/shop?category=${filter.id}`
              }
              scroll={false}
              className={`inline-flex items-center min-h-11 px-4 py-2.5 rounded-full text-[11px] sm:text-xs font-extrabold uppercase tracking-wider whitespace-nowrap border transition-colors ${
                activeFilter === filter.id
                  ? "bg-mang-cream border-2 border-mang-brown text-mang-brown"
                  : "bg-white border border-gray-200 text-mang-brown-mid hover:border-mang-brown/40"
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-20 py-10 lg:py-14 space-y-14 lg:space-y-20">
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
                <p className="text-mang-brown-mid text-sm lg:text-base italic">
                  {section.subtitle}
                </p>
              </div>

              {section.id === "packs" ? (
                <PackSection
                  packs={sectionProducts}
                  onAdded={(name) => setAddedItem(name)}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {sectionProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAdded={(name) => setAddedItem(name)}
                    />
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
