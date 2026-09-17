"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Menu" },
  { href: "/#about", label: "About" },
  { href: "/#order", label: "How to Order" },
];

const navLinkClass =
  "block min-h-11 px-2 py-3 text-sm font-bold uppercase tracking-wider text-mang-brown hover:text-mang-orange border-b border-mang-brown/10 last:border-0 flex items-center";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-mang-cream border-b-2 border-mang-brown/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: fixed side slots so the logo never covers the hamburger */}
        <div className="lg:hidden grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center h-16 gap-1">
          <button
            type="button"
            className="relative z-20 min-h-11 min-w-11 justify-self-start -ml-1 p-2.5 text-mang-brown flex items-center justify-center"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <Link
            href="/"
            className="justify-self-center text-center min-w-0 max-w-full px-1"
            onClick={() => setMenuOpen(false)}
          >
            <span className="menu-logo text-xl sm:text-2xl leading-none block truncate">
              Mang Crinkle
            </span>
            <span className="menu-logo-sub text-xs sm:text-sm leading-none block truncate">
              made to crave
            </span>
          </Link>

          <button
            type="button"
            onClick={openCart}
            className="relative z-20 min-h-11 min-w-11 justify-self-end -mr-1 p-2.5 flex items-center justify-center text-mang-brown hover:text-mang-orange transition-colors"
            aria-label="Open cart"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 bg-mang-orange text-mang-brown text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border border-mang-brown">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Desktop */}
        <div className="hidden lg:flex items-center justify-between h-20">
          <Link href="/" className="flex-shrink-0 text-center">
            <span className="menu-logo text-3xl leading-none block">
              Mang Crinkle
            </span>
            <span className="menu-logo-sub text-base leading-none block">
              made to crave
            </span>
          </Link>

          <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold uppercase tracking-wider text-mang-brown hover:text-mang-orange transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={openCart}
            className="relative min-h-11 min-w-11 p-2.5 flex items-center justify-center gap-2 text-mang-brown hover:text-mang-orange transition-colors"
            aria-label="Open cart"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 bg-mang-orange text-mang-brown text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border border-mang-brown">
                {itemCount}
              </span>
            )}
            <span className="text-sm font-bold">Cart ({itemCount})</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-mang-brown/15 bg-mang-cream fade-in max-h-[calc(100dvh-4rem)] overflow-y-auto relative z-50">
          <nav className="flex flex-col py-2 px-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={navLinkClass}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
