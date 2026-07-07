import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-mang-brown text-mang-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
          <div>
            <h3 className="font-bold uppercase tracking-wider text-mang-orange mb-4">
              Socials
            </h3>
            <ul className="space-y-2 text-mang-cream/75 text-sm">
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mang-orange transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mang-orange transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mang-orange transition-colors"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1 text-center md:text-left">
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
