import { isSupabaseConfigured } from "@/lib/supabase/clients";
import { getCmsSession } from "@/lib/supabase/session";
import { getWebsiteSettings } from "@/lib/supabase/catalog";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getCmsSession();
  const settings = isSupabaseConfigured() ? await getWebsiteSettings() : null;

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="font-display text-[44px] leading-none tracking-wide">Settings</h1>
      <dl className="divide-y divide-mang-tan border border-mang-brown/20 bg-white">
        <Row label="Database" value={isSupabaseConfigured() ? "Supabase connected" : "Not configured"} />
        <Row label="Signed in" value={session?.email ?? "No"} />
        <Row label="Currency" value={settings?.currency ?? "NZD"} />
        <Row label="Shop" value={settings?.shop_open === false ? "Closed" : "Open"} />
      </dl>
      <p className="text-[14px] text-mang-brown-mid">
        Only accounts listed in cms_admins can change the shop. Add a Supabase Auth user, then insert their id into cms_admins.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 px-4 py-3 text-[14px]">
      <dt className="font-bold">{label}</dt>
      <dd className="text-mang-brown-mid">{value}</dd>
    </div>
  );
}
