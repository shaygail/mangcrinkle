"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

const desktopLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/", label: "Our Story" },
  { href: "/#order", label: "Pickup Guide" },
];

export default function Header() {
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-mang-cream-light border-b border-mang-cream">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-20">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-[73px]">
          <Link href="/" className="min-w-0">
            <span className="menu-logo text-2xl sm:text-[28px] lg:text-[32px] leading-none block tracking-wide">
              Mang Crinkle
            </span>
            <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.12em] text-mang-brown-mid leading-none block mt-0.5">
              Made to Crave
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
            <nav className="hidden lg:flex items-center gap-6">
              {desktopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold uppercase tracking-wide text-mang-brown-mid hover:text-mang-brown transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center min-h-11 px-4 py-2.5 rounded-full border-[1.5px] border-mang-brown bg-mang-cream text-[13px] font-bold text-mang-brown hover:bg-mang-tan transition-colors"
            >
              Menu
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="inline-flex items-center gap-2 min-h-11 px-4 py-2.5 rounded-full bg-mang-brown text-mang-cream text-[12px] sm:text-[13px] font-bold shadow-[0_3px_0_rgba(61,36,24,0.2)] hover:bg-mang-brown-mid transition-colors"
              aria-label="Open box"
            >
              <span aria-hidden>🛒</span>
              <span>Box ({itemCount})</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
