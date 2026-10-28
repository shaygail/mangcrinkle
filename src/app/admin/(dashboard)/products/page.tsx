import ProductManager from "@/components/admin/ProductManager";
import { getAdminProducts } from "@/lib/supabase/catalog";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();
  return <ProductManager products={products} />;
}
