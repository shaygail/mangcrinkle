import ShopEditor from "@/components/admin/ShopEditor";
import { fallbackShopPage } from "@/data/shop-page";
import { getDraftWebsite } from "@/lib/supabase/catalog";
import type { ShopPageContent } from "@/data/shop-page";

export const dynamic = "force-dynamic";

export default async function AdminShopPage({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string; published?: string }>;
}) {
  const query = (await Promise.resolve(searchParams ?? {})) as {
    saved?: string;
    published?: string;
  };
  const shopRow = await getDraftWebsite("shop_page");
  const shopPage = (shopRow?.draft_payload as ShopPageContent | undefined) ?? fallbackShopPage;
  const notice = query.published
    ? "Shop published."
    : query.saved
      ? "Draft saved. The shop stays the same until you publish."
      : undefined;

  return (
    <ShopEditor
      notice={notice}
      revision={shopRow?.revision ?? 0}
      shopPage={{
        ...shopPage,
        sections: (shopPage.sections ?? []).filter((section) => section.sectionKey !== "hot-drinks"),
      }}
    />
  );
}
