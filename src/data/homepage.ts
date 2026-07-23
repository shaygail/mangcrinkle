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
  howToOrderSubtitle: "Three simple steps to your perfect crinkle order.",
  howToOrderButtonText: "Start Ordering",
  testimonialsTitle: "They Bite.\nThey Crave.\nThey Come Back.",
  ctaTitle: "Ready to Crave?",
  ctaBody:
    "Pick your box, choose your flavours, add a drink — your perfect order is just a few clicks away.",
  ctaButtonText: "Order Crinkles Now",
  ctaMarqueeText: "MADE TO CRAVE",
  ctaBackgroundImage: PLACEHOLDERS.hero,
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
    title: "Pick A Box",
    emoji: "📦",
    description: "Choose a 3, 6, or 12 pack — or grab singles.",
  },
  {
    id: "2",
    stepNumber: "2",
    title: "Choose A Flavour",
    emoji: "🍪",
    description: "Mix & match standard, premium, or signature crinkles.",
  },
  {
    id: "3",
    stepNumber: "3",
    title: "Add A Drink",
    emoji: "🧋",
    description: "Pair with a hot or iced drink on the side.",
  },
];
