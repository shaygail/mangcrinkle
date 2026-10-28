import ProductManager from "@/components/admin/ProductManager";
import WebsiteEditor from "@/components/admin/WebsiteEditor";
import { getAdminProducts } from "@/lib/supabase/catalog";
import { fallbackHomepage, fallbackOrderSteps, fallbackTestimonials } from "@/data/homepage";
import { fallbackShopPage } from "@/data/shop-page";
import { fallbackStorefrontCopy } from "@/data/storefront-copy";
import { fallbackStoreOutlet } from "@/data/store-outlet";
import { getDraftWebsite } from "@/lib/supabase/catalog";
import type { HomepageContent, HomepageTestimonial, OrderStep } from "@/data/homepage";
import type { ShopPageContent } from "@/data/shop-page";
import type { StoreOutlet } from "@/data/store-outlet";
import type { StorefrontCopy } from "@/data/storefront-copy";

export const dynamic = "force-dynamic";

export default async function AdminWebsitePage({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string; published?: string; deleted?: string; error?: string }>;
}) {
  const query = (await Promise.resolve(searchParams ?? {})) as {
    saved?: string;
    published?: string;
    deleted?: string;
    error?: string;
  };
  const [products, homepageRow, shopRow, outletRow, copyRow, quotesRow, stepsRow] = await Promise.all([
    getAdminProducts(),
    getDraftWebsite("homepage"),
    getDraftWebsite("shop_page"),
    getDraftWebsite("store_outlet"),
    getDraftWebsite("storefront_copy"),
    getDraftWebsite("testimonials"),
    getDraftWebsite("order_steps"),
  ]);

  const notice = query.deleted
    ? "Deleted."
    : query.error
      ? "Couldn’t delete that. Reload and try again."
      : query.published
        ? "Homepage published."
        : query.saved
          ? "Draft saved. The website stays the same until you publish."
          : undefined;

  const shopPage = (shopRow?.draft_payload as ShopPageContent | undefined) ?? fallbackShopPage;

  return (
    <div className="space-y-16">
    <ProductManager products={products} embedded />
    <WebsiteEditor
      notice={notice}
      revision={homepageRow?.revision ?? 0}
      homepage={(homepageRow?.draft_payload as HomepageContent | undefined) ?? fallbackHomepage}
      shopPage={{
        ...shopPage,
        sections: shopPage.sections.filter((section) => section.sectionKey !== "hot-drinks"),
      }}
      outlet={(outletRow?.draft_payload as StoreOutlet | undefined) ?? fallbackStoreOutlet}
      copy={(copyRow?.draft_payload as StorefrontCopy | undefined) ?? fallbackStorefrontCopy}
      testimonials={
        (quotesRow?.draft_payload as HomepageTestimonial[] | undefined) ?? fallbackTestimonials
      }
      orderSteps={(stepsRow?.draft_payload as OrderStep[] | undefined) ?? fallbackOrderSteps}
    />
    </div>
  );
}
