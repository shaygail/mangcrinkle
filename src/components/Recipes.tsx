import Button from "@/components/Button";
import { HomepageContent, OrderStep } from "@/data/homepage";

interface RecipesProps {
  content: HomepageContent;
  steps: OrderStep[];
}

export default function Recipes({ content, steps }: RecipesProps) {
  return (
    <section
      id="order"
      className="py-16 lg:py-24 bg-mang-tan border-y-2 border-mang-brown/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="menu-title-3d text-4xl lg:text-5xl mb-4">
            {content.howToOrderTitle}
          </h2>
          <p className="text-mang-brown-mid text-lg max-w-2xl mx-auto font-serif italic">
            {content.howToOrderSubtitle}
          </p>
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 max-w-6xl mx-auto mb-12">
          {steps.map((item, index) => (
            <li key={item.id} className="relative flex flex-col">
              {index < steps.length - 1 && (
                <span
                  aria-hidden
                  className="hidden lg:block absolute top-10 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-0.5 bg-mang-brown/20"
                />
              )}
              <article className="flex-1 bg-mang-cream border-2 border-mang-brown rounded-2xl p-6 text-center shadow-[3px_3px_0_rgba(61,36,24,0.1)]">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mang-brown text-mang-cream font-bold text-lg"
                    aria-label={`Step ${item.stepNumber}`}
                  >
                    {item.stepNumber}
                  </span>
                  <span className="text-4xl" aria-hidden>
                    {item.emoji}
                  </span>
                </div>
                <h3 className="font-bold text-mang-brown uppercase tracking-wide text-sm mb-2">
                  {item.title}
                </h3>
                <p className="text-mang-brown-mid text-sm font-serif italic leading-relaxed">
                  {item.description}
                </p>
              </article>
            </li>
          ))}
        </ol>

        <div className="text-center">
          <Button href="/shop" variant="brown">
            {content.howToOrderButtonText}
          </Button>
        </div>
      </div>
    </section>
  );
}
