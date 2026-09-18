import Button from "@/components/Button";
import { HomepageContent } from "@/data/homepage";

interface CTAProps {
  content: HomepageContent;
}

export default function CTA({ content }: CTAProps) {
  return (
    <section className="bg-mang-brown py-10 sm:py-14 lg:py-16 px-6">
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-5">
        <h2 className="font-[family-name:var(--font-display)] text-[32px] sm:text-4xl lg:text-5xl text-mang-cream tracking-wide uppercase leading-none">
          {content.ctaTitle}
        </h2>
        <p className="text-[13px] sm:text-base italic text-mang-tan max-w-[310px] sm:max-w-md mx-auto leading-[18px] sm:leading-relaxed">
          {content.ctaBody}
        </p>
        <Button href="/shop" variant="yellow" pop size="lg">
          {content.ctaButtonText}
        </Button>
      </div>
    </section>
  );
}
