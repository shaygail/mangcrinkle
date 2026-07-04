import Button from "@/components/Button";

const storyQuotes = [
  "Every bite deserves a little more crinkle",
  "From our kitchen to your hands",
  "A whole family of flavours",
  "Flavour brings people together!",
];

export default function Story() {
  return (
    <section id="about" className="py-16 lg:py-24 bg-mang-brown text-mang-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="menu-title-3d text-4xl lg:text-5xl mb-6 !text-mang-orange">
              The Story Behind Mang Crinkle
            </h2>
            <p className="text-mang-cream/85 text-lg mb-8 leading-relaxed font-serif">
              Filipino-inspired crinkles, baked soft-centred and fudgy. From classic
              chocolate to ube, matcha, and our gooey lava crinkles — every flavour
              is made to crave.
            </p>
            <Button href="/shop" variant="brown">
              Explore the Menu
            </Button>
          </div>

          <div className="relative">
            <div
              className="aspect-[4/5] rounded-2xl bg-cover bg-center border-2 border-mang-orange/40"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1558961363-fa8fdf64db35?w=600&h=750&fit=crop)",
              }}
            />
          </div>
        </div>

        <div className="mt-16 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...storyQuotes, ...storyQuotes].map((quote, i) => (
              <span
                key={i}
                className="menu-logo-sub text-2xl lg:text-3xl mx-8"
              >
                {quote}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
