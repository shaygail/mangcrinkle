import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getAdminProduct } from "@/lib/supabase/catalog";

export const dynamic = "force-dynamic";

export default async function PreviewProductPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const product = await getAdminProduct(sku);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-md space-y-4">
      <p className="border border-mang-brown bg-mang-tan px-3 py-2 text-[13px] font-bold">
        Draft preview. Customers cannot see this until you publish.
      </p>
      <ProductCard product={product} />
    </div>
  );
}
