"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { dollarsToCents } from "@/lib/supabase/menu";
import { blankHomepage, getDraftWebsite } from "@/lib/supabase/catalog";
import { createSessionClient } from "@/lib/supabase/clients";
import { getCmsSession } from "@/lib/supabase/session";

export type EditorState = {
  error?: string;
  saved?: boolean;
  published?: boolean;
};

const CATEGORIES = [
  "crinkle-standard",
  "crinkle-premium",
  "crinkle-signature",
  "crinkle-pack",
  "lava",
  "iced-drink",
] as const;

function refreshSite(sku?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/shop", "layout");
  revalidatePath("/admin", "layout");
  if (sku) {
    revalidatePath(`/shop/${sku}`);
    revalidatePath(`/admin/products/${sku}`);
    revalidatePath(`/admin/preview/${sku}`);
  }
}

async function requireAdmin(): Promise<EditorState | null> {
  const session = await getCmsSession();
  if (!session) return { error: "Please sign in again." };
  return null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function categorySlugFor(category: string): string {
  if (category === "iced-drink" || category === "hot-drink") return "drinks";
  if (category === "lava") return "lava-crinkles";
  if (category === "crinkle-premium" || category === "crinkle-signature") return "crunch-creation";
  return "crinkle-classic";
}

export async function saveProductAction(
  _prev: EditorState,
  formData: FormData
): Promise<EditorState> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const intent = String(formData.get("intent") ?? "draft");
  const existingId = String(formData.get("existingId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const fullDescription = String(formData.get("fullDescription") ?? "").trim();
  const price = Number(formData.get("price"));
  const category = String(formData.get("category") ?? "");
  const requestedId = slugify(String(formData.get("productId") ?? (existingId || name)));

  if (name.length < 2) return { error: "Add a product name." };
  if (!description) return { error: "Add a short description." };
  if (!Number.isFinite(price) || price < 0 || price > 999) {
    return { error: "Enter a price between 0 and 999." };
  }
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return { error: "Choose a product type." };
  }
  if (!requestedId) return { error: "Add a name so we can create a link." };

  const available = formData.get("available") === "on";
  const priceCents = dollarsToCents(price);
  const variants: {
    sku: string;
    label: string;
    displayName: string;
    packSize: number;
    priceCents: number;
    available: boolean;
    storefrontCategory: string;
    flavourSlug: null;
    flavourName: null;
  }[] = [];
  const siblingPrices = formData.getAll("variantSku");
  if (siblingPrices.length === 0) {
    variants.push({
      sku: requestedId,
      label: "Individual",
      displayName: name,
      packSize: 1,
      priceCents,
      available,
      storefrontCategory: category,
      flavourSlug: null,
      flavourName: null,
    });
  } else {
    for (const skuValue of siblingPrices) {
      const sku = String(skuValue);
      const label = String(formData.get(`variantLabel:${sku}`) ?? "Individual");
      const packSize = Number(formData.get(`variantPack:${sku}`) ?? 1);
      const siblingPrice = Number(formData.get(`variantPrice:${sku}`));
      const siblingName = sku === requestedId ? name : String(formData.get(`variantName:${sku}`) ?? name);
      if (!Number.isFinite(siblingPrice) || siblingPrice < 0) {
        return { error: "Check the pack prices." };
      }
      variants.push({
        sku,
        label,
        displayName: siblingName,
        packSize,
        priceCents: sku === requestedId ? priceCents : dollarsToCents(siblingPrice),
        available: sku === requestedId ? available : formData.get(`variantAvailable:${sku}`) === "on",
        storefrontCategory:
          sku === requestedId
            ? category
            : String(formData.get(`variantCategory:${sku}`) ?? category),
        flavourSlug: null,
        flavourName: null,
      });
    }
  }

  let image = String(formData.get("currentImage") ?? "").trim();
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const stored = await storeProductPhoto(photo);
    if ("error" in stored) return { error: stored.error };
    image = stored.url;
  }

  const payload = {
    id: String(formData.get("dbId") ?? "") || null,
    expectedRevision: Number(formData.get("revision") ?? 0),
    categorySlug: String(formData.get("categorySlug") ?? categorySlugFor(category)),
    slug: String(formData.get("lineSlug") ?? requestedId),
    sku: requestedId,
    name: String(formData.get("lineName") ?? name),
    shortDescription: description,
    fullDescription,
    ingredients: String(formData.get("ingredients") ?? ""),
    allergens: String(formData.get("allergens") ?? ""),
    badge: String(formData.get("badge") ?? ""),
    imageUrl: String(formData.get("sharedImage") ?? "").trim(),
    featured: formData.get("featuredOnShop") === "on",
    available,
    allowsMixedFlavours: false,
    showInBoxBuilder: formData.get("showInBoxBuilder") === "on",
    variants,
  };

  const supabase = await createSessionClient();
  const { error } = await supabase.rpc("save_variant_draft", {
    payload,
    do_publish: intent === "publish",
  });
  if (error) {
    if (error.message.includes("revision conflict")) {
      return { error: "Someone else saved this. Reload the page, then try again." };
    }
    if (error.message.includes("not authorised")) {
      return { error: "You do not have permission to edit the shop." };
    }
    return { error: "Couldn’t save that change. Please try again." };
  }

  const imageKey = `product_image:${requestedId}`;
  const existingImage = await getDraftWebsite(imageKey);
  if (image || existingImage) {
    const imageError = await supabase.rpc("save_website_content", {
      doc_key: imageKey,
      payload: { url: image },
      expected_revision: existingImage?.revision ?? 0,
      do_publish: intent === "publish",
    });
    if (imageError.error) {
      return { error: "The item saved, but the photo didn’t. Try uploading it again." };
    }
  }

  refreshSite(requestedId);
  redirect(`/admin/products/${requestedId}?${intent === "publish" ? "published=1" : "saved=1"}`);
}

export async function saveWebsiteAction(
  _prev: EditorState,
  formData: FormData
): Promise<EditorState> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const heroTitle = String(formData.get("heroTitle") ?? "").trim();
  const announcementText = String(formData.get("announcementText") ?? "").trim();
  if (!heroTitle) return { error: "The homepage needs a headline." };
  if (!announcementText) return { error: "Add announcement text." };

  const current = await getDraftWebsite("homepage");
  const homepage = {
    ...blankHomepage(),
    ...(current?.draft_payload ?? {}),
    announcementText,
    heroTitle,
    heroSubtitle: String(formData.get("heroSubtitle") ?? "").trim(),
    heroDescription: String(formData.get("heroDescription") ?? "").trim(),
    heroButtonText: String(formData.get("heroButtonText") ?? "").trim(),
    storyTitle: String(formData.get("storyTitle") ?? "").trim(),
    storyBody: String(formData.get("storyBody") ?? "").trim(),
    bestSellersTitle: String(formData.get("bestSellersTitle") ?? "").trim(),
    ctaTitle: String(formData.get("ctaTitle") ?? "").trim(),
    ctaBody: String(formData.get("ctaBody") ?? "").trim(),
    footerTagline: String(formData.get("footerTagline") ?? "").trim(),
    siteDescription: String(formData.get("siteDescription") ?? "").trim(),
    heroButtonLink: "/shop",
    heroImage: String(formData.get("heroImage") ?? "").trim() || String((current?.draft_payload as { heroImage?: string } | null)?.heroImage ?? ""),
  };

  const supabase = await createSessionClient();
  const intent = String(formData.get("intent") ?? "draft");
  const publish = intent === "publish";

  async function saveDoc(key: string, payload: unknown, expected?: number) {
    const row = expected == null ? await getDraftWebsite(key) : null;
    const { error } = await supabase.rpc("save_website_content", {
      doc_key: key,
      payload,
      expected_revision: expected ?? row?.revision ?? 0,
      do_publish: publish,
    });
    return error;
  }

  const homepageError = await saveDoc(
    "homepage",
    homepage,
    Number(formData.get("revision") ?? 0)
  );
  if (homepageError) {
    if (homepageError.message.includes("revision conflict")) {
      return { error: "Someone else saved the homepage. Reload, then try again." };
    }
    return { error: "Couldn’t save the website changes. Please try again." };
  }

  const outletDraft = await getDraftWebsite("store_outlet");
  const previousWindows =
    (outletDraft?.draft_payload as { pickupWindows?: string[] } | null)?.pickupWindows ?? [];
  await saveDoc("store_outlet", {
    name: String(formData.get("outletName") ?? "").trim(),
    cartLabel: String(formData.get("outletName") ?? "").trim(),
    hours: String(formData.get("outletHours") ?? "").trim(),
    address: String(formData.get("outletAddress") ?? "").trim(),
    pickupNote: String(formData.get("pickupNote") ?? "").trim(),
    pickupWindows: previousWindows,
  });
  const testimonials = [];
  for (let index = 0; index < 12; index += 1) {
    if (!formData.has(`quote:${index}`)) break;
    testimonials.push({
      id: String(index + 1),
      quote: String(formData.get(`quote:${index}`) ?? "").trim(),
      author: String(formData.get(`author:${index}`) ?? "").trim(),
    });
  }
  const orderSteps = [];
  for (let index = 0; index < 12; index += 1) {
    if (!formData.has(`stepTitle:${index}`)) break;
    orderSteps.push({
      id: String(index + 1),
      stepNumber: String(index + 1),
      title: String(formData.get(`stepTitle:${index}`) ?? "").trim(),
      emoji: "",
      description: String(formData.get(`stepDescription:${index}`) ?? "").trim(),
    });
  }
  await saveDoc("testimonials", testimonials);
  await saveDoc("order_steps", orderSteps);
  const copy = await getDraftWebsite("storefront_copy");
  await saveDoc("storefront_copy", {
    ...(copy?.draft_payload ?? {}),
    cartTitle: String(formData.get("cartTitle") ?? "").trim(),
    cartEmptyBody: String(formData.get("cartEmptyBody") ?? "").trim(),
    confirmationBody: String(formData.get("confirmationBody") ?? "").trim(),
  });

  refreshSite();
  redirect(`/admin/website?${intent === "publish" ? "published=1" : "saved=1"}`);
}

export async function saveShopAction(
  _prev: EditorState,
  formData: FormData
): Promise<EditorState> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const title = String(formData.get("shopTitle") ?? "").trim();
  if (!title) return { error: "The shop needs a title." };

  const current = await getDraftWebsite("shop_page");
  const existing = (current?.draft_payload ?? {}) as Record<string, unknown>;
  const sectionKeys = formData
    .getAll("sectionKey")
    .map(String)
    .filter((sectionKey) => sectionKey !== "hot-drinks");
  const supabase = await createSessionClient();
  const intent = String(formData.get("intent") ?? "draft");
  const { error } = await supabase.rpc("save_website_content", {
    doc_key: "shop_page",
    payload: {
      ...existing,
      title,
      subtitle: String(formData.get("shopSubtitle") ?? "").trim(),
      description: String(formData.get("shopDescription") ?? "").trim(),
      sections: sectionKeys.map((sectionKey) => ({
        sectionKey,
        title: String(formData.get(`sectionTitle:${sectionKey}`) ?? "").trim(),
        subtitle: String(formData.get(`sectionSubtitle:${sectionKey}`) ?? "").trim(),
      })),
    },
    expected_revision: Number(formData.get("revision") ?? current?.revision ?? 0),
    do_publish: intent === "publish",
  });
  if (error) {
    if (error.message.includes("revision conflict")) {
      return { error: "Someone else saved the shop. Reload, then try again." };
    }
    return { error: "Couldn’t save the shop. Please try again." };
  }

  refreshSite();
  redirect(`/admin/shop?${intent === "publish" ? "published=1" : "saved=1"}`);
}

async function storeProductPhoto(file: File): Promise<{ url: string } | { error: string }> {
  if (file.size > 5_000_000) return { error: "Photos need to be 5 MB or smaller." };
  if (!file.type.startsWith("image/")) return { error: "Choose a JPG, PNG, or WebP photo." };

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const path = `products/${crypto.randomUUID()}-${safeName}`;
  const supabase = await createSessionClient();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const uploaded = await supabase.storage.from("media").upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (uploaded.error) return { error: "Couldn’t upload that photo. Please try again." };
  const url = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  const inserted = await supabase.from("media_assets").insert({
    storage_path: path,
    public_url: url,
    alt_text: "",
    mime_type: file.type,
    byte_size: file.size,
  });
  if (inserted.error) return { error: "Couldn’t save that photo. Please try again." };
  return { url };
}

export async function uploadMediaAction(formData: FormData): Promise<void> {
  const session = await getCmsSession();
  if (!session) redirect("/admin/login");
  const file = formData.get("file");
  const alt = String(formData.get("alt") ?? "").trim();
  if (!(file instanceof File) || file.size === 0) redirect("/admin/media?error=file");
  if (file.size > 5_000_000) redirect("/admin/media?error=size");
  if (!file.type.startsWith("image/")) redirect("/admin/media?error=type");

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const path = `products/${crypto.randomUUID()}-${safeName}`;
  const supabase = await createSessionClient();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const uploaded = await supabase.storage.from("media").upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (uploaded.error) redirect("/admin/media?error=upload");
  const url = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  const inserted = await supabase.from("media_assets").insert({
    storage_path: path,
    public_url: url,
    alt_text: alt,
    mime_type: file.type,
    byte_size: file.size,
  });
  if (inserted.error) redirect("/admin/media?error=upload");
  revalidatePath("/admin/media");
  redirect("/admin/media?saved=1");
}

export async function updateAltTextAction(formData: FormData): Promise<void> {
  const session = await getCmsSession();
  if (!session) redirect("/admin/login");
  const supabase = await createSessionClient();
  await supabase
    .from("media_assets")
    .update({ alt_text: String(formData.get("alt") ?? "") })
    .eq("id", String(formData.get("id") ?? ""));
  revalidatePath("/admin/media");
  redirect("/admin/media?saved=1");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  const session = await getCmsSession();
  if (!session) redirect("/admin/login");

  const sku = String(formData.get("sku") ?? "").trim();
  const dbId = String(formData.get("dbId") ?? "").trim();
  if (!sku) redirect("/admin/products?error=delete");

  const supabase = await createSessionClient();
  const archived = await supabase
    .from("product_variants")
    .update({
      status: "archived",
      available: false,
      published_available: false,
      published_price_cents: null,
      published_display_name: null,
    })
    .eq("sku", sku)
    .neq("status", "archived")
    .select("id");
  if (archived.error || !archived.data?.length) {
    redirect("/admin/products?error=delete");
  }

  if (dbId) {
    const remaining = await supabase
      .from("product_variants")
      .select("id")
      .eq("product_id", dbId)
      .neq("status", "archived");
    if (!remaining.error && (remaining.data?.length ?? 0) === 0) {
      await supabase
        .from("products")
        .update({
          status: "archived",
          published_payload: null,
          has_unpublished_changes: false,
        })
        .eq("id", dbId);
    }
  }

  const imageRow = await getDraftWebsite(`product_image:${sku}`);
  if (imageRow) {
    await supabase.rpc("save_website_content", {
      doc_key: `product_image:${sku}`,
      payload: { url: "" },
      expected_revision: imageRow.revision,
      do_publish: true,
    });
  }

  refreshSite(sku);
  redirect("/admin/products?deleted=1");
}

export async function deleteWebsiteItemAction(formData: FormData): Promise<void> {
  const session = await getCmsSession();
  if (!session) redirect("/admin/login");

  const kind = String(formData.get("kind") ?? "");
  const index = Number(formData.get("index"));
  const key = kind === "testimonial" ? "testimonials" : kind === "step" ? "order_steps" : "";
  if (!key || !Number.isInteger(index) || index < 0) {
    redirect("/admin/website?error=delete");
  }

  const row = await getDraftWebsite(key);
  const list = Array.isArray(row?.draft_payload) ? [...row.draft_payload] : [];
  if (!row || index >= list.length) redirect("/admin/website?error=delete");
  list.splice(index, 1);

  const supabase = await createSessionClient();
  const { error } = await supabase.rpc("save_website_content", {
    doc_key: key,
    payload: list,
    expected_revision: row.revision ?? 0,
    do_publish: row.status === "published",
  });
  if (error) redirect("/admin/website?error=delete");

  refreshSite();
  redirect("/admin/website?deleted=1");
}

export async function deleteMediaAction(formData: FormData): Promise<void> {
  const session = await getCmsSession();
  if (!session) redirect("/admin/login");
  const id = String(formData.get("id") ?? "");
  const path = String(formData.get("path") ?? "");
  const supabase = await createSessionClient();
  const used = await supabase
    .from("product_images")
    .select("id")
    .eq("media_id", id)
    .limit(1);
  if (used.data && used.data.length > 0) redirect("/admin/media?error=used");
  const asset = await supabase.from("media_assets").select("public_url").eq("id", id).maybeSingle();
  const photoUrl = asset.data?.public_url;
  if (photoUrl) {
    const photos = await supabase
      .from("website_content")
      .select("draft_payload, published_payload")
      .like("key", "product_image:%");
    const inUse = (photos.data ?? []).some((row) => {
      const draft = row.draft_payload as { url?: string } | null;
      const published = row.published_payload as { url?: string } | null;
      return draft?.url === photoUrl || published?.url === photoUrl;
    });
    if (inUse) redirect("/admin/media?error=used");
  }
  await supabase.storage.from("media").remove([path]);
  await supabase.from("media_assets").delete().eq("id", id);
  revalidatePath("/admin/media");
  redirect("/admin/media");
}
