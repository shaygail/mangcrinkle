import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { isSupabaseConfigured } from "@/lib/supabase/clients";
import { getCmsSession } from "@/lib/supabase/session";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <AdminShell session={{ email: "Not connected", name: "Supabase" }}>
        <p className="max-w-xl border border-mang-brown/20 bg-white px-4 py-3 text-[14px]">
          Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, run the
          SQL migration, then sign in.
        </p>
      </AdminShell>
    );
  }

  const session = await getCmsSession();
  if (!session) redirect("/admin/login");
  return <AdminShell session={session}>{children}</AdminShell>;
}
