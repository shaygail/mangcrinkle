import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { getHomepage, getProducts } from "@/lib/content/public";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage();
  return {
    title: "Mang Crinkle | Filipino-Inspired Crinkles",
    description: homepage.siteDescription,
  };
}

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [products, homepage] = await Promise.all([
    getProducts(),
    getHomepage(),
  ]);

  return (
    <ProductsProvider initialProducts={products}>
      <CartProvider>
        <AnnouncementBar text={homepage.announcementText} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </CartProvider>
    </ProductsProvider>
  );
}
