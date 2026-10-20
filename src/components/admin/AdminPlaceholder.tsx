import Link from "next/link";

export default function AdminPlaceholder({
  title,
  body,
  ctaHref = "/admin",
  ctaLabel = "Back to overview",
}: {
  title: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-mang-brown-mid/70">
        Coming next
      </p>
      <h1 className="font-display text-[44px] leading-none tracking-wide text-mang-brown">
        {title}
      </h1>
      <p className="text-[15px] leading-relaxed text-mang-brown-mid">{body}</p>
      <Link
        href={ctaHref}
        className="inline-flex border border-mang-brown bg-mang-orange-bright px-4 py-3 text-[12px] font-extrabold uppercase tracking-[0.16em] text-mang-brown"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
