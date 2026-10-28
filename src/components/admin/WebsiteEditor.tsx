"use client";

import { useActionState, type ReactNode } from "react";
import { deleteWebsiteItemAction, saveWebsiteAction, type EditorState } from "@/app/admin/content-actions";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import type { HomepageContent, HomepageTestimonial, OrderStep } from "@/data/homepage";
import type { ShopPageContent } from "@/data/shop-page";
import type { StoreOutlet } from "@/data/store-outlet";
import type { StorefrontCopy } from "@/data/storefront-copy";

const initial: EditorState = {};

export default function WebsiteEditor({
  homepage,
  shopPage,
  outlet,
  copy,
  testimonials,
  orderSteps,
  revision = 0,
  notice,
}: {
  homepage: HomepageContent;
  shopPage: ShopPageContent;
  outlet: StoreOutlet;
  copy: StorefrontCopy;
  testimonials: HomepageTestimonial[];
  orderSteps: OrderStep[];
  revision?: number;
  notice?: string;
}) {
  const [state, action, pending] = useActionState(saveWebsiteAction, initial);

  return (
    <>
    <form action={action} className="mx-auto max-w-3xl space-y-6">
      <input type="hidden" name="revision" value={revision} />
      <input type="hidden" name="heroImage" value={homepage.heroImage} />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-mang-brown-mid/70">
          Website
        </p>
        <h1 className="mt-2 font-display text-[44px] leading-none tracking-wide">
          Edit the website
        </h1>
        <p className="mt-3 text-[15px] text-mang-brown-mid">
          These words are stored in Supabase. Save a draft, then publish when the live site should change.
        </p>
      </div>

      <Section title="Announcement & homepage">
        <Text label="Announcement" name="announcementText" defaultValue={homepage.announcementText} />
        <Text label="Headline" name="heroTitle" defaultValue={homepage.heroTitle} />
        <Text label="Subheadline" name="heroSubtitle" defaultValue={homepage.heroSubtitle} />
        <Area label="Hero description" name="heroDescription" defaultValue={homepage.heroDescription} />
        <Text label="Hero button" name="heroButtonText" defaultValue={homepage.heroButtonText} />
        <Text label="Fan favourites heading" name="bestSellersTitle" defaultValue={homepage.bestSellersTitle} />
      </Section>

      <Section title="Story & closing banner">
        <Text label="Story title" name="storyTitle" defaultValue={homepage.storyTitle} />
        <Area label="Story" name="storyBody" defaultValue={homepage.storyBody} />
        <Text label="Banner title" name="ctaTitle" defaultValue={homepage.ctaTitle} />
        <Area label="Banner text" name="ctaBody" defaultValue={homepage.ctaBody} />
        <Text label="Footer line" name="footerTagline" defaultValue={homepage.footerTagline} />
        <Area label="Search description" name="siteDescription" defaultValue={homepage.siteDescription} />
      </Section>

      <Section title="Shop page">
        <Text label="Shop title" name="shopTitle" defaultValue={shopPage.title} />
        <Text label="Shop subtitle" name="shopSubtitle" defaultValue={shopPage.subtitle} />
        <Area label="Shop introduction" name="shopDescription" defaultValue={shopPage.description} />
        {shopPage.sections
          .filter((section) => section.sectionKey !== "hot-drinks")
          .map((section) => (
          <div key={section.sectionKey} className="space-y-3 border border-mang-tan p-3">
            <input type="hidden" name="sectionKey" value={section.sectionKey} />
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-mang-brown-mid">
              {section.sectionKey}
            </p>
            <Text label="Section title" name={`sectionTitle:${section.sectionKey}`} defaultValue={section.title} />
            <Area label="Section text" name={`sectionSubtitle:${section.sectionKey}`} defaultValue={section.subtitle} />
          </div>
        ))}
      </Section>

      <Section title="Pickup">
        <Text label="Pickup name" name="outletName" defaultValue={outlet.name} />
        <Text label="Hours" name="outletHours" defaultValue={outlet.hours} />
        <Area label="Address" name="outletAddress" defaultValue={outlet.address} />
        <Area label="Pickup note" name="pickupNote" defaultValue={outlet.pickupNote} />
      </Section>

      <Section title="How to order">
        {orderSteps.map((step, index) => (
          <div key={step.id} className="space-y-3 border border-mang-tan p-3">
            <Text label={`Step ${step.stepNumber} title`} name={`stepTitle:${index}`} defaultValue={step.title} />
            <Area label="Step text" name={`stepDescription:${index}`} defaultValue={step.description} />
            <ConfirmSubmit
              form={`delete-step-${index}`}
              message={`Delete step ${step.stepNumber}?`}
              className="text-[12px] font-bold uppercase tracking-[0.14em] text-mang-brown"
            >
              Delete step
            </ConfirmSubmit>
          </div>
        ))}
      </Section>

      <Section title="Customer quotes">
        {testimonials.map((item, index) => (
          <div key={item.id} className="space-y-3 border border-mang-tan p-3">
            <Area label="Quote" name={`quote:${index}`} defaultValue={item.quote} />
            <Text label="Name" name={`author:${index}`} defaultValue={item.author} />
            <ConfirmSubmit
              form={`delete-quote-${index}`}
              message="Delete this quote?"
              className="text-[12px] font-bold uppercase tracking-[0.14em] text-mang-brown"
            >
              Delete quote
            </ConfirmSubmit>
          </div>
        ))}
      </Section>

      <Section title="Cart & confirmation">
        <Text label="Cart heading" name="cartTitle" defaultValue={copy.cartTitle} />
        <Area label="Empty cart message" name="cartEmptyBody" defaultValue={copy.cartEmptyBody} />
        <Area label="Confirmation message" name="confirmationBody" defaultValue={copy.confirmationBody} />
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
          Publish homepage
        </button>
      </div>
    </form>
    {orderSteps.map((step, index) => (
      <form id={`delete-step-${index}`} key={`delete-step-${step.id}`} action={deleteWebsiteItemAction}>
        <input type="hidden" name="kind" value="step" />
        <input type="hidden" name="index" value={index} />
      </form>
    ))}
    {testimonials.map((item, index) => (
      <form id={`delete-quote-${index}`} key={`delete-quote-${item.id}`} action={deleteWebsiteItemAction}>
        <input type="hidden" name="kind" value="testimonial" />
        <input type="hidden" name="index" value={index} />
      </form>
    ))}
    </>
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

function Text({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
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

function Area({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
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
