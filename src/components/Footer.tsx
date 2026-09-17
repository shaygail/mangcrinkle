import Link from "next/link";
import { getHomepage } from "@/lib/strapi";

const footerLinkClass =
  "block min-h-11 py-1.5 flex items-center text-sm text-mang-brown-mid hover:text-mang-brown transition-colors";

export default async function Footer() {
  const homepage = await getHomepage();

  return (
    <footer className="bg-mang-cream border-t border-mang-tan text-mang-brown">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-20 pt-10 sm:pt-14 lg:pt-20 pb-10">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-10 lg:gap-16">
          <div className="text-center lg:text-left lg:max-w-xs">
            <span className="menu-logo text-3xl leading-none block">
              {homepage.heroTitle}
            </span>
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-mang-brown-mid block mt-1">
              {homepage.footerTagline}
            </span>
            <p className="mt-4 text-sm text-mang-brown-mid leading-relaxed hidden lg:block">
              {homepage.siteDescription}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 sm:gap-10 lg:gap-16 text-left">
            <div>
              <h3 className="font-bold text-[12px] uppercase tracking-wide text-mang-brown mb-3">
                Menu
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/shop" className={footerLinkClass}>
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=crinkles"
                    className={footerLinkClass}
                  >
                    Signature Ube
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=packs" className={footerLinkClass}>
                    Packs &amp; Bundles
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[12px] uppercase tracking-wide text-mang-brown mb-3">
                Explore
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/" className={footerLinkClass}>
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/#order" className={footerLinkClass}>
                    How to Order
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className={footerLinkClass}>
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[12px] uppercase tracking-wide text-mang-brown mb-3">
                Socials
              </h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className={footerLinkClass}>
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className={footerLinkClass}>
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className={footerLinkClass}>
                    TikTok
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-mang-tan flex flex-col items-center gap-3 text-[12px] text-mang-brown-mid/80">
          <p>© 2026 Mang Crinkle. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-mang-brown transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-mang-brown transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
