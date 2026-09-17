import { PLACEHOLDERS } from "@/lib/images";

export interface HomepageContent {
  announcementText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroButtonText: string;
  heroButtonLink: string;
  heroImage: string;
  tagline: string;
  storyTitle: string;
  storyBody: string;
  storyButtonText: string;
  storyImage: string;
  storyMarqueeQuotes: string[];
  howToOrderTitle: string;
  howToOrderSubtitle: string;
  howToOrderButtonText: string;
  testimonialsTitle: string;
  ctaTitle: string;
  ctaBody: string;
  ctaButtonText: string;
  ctaMarqueeText: string;
  ctaBackgroundImage: string;
  bestSellersTitle: string;
  merchTitle: string;
  merchLinkText: string;
  merchInstagramText: string;
  footerTagline: string;
  siteDescription: string;
}

export interface HomepageTestimonial {
  id: string;
  quote: string;
  author: string;
}

export interface OrderStep {
  id: string;
  stepNumber: string;
  title: string;
  emoji: string;
  description: string;
}

/**
 * Offline / error fallback homepage content. Live data is fetched from Strapi.
 */
export const fallbackHomepage: HomepageContent = {
  announcementText:
    "🍪 Handcrafted Filipino-inspired crinkles — order online for pickup",
  heroTitle: "Mang Crinkle",
  heroSubtitle: "made to crave",
  heroDescription:
    "Handcrafted Filipino-inspired crinkles, soft-centred, and fudgy.",
  heroButtonText: "Order Now",
  heroButtonLink: "/shop",
  heroImage: PLACEHOLDERS.hero,
  tagline:
    "From the first bite to the last crumb, every crinkle is baked soft-centred, fudgy, and made to crave.",
  storyTitle: "The Story Behind Mang Crinkle",
  storyBody:
    "Filipino-inspired crinkles, baked soft-centred and fudgy. From classic chocolate to ube, matcha, and our gooey lava crinkles — every flavour is made to crave.",
  storyButtonText: "Explore the Menu",
  storyImage: PLACEHOLDERS.cookie,
  storyMarqueeQuotes: [
    "Every bite deserves a little more crinkle",
    "From our kitchen to your hands",
    "A whole family of flavours",
    "Flavour brings people together!",
  ],
  howToOrderTitle: "How To Order",
  howToOrderSubtitle:
    "Order online in a few taps — browse, build your box, checkout, then pick up.",
  howToOrderButtonText: "Start Ordering",
  testimonialsTitle: "They Bite.\nThey Crave.\nThey Come Back.",
  ctaTitle: "Ready to Crave?",
  ctaBody:
    "Pick your box, choose your flavours, add a drink — your perfect order is just a few clicks away.",
  ctaButtonText: "Order Crinkles Now",
  ctaMarqueeText: "MADE TO CRAVE",
  ctaBackgroundImage: PLACEHOLDERS.hero,
  bestSellersTitle: "Fan Favourites",
  merchTitle: "Fan Favourite Crinkles",
  merchLinkText: "Shop All",
  merchInstagramText: "Follow us on Instagram",
  footerTagline: "made to crave",
  siteDescription:
    "Handcrafted Filipino-inspired crinkles, soft-centred and fudgy. Order crinkles, lava crinkles, and drinks online.",
};

export const fallbackTestimonials: HomepageTestimonial[] = [
  {
    id: "1",
    quote:
      "The ube crinkles are incredible — soft in the middle and the flavour is so unique. I keep coming back for more!",
    author: "Maria L.",
  },
  {
    id: "2",
    quote:
      "Best crinkles I've had outside the Philippines. The lava ube is dangerously good.",
    author: "James T.",
  },
  {
    id: "3",
    quote:
      "Ordered a 6-pack for a party and they were gone in minutes. Already planning my next order.",
    author: "Priya S.",
  },
  {
    id: "4",
    quote:
      "The iced ube marble matcha paired with a classic chocolate crinkle — chef's kiss.",
    author: "Andre K.",
  },
];

export const fallbackOrderSteps: OrderStep[] = [
  {
    id: "1",
    stepNumber: "1",
    title: "Browse the Menu",
    emoji: "🛒",
    description:
      "Head to the shop and explore singles, 3/6/12 packs, lava crinkles, and drinks.",
  },
  {
    id: "2",
    stepNumber: "2",
    title: "Build Your Order",
    emoji: "🍪",
    description:
      "Open a pack to pick each crinkle flavour, or add singles and drinks straight to cart.",
  },
  {
    id: "3",
    stepNumber: "3",
    title: "Review & Checkout",
    emoji: "✅",
    description:
      "Check your cart, swap milk on drinks if you like, then enter your name and contact details.",
  },
  {
    id: "4",
    stepNumber: "4",
    title: "Pick Up & Enjoy",
    emoji: "📧",
    description:
      "We'll email you to confirm your order and arrange pickup — then dig in!",
  },
];
