import Button from "@/components/Button";
import { PLACEHOLDERS } from "@/lib/images";
import { HomepageContent } from "@/data/homepage";

interface CTAProps {
  content: HomepageContent;
}

export default function CTA({ content }: CTAProps) {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-mang-brown">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url(${content.ctaBackgroundImage || PLACEHOLDERS.hero})`,
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-mang-cream">
        <h2 className="menu-title-3d text-4xl lg:text-6xl mb-6 !text-mang-orange">
          {content.ctaTitle}
        </h2>
        <p className="text-lg lg:text-xl text-mang-cream/85 mb-8 max-w-2xl mx-auto font-serif italic">
          {content.ctaBody}
        </p>
        <Button href="/shop" variant="brown" size="lg">
          {content.ctaButtonText}
        </Button>
      </div>

      <div className="relative z-10 mt-12 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="menu-logo-sub text-3xl lg:text-4xl mx-8 opacity-30"
            >
              {content.ctaMarqueeText}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
