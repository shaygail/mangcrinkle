import Button from "@/components/Button";
import { PLACEHOLDERS } from "@/lib/images";
import { HomepageContent } from "@/data/homepage";

interface StoryProps {
  content: HomepageContent;
}

export default function Story({ content }: StoryProps) {
  const quotes = content.storyMarqueeQuotes;

  return (
    <section id="about" className="py-16 lg:py-24 bg-mang-brown text-mang-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="menu-title-3d text-4xl lg:text-5xl mb-6 !text-mang-orange">
              {content.storyTitle}
            </h2>
            <p className="text-mang-cream/85 text-lg mb-8 leading-relaxed font-serif">
              {content.storyBody}
            </p>
            <Button href="/shop" variant="brown">
              {content.storyButtonText}
            </Button>
          </div>

          <div className="relative">
            <div
              className="aspect-[4/5] rounded-2xl bg-cover bg-center border-2 border-mang-orange/40"
              style={{
                backgroundImage: `url(${content.storyImage || PLACEHOLDERS.cookie})`,
              }}
            />
          </div>
        </div>

        <div className="mt-16 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...quotes, ...quotes].map((quote, i) => (
              <span key={i} className="menu-logo-sub text-2xl lg:text-3xl mx-8">
                {quote}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
