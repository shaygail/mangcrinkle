"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links: { href: string; label: string; exact?: boolean }[] = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/shop", label: "Shop" },
  { href: "/admin/website", label: "Homepage" },
  { href: "/admin/media", label: "Media Library" },
  { href: "/admin/drafts", label: "Drafts & History" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="CMS sections">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={[
              "px-3 py-2.5 text-[13px] font-bold tracking-wide border transition-colors",
              active
                ? "bg-mang-orange-bright text-mang-brown border-mang-brown"
                : "bg-transparent text-mang-cream/85 border-transparent hover:bg-white/5 hover:text-mang-cream",
            ].join(" ")}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
