import { getShopPage } from "@/lib/strapi";
import ShopContent from "@/components/shop/ShopContent";
import { mergeShopSections } from "@/data/shop-page";
import { ShopFilter } from "@/data/products";

type ShopPageProps = {
  searchParams?: Promise<{ category?: string }> | { category?: string };
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const [shopPage, params] = await Promise.all([
    getShopPage(),
    Promise.resolve(searchParams ?? {}),
  ]);
  const sections = mergeShopSections(shopPage);
  const activeFilter = (params.category as ShopFilter) || "all";

  return (
    <ShopContent
      content={shopPage}
      sections={sections}
      activeFilter={activeFilter}
    />
  );
}
