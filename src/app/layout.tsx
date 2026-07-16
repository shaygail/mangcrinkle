import type { Metadata } from "next";
import { Bebas_Neue, Open_Sans } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { getProducts } from "@/lib/strapi";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Mang Crinkle | Filipino-Inspired Crinkles",
  description:
    "Handcrafted Filipino-inspired crinkles, soft-centred and fudgy. Order crinkles, lava crinkles, and drinks online.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const products = await getProducts();

  return (
    <html lang="en" className={`${bebasNeue.variable} ${openSans.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <ProductsProvider initialProducts={products}>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
