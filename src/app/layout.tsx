import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Open_Sans } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { getHomepage, getProducts } from "@/lib/strapi";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage();
  return {
    title: "Mang Crinkle | Filipino-Inspired Crinkles",
    description: homepage.siteDescription,
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [products, homepage] = await Promise.all([
    getProducts(),
    getHomepage(),
  ]);

  return (
    <html lang="en" className={`${bebasNeue.variable} ${openSans.variable}`}>
      <body className="min-h-screen flex flex-col antialiased overflow-x-hidden">
        <ProductsProvider initialProducts={products}>
          <CartProvider>
            <AnnouncementBar text={homepage.announcementText} />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
