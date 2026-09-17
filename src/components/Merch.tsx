import Link from "next/link";
import { getHomepage, getProducts } from "@/lib/strapi";
import ProductCard from "./ProductCard";

export default async function Merch() {
  const [products, homepage] = await Promise.all([
    getProducts(),
    getHomepage(),
  ]);
  const featuredProducts = products
    .filter(
      (p) =>
        p.category === "crinkle-signature" || p.category === "crinkle-premium"
    )
    .slice(0, 4);

  return (
    <section className="py-16 lg:py-24 bg-mang-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="menu-title-3d text-4xl lg:text-5xl">
            {homepage.merchTitle}
          </h2>
          <Link
            href="/shop"
            className="text-mang-brown font-bold uppercase tracking-wider hover:text-mang-orange transition-colors hidden sm:block"
          >
            {homepage.merchLinkText}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-mang-brown font-bold uppercase tracking-wider hover:text-mang-orange transition-colors"
          >
            <span>→</span> {homepage.merchInstagramText}
          </a>
        </div>
      </div>
    </section>
  );
}
