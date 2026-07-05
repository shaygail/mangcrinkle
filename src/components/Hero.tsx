import ProductImage from "@/components/ProductImage";
import { PLACEHOLDERS } from "@/lib/images";
import Button from "@/components/Button";

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden bg-mang-cream">
      <ProductImage
        src={PLACEHOLDERS.hero}
        alt="Mang Crinkle cookies"
        fill
        className="object-cover opacity-30"
        priority
        sizes="100vw"
        fallback={PLACEHOLDERS.hero}
      />
      <div className="absolute inset-0 bg-mang-cream/60" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="menu-logo text-6xl sm:text-7xl lg:text-8xl leading-none mb-2">
          Mang Crinkle
        </h1>
        <p className="menu-logo-sub text-2xl sm:text-3xl mb-6">made to crave</p>
        <p className="text-mang-brown text-sm font-bold uppercase tracking-widest mb-8 max-w-md mx-auto">
          Handcrafted Filipino-inspired crinkles, soft-centred, and fudgy.
        </p>
        <Button href="/shop" variant="brown" size="lg">
          Order Now
        </Button>
      </div>
    </section>
  );
}

export function Tagline() {
  return (
    <section className="bg-mang-tan py-12 lg:py-16 border-y-2 border-mang-brown/10">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-lg lg:text-xl text-mang-brown leading-relaxed font-serif italic">
          From the <em className="font-bold not-italic">first bite</em> to the{" "}
          <em className="font-bold not-italic">last crumb</em>, every crinkle is
          baked soft-centred, fudgy, and made to crave.
        </h2>
      </div>
    </section>
  );
}
