import { createSessionClient, isSupabaseConfigured } from "@/lib/supabase/clients";

export async function getCmsSession(): Promise<{ email: string; name: string } | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSessionClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;
  const { data } = await supabase
    .from("cms_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) return null;
  const email = user.email ?? "admin";
  return { email, name: email };
}
