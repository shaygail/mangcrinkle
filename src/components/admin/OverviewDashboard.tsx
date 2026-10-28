import Link from "next/link";
import type { DashboardStats } from "@/lib/cms/dashboard";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="border border-mang-brown/20 bg-white p-5 shadow-[3px_3px_0_rgba(61,36,24,0.08)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-mang-brown-mid/70">
        {label}
      </p>
      <p className="mt-3 font-display text-[42px] leading-none text-mang-brown">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-[13px] text-mang-brown-mid/80">{hint}</p>
      ) : null}
    </div>
  );
}

export default function OverviewDashboard({ stats }: { stats: DashboardStats }) {
  const statusLabel =
    stats.websiteStatus === "live"
      ? "Website live"
      : stats.websiteStatus === "needs_attention"
        ? "Drafts waiting"
        : "CMS not connected";

  const statusTone =
    stats.websiteStatus === "live"
      ? "bg-mang-orange-bright text-mang-brown"
      : stats.websiteStatus === "needs_attention"
        ? "bg-[#1a120e] text-mang-cream"
        : "bg-mang-tan text-mang-brown-mid";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-mang-brown-mid/70">
            Overview
          </p>
          <h1 className="mt-2 font-display text-[44px] leading-none tracking-wide text-mang-brown md:text-[56px]">
            Content studio
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-mang-brown-mid">
            Update products, homepage copy, and photos — then publish when you’re
            ready. Drafts stay private until you say so.
          </p>
        </div>
        <div
          className={`inline-flex items-center gap-2 border border-mang-brown px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.16em] ${statusTone}`}
        >
          <span
            className="size-2 rounded-full bg-current opacity-80"
            aria-hidden
          />
          {statusLabel}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Published"
          value={stats.publishedProducts}
          hint="Visible on the shop"
        />
        <StatCard
          label="Drafts"
          value={stats.draftProducts}
          hint="Not on the website yet"
        />
        <StatCard
          label="Unpublished edits"
          value={stats.unpublishedProductEdits}
          hint="Saved, still private"
        />
        <StatCard
          label="Homepage"
          value={stats.websiteDrafts > 0 ? "Draft" : "Published"}
          hint="Publish homepage separately from products"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="border border-mang-brown/20 bg-white p-5 shadow-[3px_3px_0_rgba(61,36,24,0.08)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-[28px] tracking-wide">
            Recent drafts
          </h2>
            <Link
              href="/admin/products"
              className="text-[12px] font-bold uppercase tracking-[0.16em] text-mang-brown-mid underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>

          {stats.recentDrafts.length === 0 ? (
            <div className="mt-6 border border-dashed border-mang-brown/25 bg-mang-cream-light/60 px-4 py-8 text-center">
              <p className="text-[15px] text-mang-brown-mid">
                {stats.databaseReady
                  ? "Open Products & Packs to change prices, photos, and sold-out status."
                  : "Connect the CMS database to see live draft activity."}
              </p>
            </div>
          ) : (
            <ul className="mt-5 divide-y divide-mang-tan">
              {stats.recentDrafts.map((draft) => (
                <li key={draft.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-bold text-mang-brown">{draft.title}</p>
                    <p className="text-[12px] text-mang-brown-mid/70">On the shop</p>
                  </div>
                  <Link
                    href={`/admin/products/${draft.id}`}
                    className="border border-mang-brown bg-mang-orange-bright px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em]"
                  >
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4">
          <div className="border border-mang-brown bg-[#1a120e] p-5 text-mang-cream shadow-[3px_3px_0_rgba(61,36,24,0.18)]">
            <h2 className="font-display text-[28px] tracking-wide text-mang-orange-bright">
              Quick actions
            </h2>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                href="/admin/products/new"
                className="border border-mang-orange-bright bg-mang-orange-bright px-4 py-3 text-center text-[12px] font-extrabold uppercase tracking-[0.16em] text-mang-brown"
              >
                Add product
              </Link>
              <Link
                href="/admin/products"
                className="border border-white/25 px-4 py-3 text-center text-[12px] font-extrabold uppercase tracking-[0.16em] text-mang-cream hover:bg-white/5"
              >
                Edit products
              </Link>
              <Link
                href="/admin/website"
                className="border border-white/25 px-4 py-3 text-center text-[12px] font-extrabold uppercase tracking-[0.16em] text-mang-cream hover:bg-white/5"
              >
                Edit homepage
              </Link>
              <Link
                href="/"
                target="_blank"
                className="border border-white/25 px-4 py-3 text-center text-[12px] font-extrabold uppercase tracking-[0.16em] text-mang-cream hover:bg-white/5"
              >
                Preview website
              </Link>
            </div>
          </div>

          <div className="border border-mang-brown/20 bg-mang-cream p-5">
            <h2 className="text-[13px] font-extrabold uppercase tracking-[0.16em]">
              Publishing tip
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-mang-brown-mid">
              Drafts stay in Supabase until you publish. Published products and homepage copy are what the shop shows.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
