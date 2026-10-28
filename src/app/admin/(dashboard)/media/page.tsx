import { deleteMediaAction, updateAltTextAction, uploadMediaAction } from "@/app/admin/content-actions";
import { listMedia } from "@/lib/supabase/catalog";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; saved?: string }>;
}) {
  const query = (await Promise.resolve(searchParams ?? {})) as {
    error?: string;
    saved?: string;
  };
  const media = await listMedia();
  const error =
    query.error === "size"
      ? "Images must be 5MB or smaller."
      : query.error === "type"
        ? "Upload a JPEG, PNG, or WebP image."
        : query.error === "used"
          ? "That photo is still used by a product."
          : query.error
            ? "The upload did not finish."
            : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-mang-brown-mid/70">
          Library
        </p>
        <h1 className="mt-2 font-display text-[44px] leading-none tracking-wide">Media</h1>
      </div>
      {error ? <p className="border border-mang-brown/20 bg-mang-tan/50 px-3 py-2 text-[14px]">{error}</p> : null}
      {query.saved ? <p className="border border-mang-brown/20 bg-white px-3 py-2 text-[14px]">Saved.</p> : null}
      <form action={uploadMediaAction} className="flex flex-col gap-3 border border-mang-brown/20 bg-white p-5 sm:flex-row sm:items-end">
        <label className="block flex-1 space-y-1.5 text-[14px]">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em]">Image</span>
          <input name="file" type="file" accept="image/*" required />
        </label>
        <label className="block flex-1 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em]">Alt text</span>
          <input name="alt" className="w-full border border-mang-brown/25 px-3 py-2" />
        </label>
        <button type="submit" className="border border-mang-brown bg-mang-orange-bright px-4 py-3 text-[12px] font-extrabold uppercase tracking-[0.16em]">
          Upload
        </button>
      </form>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((item) => (
          <li key={item.id} className="border border-mang-brown/20 bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.public_url} alt={item.alt_text} className="h-40 w-full object-cover" />
            <form action={updateAltTextAction} className="mt-3 space-y-2">
              <input type="hidden" name="id" value={item.id} />
              <input name="alt" defaultValue={item.alt_text} className="w-full border border-mang-brown/25 px-2 py-1.5 text-[14px]" />
              <button type="submit" className="text-[12px] font-bold uppercase tracking-[0.14em]">Save alt text</button>
            </form>
            <form action={deleteMediaAction} className="mt-2">
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="path" value={item.storage_path} />
              <button type="submit" className="text-[12px] font-bold uppercase tracking-[0.14em] text-mang-brown-mid">Delete</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
