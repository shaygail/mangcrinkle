import ProductImage from "@/components/ProductImage";
import Button from "@/components/Button";
import { HomepageContent } from "@/data/homepage";

interface HeroProps {
  content: HomepageContent;
}

const HIGHLIGHTS = [
  "Soft-Centred",
  "Ube & Classic Chocolate",
  "Gooey Lava Core",
] as const;

export default function Hero({ content }: HeroProps) {
  return (
    <section className="bg-mang-cream">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-14 lg:py-[72px] flex flex-col gap-6 sm:gap-8 items-center">
        {/* Title stack */}
        <div className="text-center w-full max-w-3xl">
          <p className="hidden sm:block text-[12px] font-bold uppercase tracking-[0.15em] text-mang-brown-mid mb-2">
            Filipino Artisanal Treats
          </p>
          <h1 className="menu-logo text-[52px] sm:text-6xl lg:text-[96px] leading-none mb-2">
            {content.heroTitle}
          </h1>
          <p className="menu-logo-sub text-[22px] sm:text-3xl lg:text-4xl mb-3 sm:mb-4">
            {content.heroSubtitle}
          </p>
          <p className="text-mang-brown-mid text-sm sm:text-lg italic max-w-xl mx-auto leading-relaxed">
            {content.heroDescription}
          </p>
        </div>

        {/* Media + copy: stacked mobile, split desktop */}
        <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-6 items-center lg:items-stretch max-w-[960px]">
          <div className="relative w-full max-w-[342px] sm:max-w-md lg:max-w-none lg:w-[560px] shrink-0 aspect-[560/360] rounded-[20px] overflow-hidden border-2 border-mang-brown shadow-[4px_4px_0_rgba(61,36,24,0.17)]">
            <ProductImage
              src={content.heroImage}
              alt={content.heroTitle}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 90vw, 560px"
              fallback="/images/figma/hero-crinkles.jpg"
            />
          </div>

          <div className="hidden lg:flex flex-1 flex-col gap-5 min-w-0 justify-between">
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-mang-brown-mid">
                Filipino Sweet Magic
              </p>
              <p className="text-2xl font-bold text-mang-brown leading-8">
                Freshly baked daily with premium soft, fudgy centers and snowy
                sweet crinkle magic.
              </p>
              <p className="text-sm italic text-mang-brown-mid leading-5">
                From classic chocolate to signature ube and gooey lava crinkles,
                every bite is made to crave.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {HIGHLIGHTS.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center px-3 py-2 rounded-full border-[1.5px] border-mang-brown bg-mang-tan text-[12px] font-bold text-mang-brown"
                >
                  {label}
                </span>
              ))}
            </div>

            <Button
              href={content.heroButtonLink}
              variant="brown"
              pop
              className="self-start"
            >
              🍪 {content.heroButtonText}
            </Button>
          </div>
        </div>

        {/* Mobile CTA under image */}
        <div className="lg:hidden">
          <Button href={content.heroButtonLink} variant="brown" pop size="lg">
            🍪 {content.heroButtonText}
          </Button>
        </div>
      </div>
    </section>
  );
}

export function BrandHighlights() {
  const items = [
    { emoji: "✨", label: "Soft-Centred" },
    { emoji: "💜", label: "Ube & Classic Chocolate" },
    { emoji: "🔥", label: "Gooey Lava Core" },
  ] as const;

  return (
    <section className="bg-mang-tan border-y border-mang-brown px-5 sm:px-8 lg:px-20 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-x-8 sm:gap-y-2 sm:justify-center">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-lg leading-none" aria-hidden>
              {item.emoji}
            </span>
            <span className="text-[12px] font-bold text-mang-brown">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
