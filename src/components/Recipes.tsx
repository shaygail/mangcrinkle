import Button from "@/components/Button";
import { HomepageContent, OrderStep } from "@/data/homepage";

interface RecipesProps {
  content: HomepageContent;
  steps: OrderStep[];
}

export default function Recipes({ content, steps }: RecipesProps) {
  const displaySteps = steps.slice(0, 3);

  return (
    <section
      id="order"
      className="py-10 sm:py-14 lg:py-[72px] bg-mang-cream border-y border-mang-tan"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-20">
        <div className="text-center mb-8 lg:mb-10">
          <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-mang-brown-mid mb-1.5">
            Seamless Pickup
          </p>
          <h2 className="menu-title-3d text-4xl lg:text-5xl mb-2">
            {content.howToOrderTitle}
          </h2>
          <p className="hidden sm:block text-mang-brown-mid text-base italic max-w-xl mx-auto">
            {content.howToOrderSubtitle}
          </p>
        </div>

        {/* Mobile: numbered list */}
        <ol className="flex flex-col gap-4 sm:hidden mb-8">
          {displaySteps.map((item) => (
            <li key={item.id} className="flex gap-4 items-center">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mang-brown text-mang-cream font-extrabold text-lg">
                {item.stepNumber}
              </span>
              <div>
                <h3 className="font-bold text-mang-brown text-base mb-0.5">
                  {item.title}
                </h3>
                <p className="text-mang-brown-mid text-sm leading-5">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Desktop: step cards */}
        <ol className="hidden sm:grid sm:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
          {displaySteps.map((item) => (
            <li key={item.id}>
              <article className="h-full bg-mang-cream-light border-2 border-mang-brown/10 rounded-2xl p-8 shadow-[2px_2px_0_rgba(61,36,24,0.06)]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mang-brown text-mang-cream font-extrabold text-lg">
                    {item.stepNumber}
                  </span>
                  <span className="text-2xl" aria-hidden>
                    {item.emoji}
                  </span>
                </div>
                <h3 className="font-bold text-mang-brown uppercase tracking-wide text-sm mb-2">
                  {item.title}
                </h3>
                <p className="text-mang-brown-mid text-sm leading-relaxed">
                  {item.description}
                </p>
              </article>
            </li>
          ))}
        </ol>

        <div className="hidden sm:flex justify-center">
          <Button href="/shop" variant="brown" pop>
            {content.howToOrderButtonText}
          </Button>
        </div>
      </div>
    </section>
  );
}
