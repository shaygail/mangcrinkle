"use client";

import { useActionState, type ReactNode } from "react";
import { saveShopAction, type EditorState } from "@/app/admin/content-actions";
import type { ShopPageContent } from "@/data/shop-page";

const initial: EditorState = {};

export default function ShopEditor({
  shopPage,
  revision = 0,
  notice,
}: {
  shopPage: ShopPageContent;
  revision?: number;
  notice?: string;
}) {
  const [state, action, pending] = useActionState(saveShopAction, initial);

  return (
    <form action={action} className="mx-auto max-w-3xl space-y-6">
      <input type="hidden" name="revision" value={revision} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-mang-brown-mid/70">
          Shop
        </p>
        <h1 className="mt-2 font-display text-[44px] leading-none tracking-wide">
          Edit the shop
        </h1>
        <p className="mt-3 text-[15px] text-mang-brown-mid">
          The title at the top of the shop, and the heading for each section. Product names and photos are on the Products page.
        </p>
      </div>

      <Section title="Shop page">
        <Text label="Shop title" name="shopTitle" defaultValue={shopPage.title} />
        <Text label="Shop subtitle" name="shopSubtitle" defaultValue={shopPage.subtitle} />
        <Area label="Shop introduction" name="shopDescription" defaultValue={shopPage.description} />
      </Section>

      <Section title="Sections">
        {shopPage.sections
          .filter((section) => section.sectionKey !== "hot-drinks")
          .map((section) => (
            <div key={section.sectionKey} className="space-y-3 border border-mang-tan p-3">
              <input type="hidden" name="sectionKey" value={section.sectionKey} />
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-mang-brown-mid">
                {section.sectionKey}
              </p>
              <Text label="Section title" name={`sectionTitle:${section.sectionKey}`} defaultValue={section.title} />
              <Area
                label="Section text"
                name={`sectionSubtitle:${section.sectionKey}`}
                defaultValue={section.subtitle}
              />
            </div>
          ))}
      </Section>

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
          Publish shop
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4 border border-mang-brown/20 bg-white p-5">
      <h2 className="font-display text-[28px] tracking-wide">{title}</h2>
      {children}
    </section>
  );
}

function Text({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.16em]">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="w-full border border-mang-brown/25 px-3 py-2.5 text-[15px]"
      />
    </label>
  );
}

function Area({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.16em]">{label}</span>
      <textarea
        name={name}
        rows={3}
        defaultValue={defaultValue}
        className="w-full border border-mang-brown/25 px-3 py-2.5 text-[15px]"
      />
    </label>
  );
}
