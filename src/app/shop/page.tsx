import { Suspense } from "react";
import { getShopPage } from "@/lib/strapi";
import ShopContent from "@/components/shop/ShopContent";
import { mergeShopSections } from "@/data/shop-page";

export default async function ShopPage() {
  const shopPage = await getShopPage();
  const sections = mergeShopSections(shopPage);

  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center bg-mang-cream">
          <p className="text-mang-brown/60">Loading menu...</p>
        </div>
      }
    >
      <ShopContent content={shopPage} sections={sections} />
    </Suspense>
  );
}
