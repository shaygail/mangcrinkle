import Button from "@/components/Button";
import { HomepageContent } from "@/data/homepage";

interface CTAProps {
  content: HomepageContent;
}

export default function CTA({ content }: CTAProps) {
  return (
    <section className="bg-mang-brown py-10 sm:py-14 lg:py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl text-mang-cream tracking-wide mb-4 uppercase">
          {content.ctaTitle}
        </h2>
        <p className="text-sm sm:text-base italic text-mang-tan mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed">
          {content.ctaBody}
        </p>
        <Button href="/shop" variant="yellow" pop size="lg">
          {content.ctaButtonText}
        </Button>
      </div>
    </section>
  );
}
