"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { deleteProductAction } from "@/app/admin/content-actions";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import type { Product } from "@/types";

const categoryLabels: Record<Product["category"], string> = {
  "crinkle-standard": "Standard crinkle",
  "crinkle-premium": "Premium crinkle",
  "crinkle-signature": "Signature crinkle",
  "crinkle-pack": "Crinkle pack",
  lava: "Lava",
  "hot-drink": "Hot drink",
  "iced-drink": "Iced drink",
};

export default function ProductManager({
  products,
  notice,
  embedded = false,
}: {
  products: Product[];
  notice?: string;
  embedded?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesQuery =
        !needle ||
        product.name.toLowerCase().includes(needle) ||
        product.description.toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [products, query, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-mang-brown-mid/70">
            Shop database
          </p>
          {embedded ? (
            <h2 className="mt-2 font-display text-[36px] leading-none tracking-wide text-mang-brown">
              Products
            </h2>
          ) : (
            <h1 className="mt-2 font-display text-[44px] leading-none tracking-wide text-mang-brown">
              Products & packs
            </h1>
          )}
          <p className="mt-3 max-w-xl text-[15px] text-mang-brown-mid">
            Add a product, then open it to change the name, price, or photo. Publish when it should appear on the shop. Delete takes that item off the shop.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex border border-mang-brown bg-mang-orange-bright px-4 py-3 text-[12px] font-extrabold uppercase tracking-[0.16em] text-mang-brown"
        >
          Add product
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the shop"
          className="w-full border border-mang-brown/25 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-mang-brown sm:max-w-sm"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="border border-mang-brown/25 bg-white px-3 py-2.5 text-[15px]"
        >
          <option value="all">All types ({products.length})</option>
          {Object.entries(categoryLabels)
            .filter(([id]) => id !== "hot-drink")
            .map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {notice ? (
        <p className="border border-mang-brown/20 bg-white px-3 py-2 text-[14px]" role="status">
          {notice}
        </p>
      ) : null}

      <ul className="divide-y divide-mang-tan border border-mang-brown/20 bg-white">
        {visible.map((product) => {
          const available = product.available !== false;
          return (
            <li key={product.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt=""
                  className="size-14 shrink-0 border border-mang-brown/20 object-cover"
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="font-bold text-mang-brown">{product.name}</p>
                <p className="mt-1 text-[13px] text-mang-brown-mid">
                  {categoryLabels[product.category]} · ${product.price.toFixed(2)}
                  {product.status === "published" ? " · Published" : " · Draft"}
                  {available ? "" : " · Sold out"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="border border-mang-brown bg-mang-orange-bright px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-mang-brown"
                >
                  Edit
                </Link>
                <form action={deleteProductAction}>
                  <input type="hidden" name="sku" value={product.id} />
                  <input type="hidden" name="dbId" value={product.dbId ?? ""} />
                  <ConfirmSubmit
                    message={`Delete ${product.name}? It will leave the shop and this list.`}
                    className="border border-mang-brown/40 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-mang-brown"
                  >
                    Delete
                  </ConfirmSubmit>
                </form>
              </div>
            </li>
          );
        })}
        {visible.length === 0 ? (
          <li className="px-4 py-8 text-center text-[14px] text-mang-brown-mid">
            Nothing matches that search.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
