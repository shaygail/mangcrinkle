import { PLACEHOLDERS } from "@/lib/images";

export interface NavLink {
  label: string;
  href: string;
}

export interface HomepageContent {
  announcementText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroEyebrow: string;
  heroPanelEyebrow: string;
  heroPanelTitle: string;
  heroPanelBody: string;
  heroHighlights: string[];
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
  footerMenuLinks: NavLink[];
  footerExploreLinks: NavLink[];
  footerSocialLinks: NavLink[];
  footerCopyright: string;
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
    "🍪 HANDCRAFTED FILIPINO-INSPIRED CRINKLES - ORDER ONLINE FOR PICKUP",
  heroTitle: "Mang Crinkle",
  heroSubtitle: "made to crave",
  heroDescription:
    "Handcrafted Filipino-inspired crinkles, soft-centred, and fudgy.",
  heroEyebrow: "Filipino Artisanal Treats",
  heroPanelEyebrow: "Filipino Sweet Magic",
  heroPanelTitle:
    "Freshly baked daily with premium soft, fudgy centers and snowy sweet crinkle magic.",
  heroPanelBody:
    "From classic chocolate to signature ube and gooey lava crinkles, every bite is made to crave.",
  heroHighlights: [
    "Soft-Centred",
    "Ube & Classic Chocolate",
    "Gooey Lava Core",
  ],
  heroButtonText: "Order Crinkles Now",
  heroButtonLink: "/shop",
  heroImage: "/images/figma/hero-crinkles.jpg",
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
  testimonialsTitle: "What Crinkle Fans Say",
  ctaTitle: "Bake Someone Happy",
  ctaBody:
    "Perfect for gatherings, gifts, or a personal weekend indulgence. Every crinkle is freshly baked with loving care.",
  ctaButtonText: "Order Fresh Now",
  ctaMarqueeText: "MADE TO CRAVE",
  ctaBackgroundImage: "/images/figma/hero-crinkles.jpg",
  bestSellersTitle: "Fan Favourites",
  merchTitle: "Fan Favourite Crinkles",
  merchLinkText: "Shop All",
  merchInstagramText: "Follow us on Instagram",
  footerTagline: "made to crave",
  siteDescription:
    "Handcrafted Filipino-inspired crinkles, soft-centred and fudgy. Order crinkles, lava crinkles, and drinks online.",
  footerMenuLinks: [
    { label: "Shop All", href: "/shop" },
    { label: "Ube Special", href: "/shop/ube" },
    { label: "Box Packs", href: "/shop?category=packs" },
  ],
  footerExploreLinks: [
    { label: "Our Story", href: "/" },
    { label: "Pickup Locations", href: "/#order" },
    { label: "FAQ", href: "/shop" },
  ],
  footerSocialLinks: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "TikTok", href: "#" },
  ],
  footerCopyright: "© 2026 Mang Crinkle. All rights reserved.",
};

export const fallbackTestimonials: HomepageTestimonial[] = [
  {
    id: "1",
    quote:
      "The signature ube crinkles are absolutely legendary - pillowy soft on the outside with an incredibly rich, fudge-like centre. Best dessert in the city!",
    author: "Amara L.",
  },
  {
    id: "2",
    quote:
      "Best crinkles I've had outside the Philippines. The lava chocolate is dangerously good.",
    author: "James T.",
  },
  {
    id: "3",
    quote:
      "Ordered a 6-pack for a party and they were gone in minutes. Already planning my next order.",
    author: "Priya S.",
  },
];

export const fallbackOrderSteps: OrderStep[] = [
  {
    id: "1",
    stepNumber: "1",
    title: "Pick A Box",
    emoji: "🛒",
    description: "Choose a 3, 6, or 12 pack - or grab singles.",
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
    emoji: "🥤",
    description: "Pair with a hot or iced drink on the side.",
  },
];
