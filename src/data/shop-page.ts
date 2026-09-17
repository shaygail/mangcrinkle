import { shopSections as structuralShopSections } from "@/data/products";

export interface ShopSectionCopy {
  sectionKey: string;
  title: string;
  subtitle: string;
}

export interface ShopPageContent {
  title: string;
  subtitle: string;
  description: string;
  sections: ShopSectionCopy[];
}

/**
 * Offline / error fallback shop page copy. Live data is fetched from Strapi.
 */
export const fallbackShopPage: ShopPageContent = {
  title: "The Crinkle Shop",
  subtitle: "Filipino Sweet Magic",
  description:
    "Experience award-winning premium cookies. Handcrafted fresh daily, featuring a pillow-soft exterior, unbelievably fudgy soft centres, and snowy sweet powdered sugar.",
  sections: structuralShopSections.map((section) => ({
    sectionKey: section.id,
    title: section.title,
    subtitle: section.subtitle,
  })),
};

/** Merge CMS section copy onto structural shop sections (categories / filters stay in code). */
export function mergeShopSections(copy: ShopPageContent) {
  const byKey = new Map(
    copy.sections.map((section) => [section.sectionKey, section])
  );

  return structuralShopSections.map((section) => {
    const override = byKey.get(section.id);
    return {
      ...section,
      title: override?.title ?? section.title,
      subtitle: override?.subtitle ?? section.subtitle,
    };
  });
}
