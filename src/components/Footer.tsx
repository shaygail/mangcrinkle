"use client";

import Link from "next/link";
import Button from "@/components/Button";

export default function Footer() {
  return (
    <footer className="bg-mang-brown text-mang-cream">
      <div className="border-b border-mang-cream/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="menu-title-3d text-3xl lg:text-4xl mb-2 !text-mang-orange">
            Join the Crinkle Club
          </h2>
          <p className="text-mang-cream/75 mb-6 max-w-lg mx-auto">
            Get first dibs on new flavours, seasonal drops, and crinkle news.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Email Address"
              className="flex-1 px-4 py-3 rounded-full bg-mang-cream/10 border border-mang-cream/25 text-mang-cream placeholder:text-mang-cream/50 focus:outline-none focus:border-mang-orange"
            />
            <Button type="submit" variant="yellow">
              Subscribe
            </Button>
          </form>
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <a href="#" className="text-mang-cream/70 hover:text-mang-orange transition-colors">
              Instagram
            </a>
            <a href="#" className="text-mang-cream/70 hover:text-mang-orange transition-colors">
              Facebook
            </a>
            <a href="#" className="text-mang-cream/70 hover:text-mang-orange transition-colors">
              TikTok
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold uppercase tracking-wider text-mang-orange mb-4">
              Menu
            </h3>
            <ul className="space-y-2 text-mang-cream/75 text-sm">
              <li>
                <Link href="/shop" className="hover:text-mang-orange transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/shop?category=crinkles" className="hover:text-mang-orange transition-colors">
                  Crinkles
                </Link>
              </li>
              <li>
                <Link href="/shop?category=lava" className="hover:text-mang-orange transition-colors">
                  Lava Crinkles
                </Link>
              </li>
              <li>
                <Link href="/shop?category=iced-drinks" className="hover:text-mang-orange transition-colors">
                  Drinks
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold uppercase tracking-wider text-mang-orange mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-mang-cream/75 text-sm">
              <li>
                <Link href="/" className="hover:text-mang-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" className="hover:text-mang-orange transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#order" className="hover:text-mang-orange transition-colors">
                  How to Order
                </a>
              </li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <span className="menu-logo text-3xl leading-none block">Mang Crinkle</span>
            <span className="menu-logo-sub text-base leading-none block mt-1">
              made to crave
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-mang-cream/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-mang-cream/50">
          <p>© 2026, Mang Crinkle</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-mang-cream transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-mang-cream transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
