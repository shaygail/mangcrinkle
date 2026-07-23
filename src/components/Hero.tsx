import ProductImage from "@/components/ProductImage";
import { PLACEHOLDERS } from "@/lib/images";
import Button from "@/components/Button";
import { HomepageContent } from "@/data/homepage";

interface HeroProps {
  content: HomepageContent;
}

export default function Hero({ content }: HeroProps) {
  return (
    <section className="relative min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden bg-mang-cream">
      <ProductImage
        src={content.heroImage}
        alt={content.heroTitle}
        fill
        className="object-cover opacity-30"
        priority
        sizes="100vw"
        fallback={PLACEHOLDERS.hero}
      />
      <div className="absolute inset-0 bg-mang-cream/60" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="menu-logo text-6xl sm:text-7xl lg:text-8xl leading-none mb-2">
          {content.heroTitle}
        </h1>
        <p className="menu-logo-sub text-2xl sm:text-3xl mb-6">
          {content.heroSubtitle}
        </p>
        <p className="text-mang-brown text-sm font-bold uppercase tracking-widest mb-8 max-w-md mx-auto">
          {content.heroDescription}
        </p>
        <Button href={content.heroButtonLink} variant="brown" size="lg">
          {content.heroButtonText}
        </Button>
      </div>
    </section>
  );
}

export function Tagline({ content }: HeroProps) {
  return (
    <section className="bg-mang-tan py-12 lg:py-16 border-y-2 border-mang-brown/10">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-lg lg:text-xl text-mang-brown leading-relaxed font-serif italic">
          {content.tagline}
        </h2>
      </div>
    </section>
  );
}
