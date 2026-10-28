"use client";

import { useActionState } from "react";
import Link from "next/link";
import { deleteProductAction, saveProductAction, type EditorState } from "@/app/admin/content-actions";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import type { Product } from "@/types";

const categories: { id: Product["category"]; label: string }[] = [
  { id: "crinkle-standard", label: "Standard crinkle" },
  { id: "crinkle-premium", label: "Premium crinkle" },
  { id: "crinkle-signature", label: "Signature crinkle" },
  { id: "crinkle-pack", label: "Crinkle pack" },
  { id: "lava", label: "Lava crinkle" },
  { id: "iced-drink", label: "Iced drink" },
];

const initial: EditorState = {};

export default function ProductEditor({
  product,
  notice,
}: {
  product?: Product;
  notice?: string;
}) {
  const [state, action, pending] = useActionState(saveProductAction, initial);
  const isNew = !product;

  return (
    <>
    <form action={action} className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-mang-brown-mid/70">
          {isNew ? "New item" : "Edit item"}
        </p>
        <h1 className="mt-2 font-display text-[44px] leading-none tracking-wide">
          {product?.name ?? "Add to the shop"}
        </h1>
      </div>

      {product ? <input type="hidden" name="existingId" value={product.id} /> : null}
      {product?.dbId ? <input type="hidden" name="dbId" value={product.dbId} /> : null}
      <input type="hidden" name="revision" value={product?.revision ?? 0} />
      {product?.lineSlug ? <input type="hidden" name="lineSlug" value={product.lineSlug} /> : null}
      {product?.lineName ? <input type="hidden" name="lineName" value={product.lineName} /> : null}
      {product?.categorySlug ? <input type="hidden" name="categorySlug" value={product.categorySlug} /> : null}

      <div className="space-y-4 border border-mang-brown/20 bg-white p-5">
        <Field label="Name" name="name" defaultValue={product?.name ?? ""} required />
        <Field
          label="Price (NZD)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={product ? String(product.price) : ""}
          required
        />
        <label className="block space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em]">Type</span>
          <select
            name="category"
            defaultValue={product?.category ?? "crinkle-standard"}
            className="w-full border border-mang-brown/25 bg-white px-3 py-2.5 text-[15px]"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em]">Description</span>
          <textarea
            name="description"
            required
            rows={4}
            defaultValue={product?.description ?? ""}
            className="w-full border border-mang-brown/25 px-3 py-2.5 text-[15px]"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em]">Full description</span>
          <textarea
            name="fullDescription"
            rows={4}
            defaultValue={product?.fullDescription ?? ""}
            className="w-full border border-mang-brown/25 px-3 py-2.5 text-[15px]"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em]">Ingredients</span>
          <textarea
            name="ingredients"
            rows={3}
            defaultValue={product?.ingredients ?? ""}
            className="w-full border border-mang-brown/25 px-3 py-2.5 text-[15px]"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em]">Allergens</span>
          <textarea
            name="allergens"
            rows={2}
            defaultValue={product?.allergens ?? ""}
            className="w-full border border-mang-brown/25 px-3 py-2.5 text-[15px]"
          />
        </label>
        <Field
          label="Photo"
          name="image"
          defaultValue={product?.image ?? ""}
          hint="A site path such as /images/figma/signature-ube.jpg, or a full image URL."
        />
        <Field label="Badge" name="badge" defaultValue={product?.badge ?? ""} hint="Shown on the card, e.g. Signature." />
        <Field label="Note" name="note" defaultValue={product?.note ?? ""} />
        <div className="flex flex-col gap-2 text-[14px]">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="available" defaultChecked={product?.available !== false} />
            Available to order
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featuredOnShop" defaultChecked={Boolean(product?.featuredOnShop)} />
            Featured on the shop
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="showInBoxBuilder" defaultChecked={Boolean(product?.showInBoxBuilder)} />
            Can be chosen in the box builder
          </label>
        </div>
      </div>

      {product?.variants && product.variants.length > 1 ? (
        <div className="space-y-3 border border-mang-brown/20 bg-white p-5">
          <h2 className="font-display text-[28px] tracking-wide">Pack prices</h2>
          <p className="text-[13px] text-mang-brown-mid">
            Same flavour only. Mixed packs stay off.
          </p>
          {product.variants.map((variant) => (
            <div key={variant.sku} className="grid gap-2 sm:grid-cols-[1fr_140px] sm:items-end">
              <input type="hidden" name="variantSku" value={variant.sku} />
              <input type="hidden" name={`variantLabel:${variant.sku}`} value={variant.label} />
              <input type="hidden" name={`variantPack:${variant.sku}`} value={variant.packSize} />
              <input type="hidden" name={`variantName:${variant.sku}`} value={variant.displayName} />
              <input type="hidden" name={`variantCategory:${variant.sku}`} value={variant.category} />
              <input type="hidden" name={`variantAvailable:${variant.sku}`} value={variant.available ? "on" : ""} />
              <p className="text-[14px] font-bold">{variant.label}</p>
              <input
                name={`variantPrice:${variant.sku}`}
                type="number"
                step="0.01"
                min="0"
                defaultValue={variant.price.toFixed(2)}
                className="border border-mang-brown/25 px-3 py-2 text-[15px]"
              />
            </div>
          ))}
        </div>
      ) : null}

      <details className="border border-mang-brown/20 bg-mang-cream px-5 py-4">
        <summary className="cursor-pointer text-[13px] font-extrabold uppercase tracking-[0.14em]">
          Advanced
        </summary>
        <div className="mt-4 space-y-4">
          <Field
            label="Link id"
            name="productId"
            defaultValue={product?.id ?? ""}
            hint="Used in the website address. Leave blank on a new item to create one from the name."
          />
          <Field label="Tier" name="tier" defaultValue={product?.tier ?? ""} />
          <Field label="Pack builder title" name="builderTitle" defaultValue={product?.builderTitle ?? ""} />
          <Field label="Pack builder subtitle" name="builderSubtitle" defaultValue={product?.builderSubtitle ?? ""} />
        </div>
      </details>

      {state.error ? (
        <p className="border border-mang-brown/20 bg-mang-tan/50 px-3 py-2 text-[14px]" role="alert">
          {state.error}
        </p>
      ) : null}
      {notice ? (
        <p className="border border-mang-brown/20 bg-white px-3 py-2 text-[14px]" role="status">
          {notice}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          name="intent"
          value="draft"
          disabled={pending}
          className="border border-mang-brown bg-mang-orange-bright px-4 py-3 text-[12px] font-extrabold uppercase tracking-[0.16em] disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save draft"}
        </button>
        <button
          type="submit"
          name="intent"
          value="publish"
          disabled={pending}
          className="border border-mang-brown px-4 py-3 text-[12px] font-extrabold uppercase tracking-[0.16em] disabled:opacity-60"
        >
          Publish
        </button>
        {product ? (
          <Link
            href={`/admin/preview/${product.id}`}
            className="border border-mang-brown/30 px-4 py-3 text-[12px] font-extrabold uppercase tracking-[0.16em]"
          >
            Preview draft
          </Link>
        ) : null}
        <Link href="/admin/products" className="px-4 py-3 text-[12px] font-bold uppercase tracking-[0.16em] text-mang-brown-mid">
          Back to list
        </Link>
      </div>
    </form>
    {product ? (
      <form action={deleteProductAction} className="mx-auto max-w-3xl">
        <input type="hidden" name="sku" value={product.id} />
        <input type="hidden" name="dbId" value={product.dbId ?? ""} />
        <ConfirmSubmit
          message={`Delete ${product.name}? It will leave the shop and this list.`}
          className="border border-mang-brown/40 px-4 py-3 text-[12px] font-extrabold uppercase tracking-[0.16em] text-mang-brown"
        >
          Delete this item
        </ConfirmSubmit>
      </form>
    ) : null}
    </>
  );
}

function Field({
  label,
  name,
  defaultValue,
  hint,
  type = "text",
  required,
  step,
  min,
}: {
  label: string;
  name: string;
  defaultValue: string;
  hint?: string;
  type?: string;
  required?: boolean;
  step?: string;
  min?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.16em]">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        step={step}
        min={min}
        defaultValue={defaultValue}
        className="w-full border border-mang-brown/25 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-mang-brown"
      />
      {hint ? <span className="block text-[12px] text-mang-brown-mid">{hint}</span> : null}
    </label>
  );
}
