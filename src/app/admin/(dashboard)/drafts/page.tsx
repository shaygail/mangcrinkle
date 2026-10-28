import Link from "next/link";
import { getAdminProducts } from "@/lib/supabase/catalog";
import { createSessionClient } from "@/lib/supabase/clients";

export const dynamic = "force-dynamic";

export default async function AdminDraftsPage() {
  const products = (await getAdminProducts()).filter(
    (product) => product.status !== "published" || product.hasUnpublishedChanges
  );
  const supabase = await createSessionClient();
  const revisions = await supabase
    .from("content_revisions")
    .select("entity_type, revision_number, published_at")
    .order("published_at", { ascending: false })
    .limit(8);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-[44px] leading-none tracking-wide">Drafts & history</h1>
      <ul className="divide-y divide-mang-tan border border-mang-brown/20 bg-white">
        {products.map((product) => (
          <li key={product.id} className="flex items-center justify-between px-4 py-3">
            <span className="font-bold">{product.name}</span>
            <Link href={`/admin/products/${product.id}`} className="text-[12px] font-bold uppercase tracking-[0.14em]">
              Edit
            </Link>
          </li>
        ))}
        {products.length === 0 ? <li className="px-4 py-6 text-[14px]">No drafts waiting.</li> : null}
      </ul>
      <section>
        <h2 className="font-display text-[28px]">Published revisions</h2>
        <ul className="mt-3 divide-y divide-mang-tan border border-mang-brown/20 bg-white">
          {(revisions.data ?? []).map((revision, index) => (
            <li key={`${revision.entity_type}-${revision.revision_number}-${index}`} className="px-4 py-3 text-[14px]">
              {revision.entity_type} · revision {revision.revision_number}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
