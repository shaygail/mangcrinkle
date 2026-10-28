import { notFound } from "next/navigation";
import ProductEditor from "@/components/admin/ProductEditor";
import { getAdminProduct } from "@/lib/supabase/catalog";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ saved?: string; published?: string }>;
}) {
  const { id } = await params;
  const query = (await Promise.resolve(searchParams ?? {})) as {
    saved?: string;
    published?: string;
  };
  const product = await getAdminProduct(id);
  if (!product) notFound();
  const notice = query.published
    ? "Published. The website now shows this version."
    : query.saved
      ? "Draft saved. The website stays the same until you publish."
      : undefined;
  return <ProductEditor product={product} notice={notice} />;
}
