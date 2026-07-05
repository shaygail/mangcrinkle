import Button from "@/components/Button";
import { PLACEHOLDERS } from "@/lib/images";

export default function CTA() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-mang-brown">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url(${PLACEHOLDERS.hero})`,
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-mang-cream">
        <h2 className="menu-title-3d text-4xl lg:text-6xl mb-6 !text-mang-orange">
          Ready to Crave?
        </h2>
        <p className="text-lg lg:text-xl text-mang-cream/85 mb-8 max-w-2xl mx-auto font-serif italic">
          Pick your box, choose your flavours, add a drink — your perfect order
          is just a few clicks away.
        </p>
        <Button href="/shop" variant="brown" size="lg">
          Order Crinkles Now
        </Button>
      </div>

      <div className="relative z-10 mt-12 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="menu-logo-sub text-3xl lg:text-4xl mx-8 opacity-30"
            >
              MADE TO CRAVE
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
