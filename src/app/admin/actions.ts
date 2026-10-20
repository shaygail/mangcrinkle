"use server";

import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  parseLoginForm,
  verifyAdminCredentials,
} from "@/lib/cms/auth";

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

  try {
    const session = await verifyAdminCredentials(
      parsed.data.email,
      parsed.data.password
    );
    if (!session) {
      return { error: "Those details don’t match. Please try again." };
    }
    await createSession(session);
  } catch {
    return {
      error:
        "Sign-in isn’t configured yet. Add CMS auth environment variables first.",
    };
  }

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
