"use client";

import { useState } from "react";
import Image from "next/image";
import { bestSellers } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Button from "@/components/Button";

export default function BestSellers() {
  const [current, setCurrent] = useState(0);
  const { addItem } = useCart();
  const product = bestSellers[current];

  return (
    <section className="py-16 lg:py-24 bg-mang-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="menu-title-3d text-4xl lg:text-5xl text-center mb-12">
          Fan Favourites
        </h2>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="relative aspect-square max-w-lg mx-auto w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-2xl border-2 border-mang-brown shadow-[4px_4px_0_rgba(61,36,24,0.15)]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="text-center lg:text-left">
            <h3 className="menu-title-3d text-3xl lg:text-4xl mb-4">
              {product.name}
            </h3>
            <p className="text-mang-brown-mid text-lg mb-2 italic font-serif">
              {product.description}
            </p>
            <p className="text-mang-orange font-bold text-2xl mb-6">
              ${product.price.toFixed(2)}
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Button variant="brown" pop onClick={() => addItem(product)}>
                Add to Cart
              </Button>
              <Button href="/shop" variant="cream">
                View Menu
              </Button>
            </div>

            <div className="flex items-center gap-4 mt-8 justify-center lg:justify-start">
              <button
                onClick={() =>
                  setCurrent((c) => (c - 1 + bestSellers.length) % bestSellers.length)
                }
                className="p-2 border-2 border-mang-brown/25 rounded-full hover:border-mang-brown hover:text-mang-orange text-mang-brown transition-colors"
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex gap-2">
                {bestSellers.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i === current ? "bg-mang-brown" : "bg-mang-tan-dark"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrent((c) => (c + 1) % bestSellers.length)}
                className="p-2 border-2 border-mang-brown/25 rounded-full hover:border-mang-brown hover:text-mang-orange text-mang-brown transition-colors"
                aria-label="Next slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
