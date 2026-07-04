import Button from "@/components/Button";

const orderSteps = [
  {
    step: "1",
    title: "Pick A Box",
    emoji: "📦",
    desc: "Choose a 3, 6, or 12 pack — or grab singles.",
  },
  {
    step: "2",
    title: "Choose A Flavour",
    emoji: "🍪",
    desc: "Mix & match standard, premium, or signature crinkles.",
  },
  {
    step: "3",
    title: "Add A Drink",
    emoji: "🧋",
    desc: "Pair with a hot or iced drink on the side.",
  },
];

export default function Recipes() {
  return (
    <section id="order" className="py-16 lg:py-24 bg-mang-tan border-y-2 border-mang-brown/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="menu-title-3d text-4xl lg:text-5xl mb-4">
            How To Order
          </h2>
          <p className="text-mang-brown-mid text-lg max-w-2xl mx-auto font-serif italic">
            Three simple steps to your perfect crinkle order.
          </p>
          <div className="mt-8">
            <Button href="/shop" variant="brown">
              Start Ordering
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {orderSteps.map((item) => (
            <article
              key={item.step}
              className="bg-mang-cream border-2 border-mang-brown rounded-2xl p-6 text-center shadow-[3px_3px_0_rgba(61,36,24,0.1)]"
            >
              <div className="text-5xl mb-4">{item.emoji}</div>
              <h3 className="font-bold text-mang-brown uppercase tracking-wide text-sm mb-2">
                {item.title}
              </h3>
              <p className="text-mang-brown-mid text-sm font-serif italic">
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
