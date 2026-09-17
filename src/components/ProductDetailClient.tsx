"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { getProductById } from "@/data/products";
import { getProductPlaceholder } from "@/lib/images";
import { isDrink, isPack } from "@/lib/cart";
import ProductImage from "@/components/ProductImage";
import Button from "@/components/Button";
import ProductAddModal from "@/components/ProductAddModal";

interface ProductDetailClientProps {
  productId: string;
}

type PackChoice = "single" | "pack-6" | "pack-12";

export default function ProductDetailClient({
  productId,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { products } = useProducts();
  const { addItem } = useCart();
  const product = getProductById(products, productId);

  const pack6 = getProductById(products, "pack-6");
  const pack12 = getProductById(products, "pack-12");

  const [quantity, setQuantity] = useState(1);
  const [packChoice, setPackChoice] = useState<PackChoice>("single");
  const [modalOpen, setModalOpen] = useState(false);

  const selected = useMemo(() => {
    if (packChoice === "pack-6" && pack6) return pack6;
    if (packChoice === "pack-12" && pack12) return pack12;
    return product;
  }, [packChoice, pack6, pack12, product]);

  if (!product) {
    notFound();
  }

  const drink = isDrink(product);
  const pack = isPack(product);
  const showPackOptions = !drink && !pack;
  const unitPrice = selected?.price ?? product.price;
  const lineTotal = unitPrice * quantity;

  const handleAdd = () => {
    if (!selected) return;
    if (isPack(selected) || pack) {
      router.push("/shop?category=packs");
      return;
    }
    if (drink) {
      setModalOpen(true);
      return;
    }
    addItem(selected, quantity, { openCart: true });
  };

  const imageSrc =
    product.id === "ube"
      ? product.image || "/images/figma/signature-ube.jpg"
      : product.image;

  const ctaLabel = (() => {
    if (pack || (selected && isPack(selected))) return "🍪 Choose Flavours";
    if (drink) return "🍪 Choose Options";
    return `🍪 Add to Box • $${lineTotal.toFixed(2)}`;
  })();

  return (
    <div className="bg-mang-cream-light min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-20 py-10 lg:py-16">
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center text-sm font-bold text-mang-brown-mid hover:text-mang-brown mb-6"
        >
          ← Back to shop
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          <div className="w-full lg:w-[600px] shrink-0 space-y-4">
            <div className="relative aspect-[600/440] w-full rounded-3xl overflow-hidden border-[3px] border-mang-brown shadow-[3px_3px_0_rgba(61,36,23,0.12)]">
              <ProductImage
                src={imageSrc}
                alt={product.name}
                fallback={
                  product.id === "ube"
                    ? "/images/figma/signature-ube.jpg"
                    : getProductPlaceholder(product)
                }
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 600px"
              />
              {(product.badge || product.id === "ube") && (
                <span className="absolute top-5 left-5 bg-mang-orange-bright border-2 border-mang-brown text-[12px] font-extrabold px-4 py-2 rounded-full uppercase text-mang-brown">
                  ⭐ {product.badge || "Most Popular"}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="inline-flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-full border-[1.5px] border-mang-brown bg-mang-cream px-4 py-2.5 text-[12px] font-bold text-mang-brown">
                💜 Soft &amp; Fudgy
              </span>
              <span className="inline-flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-full border-[1.5px] border-mang-brown bg-mang-cream px-4 py-2.5 text-[12px] font-bold text-mang-brown">
                🍯 Handcrafted Daily
              </span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-6 min-w-0">
            <div className="bg-mang-cream border-2 border-mang-brown rounded-[20px] p-6 sm:p-7 shadow-[3px_3px_0_rgba(61,36,23,0.12)] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <h1 className="menu-title-3d text-3xl sm:text-4xl lg:text-[44px] leading-none uppercase">
                  {product.name}
                </h1>
                <p className="font-extrabold text-2xl sm:text-[28px] text-mang-brown shrink-0">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-mang-brown text-mang-cream text-[11px] font-extrabold uppercase px-2 py-0.5 rounded">
                  {pack
                    ? "Custom Pack"
                    : drink
                      ? "Drink"
                      : "Per Individual Piece"}
                </span>
              </div>
              <p className="text-[15px] text-mang-brown-mid leading-relaxed">
                {product.description}
              </p>
            </div>

            {showPackOptions && (pack6 || pack12) && (
              <div className="space-y-3">
                <h2 className="menu-title-3d text-2xl">Select Your Pack Size</h2>
                <div className="space-y-2.5">
                  <PackOption
                    selected={packChoice === "single"}
                    title="Single Crinkle Treat"
                    description="Just a sweet bite of cookie magic"
                    price={product.price}
                    onSelect={() => setPackChoice("single")}
                  />
                  {pack6 && (
                    <PackOption
                      selected={packChoice === "pack-6"}
                      title="Assorted 6-Pack Box"
                      description="Perfect for sharing (mix & match in your box)"
                      price={pack6.price}
                      badge="Recommended Value"
                      onSelect={() => setPackChoice("pack-6")}
                    />
                  )}
                  {pack12 && (
                    <PackOption
                      selected={packChoice === "pack-12"}
                      title="Craver's 12-Pack Party Box"
                      description="Ultimate cookie feast for the squad"
                      price={pack12.price}
                      onSelect={() => setPackChoice("pack-12")}
                    />
                  )}
                </div>
              </div>
            )}

            <div className="bg-mang-tan border-[1.5px] border-mang-brown rounded-xl p-4 space-y-1">
              <p className="text-[12px] font-extrabold text-mang-brown">
                📢 Baker&apos;s Ingredients &amp; Allergens Note
              </p>
              <p className="text-[12px] text-mang-brown-mid leading-relaxed">
                Our handcrafted artisanal crinkles contain wheat flour, eggs,
                dairy, and premium flavourings. Baked daily in a kitchen that
                handles tree nuts. Warm for ~10 seconds for melt-in-your-mouth
                bliss.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center pt-2">
              {packChoice === "single" && !drink && !pack && (
                <div className="inline-flex items-center gap-5 rounded-full border-2 border-mang-brown bg-mang-cream-light px-5 py-3 font-extrabold self-start">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="min-h-8 min-w-8 text-xl text-mang-brown-mid"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="min-w-6 text-center text-mang-brown">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="min-h-8 min-w-8 text-xl text-mang-brown-mid"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              )}

              <Button
                type="button"
                variant="yellow"
                pop
                fullWidth
                className="sm:flex-1"
                onClick={handleAdd}
              >
                {ctaLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && drink && (
        <ProductAddModal
          product={product}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

function PackOption({
  selected,
  title,
  description,
  price,
  badge,
  onSelect,
}: {
  selected: boolean;
  title: string;
  description: string;
  price: number;
  badge?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center justify-between gap-3 p-4 rounded-xl text-left transition-colors ${
        selected
          ? "bg-mang-cream border-[3px] border-mang-brown shadow-[3px_3px_0_rgba(61,36,23,0.12)]"
          : "bg-mang-cream-light border-2 border-mang-brown"
      }`}
    >
      <span className="flex items-center gap-3 min-w-0">
        <span
          className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-mang-brown ${
            selected ? "bg-mang-brown" : ""
          }`}
          aria-hidden
        >
          {selected && (
            <span className="size-1.5 rounded-full bg-mang-cream" />
          )}
        </span>
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sm text-mang-brown">{title}</span>
            {badge && (
              <span className="bg-mang-orange-bright text-[10px] font-extrabold uppercase px-2 py-0.5 rounded text-mang-brown">
                {badge}
              </span>
            )}
          </span>
          <span className="block text-xs text-mang-brown-mid mt-0.5">
            {description}
          </span>
        </span>
      </span>
      <span className="font-bold text-sm text-mang-brown shrink-0">
        ${price.toFixed(2)}
      </span>
    </button>
  );
}
