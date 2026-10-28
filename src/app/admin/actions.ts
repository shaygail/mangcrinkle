"use server";

import { redirect } from "next/navigation";
import { createSessionClient, isSupabaseConfigured } from "@/lib/supabase/clients";
import { parseLoginForm } from "@/lib/cms/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = parseLoginForm(formData);
  if (!parsed.success) {
    return { error: "Please enter a valid email and password." };
  }
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured yet." };
  }

  const supabase = await createSessionClient();
  const signedIn = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (signedIn.error || !signedIn.data.user) {
    return { error: "Those details don’t match. Please try again." };
  }

  const admin = await supabase
    .from("cms_admins")
    .select("user_id")
    .eq("user_id", signedIn.data.user.id)
    .maybeSingle();
  if (!admin.data) {
    await supabase.auth.signOut();
    return { error: "This account is not a Mang Crinkle administrator." };
  }

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
