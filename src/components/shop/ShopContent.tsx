"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  shopFilters,
  getProductsForSection,
  getProductsForFilter,
  getFeaturedShopProducts,
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

/** Filters shown on mobile to match Figma 32:167 */
const PRIMARY_FILTERS: ShopFilter[] = ["all", "crinkles", "packs", "lava"];

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

  const flatProducts = useMemo(() => {
    if (activeFilter === "all") {
      return getFeaturedShopProducts(products);
    }
    return getProductsForFilter(products, activeFilter);
  }, [products, activeFilter]);

  const mobileFilters = shopFilters.filter((f) =>
    PRIMARY_FILTERS.includes(f.id)
  );
  const desktopFilters = [
    ...shopFilters.filter((f) => PRIMARY_FILTERS.includes(f.id)),
    ...shopFilters.filter((f) => !PRIMARY_FILTERS.includes(f.id)),
  ];

  return (
    <div className="bg-mang-cream-light min-h-screen">
      {/* Shop header — Figma 32:177 */}
      <section className="bg-mang-cream border-y border-mang-tan pt-8 pb-4 sm:pt-10 lg:py-14 px-5 text-center">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-mang-brown-mid mb-2">
          {content.subtitle}
        </p>
        <h1 className="menu-logo text-[42px] sm:text-5xl lg:text-[64px] leading-none mb-2">
          {content.title}
        </h1>
        <p className="text-mang-brown-mid text-[13px] lg:text-base italic max-w-md lg:max-w-2xl mx-auto leading-relaxed">
          {content.description}
        </p>
      </section>

      {/* Category filters */}
      <section className="sticky top-14 sm:top-16 lg:top-[73px] z-30 bg-mang-cream-light/95 backdrop-blur-sm border-b border-mang-tan py-3.5 px-4">
        <div className="lg:hidden flex gap-2 items-center overflow-x-auto scrollbar-none">
          {mobileFilters.map((filter) => (
            <Link
              key={filter.id}
              href={
                filter.id === "all" ? "/shop" : `/shop?category=${filter.id}`
              }
              scroll={false}
              className={`inline-flex items-center min-h-11 px-3.5 py-2.5 rounded-full text-[12px] uppercase tracking-wide whitespace-nowrap transition-colors ${
                activeFilter === filter.id
                  ? "bg-mang-cream border-2 border-mang-brown text-mang-brown font-extrabold"
                  : "bg-white border border-gray-200 text-mang-brown-mid font-bold"
              }`}
            >
              {filter.id === "lava" ? "Lava" : filter.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex max-w-7xl mx-auto gap-2 items-center overflow-x-auto">
          <span className="text-[13px] font-extrabold uppercase tracking-wide text-mang-brown-mid shrink-0 mr-1">
            Filter by:
          </span>
          {desktopFilters.map((filter) => (
            <Link
              key={filter.id}
              href={
                filter.id === "all" ? "/shop" : `/shop?category=${filter.id}`
              }
              scroll={false}
              className={`inline-flex items-center min-h-11 px-4 py-2.5 rounded-full text-[12px] font-extrabold uppercase tracking-wide whitespace-nowrap transition-colors ${
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

      {/* Mobile: full-width stacked cards (Figma 32:190) */}
      <div className="lg:hidden px-4 pt-2 pb-8 space-y-6">
        {flatProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            shopMobile
            onAdded={(name) => setAddedItem(name)}
          />
        ))}
        {flatProducts.length === 0 && (
          <p className="text-center text-sm text-mang-brown-mid py-10">
            No products in this category yet.
          </p>
        )}
      </div>

      {/* Desktop: sectioned grids */}
      <div className="hidden lg:block max-w-7xl mx-auto px-5 sm:px-8 lg:px-20 py-10 lg:py-14 space-y-14 lg:space-y-20">
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

      {/* How to order — Figma 34:478 */}
      <section className="bg-mang-cream border-y border-mang-tan px-6 py-8 text-center">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.15em] text-mang-brown-mid mb-1.5">
          {content.howToOrderEyebrow}
        </p>
        <h2 className="menu-title-3d text-[36px] leading-none mb-1.5">
          {content.howToOrderTitle}
        </h2>
        <p className="text-[13px] italic text-mang-brown-mid">
          {content.howToOrderBody}
        </p>
        <Link
          href={content.howToOrderLinkHref}
          className="hidden lg:inline-flex mt-5 min-h-11 items-center text-sm font-bold text-mang-brown underline underline-offset-4"
        >
          {content.howToOrderLinkText}
        </Link>
      </section>

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
