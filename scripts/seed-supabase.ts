/**
 * Idempotent seed. Inserts the confirmed menu as drafts and archives the old
 * demo catalogue. Never publishes. Safe to run more than once.
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { fallbackHomepage, fallbackOrderSteps, fallbackTestimonials } from "../src/data/homepage";
import { fallbackProducts } from "../src/data/products";
import { fallbackShopPage } from "../src/data/shop-page";
import { fallbackStorefrontCopy } from "../src/data/storefront-copy";
import { fallbackStoreOutlet } from "../src/data/store-outlet";
import { confirmedMenu, menuCategories } from "../src/lib/supabase/menu";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  for (const category of menuCategories) {
    const { error } = await supabase.from("categories").upsert(
      { slug: category.slug, name: category.name, sort_order: category.sortOrder },
      { onConflict: "slug" }
    );
    if (error) throw error;
  }

  const { error: legacyCategoryError } = await supabase.from("categories").upsert(
    { slug: "legacy", name: "Archived menu", sort_order: 99 },
    { onConflict: "slug" }
  );
  if (legacyCategoryError) throw legacyCategoryError;

  const { data: categories, error: categoryReadError } = await supabase
    .from("categories")
    .select("id, slug");
  if (categoryReadError) throw categoryReadError;
  const categoryId = new Map((categories ?? []).map((row) => [row.slug, row.id]));

  for (const line of confirmedMenu) {
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", line.slug)
      .maybeSingle();
    if (existing) {
      console.log(`skip ${line.slug} (already present)`);
      continue;
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        category_id: categoryId.get(line.categorySlug),
        slug: line.slug,
        name: line.name,
        short_description: line.description,
        allows_mixed_flavours: false,
        status: "draft",
        has_unpublished_changes: true,
      })
      .select("id")
      .single();
    if (error) throw error;

    for (const [index, variant] of line.variants.entries()) {
      let flavourId: string | null = null;
      if (variant.flavourSlug && variant.flavourName) {
        const { data: flavour, error: flavourError } = await supabase
          .from("product_flavours")
          .upsert(
            {
              product_id: product.id,
              slug: variant.flavourSlug,
              name: variant.flavourName,
              sort_order: index,
            },
            { onConflict: "product_id,slug" }
          )
          .select("id")
          .single();
        if (flavourError) throw flavourError;
        flavourId = flavour.id;
      }

      const { error: variantError } = await supabase.from("product_variants").insert({
        product_id: product.id,
        flavour_id: flavourId,
        sku: variant.sku,
        label: variant.label,
        display_name: variant.displayName,
        pack_size: variant.packSize,
        price_cents: variant.priceCents,
        available: true,
        storefront_category: variant.storefrontCategory,
        sort_order: index,
        status: "draft",
      });
      if (variantError) throw variantError;
    }
    console.log(`draft ${line.slug} (${line.variants.length} variants)`);
  }

  for (const legacy of fallbackProducts) {
    const slug = `legacy-${legacy.id}`;
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existing) continue;

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        category_id: categoryId.get("legacy"),
        slug,
        name: legacy.name,
        short_description: legacy.description,
        image_url: legacy.image,
        badge: legacy.badge ?? "",
        allows_mixed_flavours: false,
        status: "archived",
        has_unpublished_changes: false,
        legacy_product_id: legacy.id,
      })
      .select("id")
      .single();
    if (error) throw error;

    const { error: variantError } = await supabase.from("product_variants").insert({
      product_id: product.id,
      sku: slug,
      label: "Archived",
      display_name: legacy.name,
      pack_size: 1,
      price_cents: Math.round(legacy.price * 100),
      available: false,
      storefront_category: legacy.category,
      status: "archived",
    });
    if (variantError) throw variantError;
  }

  const drafts: { key: string; payload: unknown }[] = [
    { key: "homepage", payload: fallbackHomepage },
    { key: "shop_page", payload: fallbackShopPage },
    { key: "store_outlet", payload: fallbackStoreOutlet },
    { key: "storefront_copy", payload: fallbackStorefrontCopy },
    { key: "testimonials", payload: fallbackTestimonials },
    { key: "order_steps", payload: fallbackOrderSteps },
  ];
  for (const doc of drafts) {
    const { data: existing } = await supabase
      .from("website_content")
      .select("key")
      .eq("key", doc.key)
      .maybeSingle();
    if (existing) continue;
    const { error } = await supabase.from("website_content").insert({
      key: doc.key,
      draft_payload: doc.payload,
      status: "draft",
      has_unpublished_changes: true,
    });
    if (error) throw error;
    console.log(`draft content ${doc.key}`);
  }

  console.log("Seed finished. Nothing was published.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
