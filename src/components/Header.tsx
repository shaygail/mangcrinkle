"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Menu" },
  { href: "#about", label: "About" },
  { href: "#order", label: "How to Order" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-mang-cream border-b-2 border-mang-brown/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button
            className="lg:hidden p-2 -ml-2 text-mang-brown"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
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

          <Link href="/" className="flex-shrink-0 text-center">
            <span className="menu-logo text-2xl lg:text-3xl leading-none block">
              Mang Crinkle
            </span>
            <span className="menu-logo-sub text-sm lg:text-base leading-none block">
              made to crave
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
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
            onClick={openCart}
            className="relative p-2 flex items-center gap-2 text-mang-brown hover:text-mang-orange transition-colors"
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
              <span className="absolute -top-1 -right-1 bg-mang-orange text-mang-brown text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border border-mang-brown">
                {itemCount}
              </span>
            )}
            <span className="hidden sm:inline text-sm font-bold">
              Cart ({itemCount})
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-mang-brown/15 bg-mang-cream fade-in">
          <nav className="flex flex-col py-4 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-3 text-sm font-bold uppercase tracking-wider text-mang-brown hover:text-mang-orange border-b border-mang-brown/10 last:border-0"
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
