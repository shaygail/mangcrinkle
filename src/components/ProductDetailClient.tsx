"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { getProductById } from "@/data/products";
import { getProductPlaceholder } from "@/lib/images";
import {
  createEmptyPackSelections,
  getPackSize,
  isDrink,
  isPack,
  isPackSelectionsComplete,
} from "@/lib/cart";
import ProductImage from "@/components/ProductImage";
import Button from "@/components/Button";
import ProductAddModal from "@/components/ProductAddModal";
import { PackFlavourPicker } from "@/components/shop/PackFlavourPicker";

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
  const [packChoice, setPackChoice] = useState<PackChoice>(
    pack6 ? "pack-6" : "single"
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [packSelections, setPackSelections] = useState<string[]>([]);

  const selected = useMemo(() => {
    if (packChoice === "pack-6" && pack6) return pack6;
    if (packChoice === "pack-12" && pack12) return pack12;
    return product;
  }, [packChoice, pack6, pack12, product]);

  useEffect(() => {
    if (!selected || !isPack(selected)) {
      setPackSelections([]);
      return;
    }
    const size = getPackSize(selected);
    // Pre-fill every slot with the current flavour (Figma mobile has no mixer)
    setPackSelections(
      Array.from({ length: size }, () => (product ? product.id : ""))
    );
  }, [selected, product]);

  if (!product) {
    notFound();
  }

  const drink = isDrink(product);
  const packProduct = isPack(product);
  const showPackOptions = !drink && !packProduct;
  const selectingPack = showPackOptions && packChoice !== "single";
  const unitPrice = selected?.price ?? product.price;
  const lineTotal = unitPrice * quantity;
  const packComplete =
    !selectingPack ||
    !selected ||
    !isPack(selected) ||
    isPackSelectionsComplete(
      products,
      packSelections,
      getPackSize(selected)
    );

  const handleAdd = () => {
    if (!selected) return;

    if (packProduct) {
      router.push("/shop?category=packs");
      return;
    }

    if (drink) {
      setModalOpen(true);
      return;
    }

    if (selectingPack && isPack(selected)) {
      if (!packComplete) return;
      addItem(selected, quantity, {
        packSelections,
        openCart: true,
      });
      return;
    }

    addItem(product, quantity, { openCart: true });
  };

  const imageSrc =
    product.id === "ube"
      ? product.image || "/images/figma/signature-ube.jpg"
      : product.image;

  const isUbe = product.id === "ube";
  const displayName = isUbe ? "Signature Ube Crinkle" : product.name;

  const highlightBadgesDesktop = isUbe
    ? [
        { emoji: "💜", label: "Real Purple Yam (Ube)" },
        { emoji: "🍯", label: "Soft Fudgy Core" },
      ]
    : [
        { emoji: "💜", label: "Soft & Fudgy" },
        { emoji: "🍯", label: "Handcrafted Daily" },
      ];

  const highlightBadgesMobile = isUbe
    ? [
        { emoji: "💜", label: "Real Purple Yam" },
        { emoji: "🍯", label: "Gooey Fudge Core" },
      ]
    : highlightBadgesDesktop;

  const mobileDescription = isUbe
    ? "Experience sweet purple yam magic. Our signature vibrant Ube crinkle is carefully handcrafted, soft-centred, incredibly rich, and dusted beautifully in snowy sweet sugar."
    : product.description;

  const ctaLabel = (() => {
    if (drink) return "Choose Options";
    if (packProduct) return "Choose Flavours";
    if (selectingPack && !packComplete) return "Choose Flavours First";
    return `Add to Box • $${lineTotal.toFixed(2)}`;
  })();

  const canAdd =
    !drink && !packProduct && (!selectingPack || packComplete);

  const quantityStepper = (
    <div className="inline-flex items-center gap-4 rounded-full border-2 border-mang-brown bg-mang-cream-light px-3.5 py-2 font-extrabold shrink-0">
      <button
        type="button"
        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        className="min-h-8 min-w-8 text-lg text-mang-brown-mid"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="min-w-4 text-center text-mang-brown text-base">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => setQuantity((q) => q + 1)}
        className="min-h-8 min-w-8 text-lg text-mang-brown-mid"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );

  return (
    <div className="bg-mang-cream-light min-h-screen pb-28 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 pt-3 pb-8 lg:py-16">
        {/* Desktop back only — mobile uses Header PDP chrome (Figma 32:296) */}
        <Link
          href="/shop"
          className="hidden lg:inline-flex min-h-11 items-center text-sm font-bold text-mang-brown-mid hover:text-mang-brown mb-6"
        >
          ← Back to shop
        </Link>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start">
          {/* Media */}
          <div className="w-full lg:w-[600px] shrink-0 space-y-4">
            <div className="relative w-full h-[320px] lg:h-auto lg:aspect-[600/440] rounded-3xl overflow-hidden border-[3px] border-mang-brown shadow-[4px_4px_0_rgba(61,36,24,0.17)]">
              <ProductImage
                src={imageSrc}
                alt={displayName}
                fallback={
                  isUbe
                    ? "/images/figma/signature-ube.jpg"
                    : getProductPlaceholder(product)
                }
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 600px"
              />
              {(product.badge || isUbe) && (
                <span className="absolute top-[13px] left-[13px] bg-mang-orange-bright border-[1.5px] border-mang-brown text-[12px] font-extrabold px-3 py-1.5 rounded-full uppercase text-mang-brown">
                  ⭐ {isUbe ? "Most Popular" : product.badge}
                </span>
              )}
            </div>

            <div className="hidden lg:flex flex-wrap gap-3">
              {highlightBadgesDesktop.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-full border-[1.5px] border-mang-brown bg-mang-cream px-4 py-2.5 text-[12px] font-bold text-mang-brown"
                >
                  {b.emoji} {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Config */}
          <div className="flex-1 w-full space-y-6 min-w-0">
            {/* Product header panel */}
            <div className="bg-mang-cream border-2 border-mang-brown rounded-[20px] p-5 lg:p-7 shadow-[3px_3px_0_rgba(61,36,23,0.12)] space-y-3">
              <h1 className="menu-title-3d text-[36px] lg:text-[44px] leading-none uppercase">
                {displayName}
              </h1>

              {/* Mobile price row — Figma */}
              <div className="flex lg:hidden items-center gap-2">
                <p className="font-extrabold text-2xl text-mang-brown">
                  ${product.price.toFixed(2)}
                </p>
                <span className="bg-mang-brown text-mang-cream text-[12px] font-bold uppercase px-2 py-0.5 rounded">
                  {packProduct ? "Custom Pack" : drink ? "Drink" : "Per Piece"}
                </span>
              </div>

              {/* Desktop title/price row extras */}
              <div className="hidden lg:flex flex-wrap items-center gap-2">
                <p className="font-extrabold text-[28px] text-mang-brown">
                  ${product.price.toFixed(2)}
                </p>
                <span className="bg-mang-brown text-mang-cream text-[12px] font-extrabold uppercase px-2 py-0.5 rounded">
                  {packProduct
                    ? "Custom Pack"
                    : drink
                      ? "Drink"
                      : "Per Individual Piece"}
                </span>
                {showPackOptions && (
                  <span className="text-[13px] text-mang-brown-mid">
                    • Order single cookies or select best-value pack boxes below
                  </span>
                )}
              </div>

              <p className="text-sm lg:text-[15px] text-mang-brown-mid leading-5 lg:leading-relaxed">
                <span className="lg:hidden">{mobileDescription}</span>
                <span className="hidden lg:inline">{product.description}</span>
              </p>
            </div>

            {showPackOptions && (pack6 || pack12) && (
              <div className="space-y-3">
                <h2 className="menu-title-3d text-[22px] lg:text-2xl">
                  Select Your Pack Size
                </h2>
                <div className="space-y-2.5">
                  <PackOption
                    selected={packChoice === "single"}
                    title="Single Crinkle"
                    description={
                      isUbe
                        ? "Just a taste of sweet ube magic"
                        : "Just a sweet bite of cookie magic"
                    }
                    price={product.price}
                    onSelect={() => setPackChoice("single")}
                  />
                  {pack6 && (
                    <PackOption
                      selected={packChoice === "pack-6"}
                      title="Assorted 6-Pack Box"
                      description="Perfect for sharing (or personal pure bliss)"
                      price={pack6.price}
                      badge="Best Value"
                      onSelect={() => setPackChoice("pack-6")}
                    />
                  )}
                  {pack12 && (
                    <PackOption
                      selected={packChoice === "pack-12"}
                      title="Craver's 12-Pack Party Box"
                      description="Ultimate crinkle feast for the squad"
                      price={pack12.price}
                      onSelect={() => setPackChoice("pack-12")}
                    />
                  )}
                </div>

                {/* Desktop only: flavour mixer */}
                {selectingPack && selected && isPack(selected) && (
                  <div className="hidden lg:block mt-2 p-4 bg-mang-tan/50 rounded-xl border border-mang-brown/20">
                    <p className="text-[11px] font-extrabold uppercase tracking-wide text-mang-brown-mid mb-3">
                      Mix your flavours
                    </p>
                    <PackFlavourPicker
                      pack={selected}
                      selections={
                        packSelections.length
                          ? packSelections
                          : createEmptyPackSelections(selected)
                      }
                      onChange={setPackSelections}
                      namePrefix={`pdp-${product.id}`}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Mobile flavour highlights */}
            <div className="flex lg:hidden gap-2">
              {highlightBadgesMobile.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border-[1.5px] border-mang-brown bg-mang-cream px-3 py-2 text-[12px] font-bold text-mang-brown"
                >
                  {b.emoji} {b.label}
                </span>
              ))}
            </div>

            <div className="bg-mang-tan border-2 border-mang-brown rounded-2xl p-4 space-y-2.5">
              <p className="text-[13px] font-bold text-mang-brown">
                📢 Baker&apos;s Note: Ingredients &amp; Allergens
              </p>
              <p className="text-xs text-mang-brown-mid leading-[18px]">
                {isUbe
                  ? "Our artisanal crinkles contain wheat, dairy, and fresh purple yam (Ube). Baked daily in a kitchen handling tree nuts. Best consumed within 3 days or warmed up for 10 seconds for standard lava-core bliss!"
                  : "Our handcrafted artisanal crinkles contain wheat flour, eggs, dairy, and premium flavourings. Baked daily in a kitchen that handles tree nuts. Warm for ~10 seconds for melt-in-your-mouth bliss."}
              </p>
            </div>

            {/* Desktop action row */}
            <div className="hidden lg:flex flex-row gap-4 items-center pt-3">
              {!drink && !packProduct && (
                <div className="inline-flex items-center gap-5 rounded-full border-2 border-mang-brown bg-mang-cream-light px-[18px] py-3 font-extrabold self-start">
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
                className="flex-1"
                onClick={handleAdd}
                disabled={!canAdd && !drink && !packProduct}
              >
                🍪 {ctaLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA — Figma 32:296 */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-mang-cream border-t-2 border-mang-brown px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3 max-w-lg mx-auto w-full">
          {!drink && !packProduct && quantityStepper}
          <Button
            type="button"
            variant="yellow"
            pop
            fullWidth
            className="!text-[13px] min-w-0 flex-1"
            onClick={handleAdd}
            disabled={!canAdd && !drink && !packProduct}
          >
            + {ctaLabel}
          </Button>
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
          ? "bg-mang-cream border-[3px] border-mang-brown shadow-[2px_2px_0_rgba(61,36,23,0.12)]"
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
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-[15px] text-mang-brown">
              {title}
            </span>
            {badge && (
              <span className="bg-mang-orange-bright text-[12px] font-extrabold uppercase px-1.5 py-0.5 rounded text-mang-brown">
                {badge}
              </span>
            )}
          </span>
          <span className="block text-xs text-mang-brown-mid mt-0.5">
            {description}
          </span>
        </span>
      </span>
      <span className="font-bold text-[15px] text-mang-brown shrink-0">
        ${price.toFixed(2)}
      </span>
    </button>
  );
}
