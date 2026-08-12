"use client";

import { Product } from "@/types";
import { isDrink } from "@/lib/cart";
import { getProductPlaceholder } from "@/lib/images";
import { useCart } from "@/context/CartContext";
import ProductImage from "@/components/ProductImage";
import Button from "@/components/Button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <article className="group flex flex-col bg-mang-tan border-2 border-mang-brown rounded-2xl overflow-hidden shadow-[3px_3px_0_rgba(74,44,26,0.2)]">
      <div className="relative aspect-square overflow-hidden bg-mang-cream">
        <ProductImage
          src={product.image}
          alt={product.name}
          fallback={getProductPlaceholder(product)}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-mang-orange text-mang-brown text-xs font-bold px-3 py-1 rounded-full uppercase border border-mang-brown">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        {product.tier && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-mang-brown/60 mb-1">
            {product.tier}
          </p>
        )}
        <h3 className="menu-product-title text-sm lg:text-base mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="menu-body-text text-xs mb-3 flex-1 opacity-90 line-clamp-3 sm:line-clamp-none">
          {product.description}
          {isDrink(product) && (
            <span className="block mt-1 text-mang-brown/50">
              Whole milk included. Swap to oat, soy, coconut, or almond in your
              cart (+$1.00).
            </span>
          )}
        </p>
        {product.note && (
          <p className="text-[11px] text-mang-brown/80 bg-mang-brown/10 rounded-lg px-2 py-1 mb-3">
            {product.note}
          </p>
        )}
        <p className="menu-price text-xl mb-3">
          ${product.price.toFixed(2)}
        </p>
        <Button
          variant="brown"
          pop
          fullWidth
          onClick={() => addItem(product)}
        >
          Add to Cart
        </Button>
      </div>
    </article>
  );
}
