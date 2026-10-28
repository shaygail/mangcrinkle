import ProductManager from "@/components/admin/ProductManager";
import { getAdminProducts } from "@/lib/supabase/catalog";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ deleted?: string; error?: string }>;
}) {
  const query = (await Promise.resolve(searchParams ?? {})) as {
    deleted?: string;
    error?: string;
  };
  const products = await getAdminProducts();
  const notice = query.deleted
    ? "Deleted. That item is off the shop."
    : query.error
      ? "Couldn’t delete that item. Reload and try again."
      : undefined;
  return <ProductManager products={products} notice={notice} />;
}
