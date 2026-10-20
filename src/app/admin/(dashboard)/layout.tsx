import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getSession, isCmsAuthConfigured } from "@/lib/cms/auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isCmsAuthConfigured()) {
    // Allow viewing the shell only when auth env is missing in local bootstrap.
    // Production must set CMS auth vars — login will still be required once set.
  }

  const session = await getSession();
  if (!session) {
    if (isCmsAuthConfigured()) {
      redirect("/admin/login");
    }
    // Dev bootstrap session so UI can be reviewed before secrets are set.
    return (
      <AdminShell
        session={{
          email: "setup@mangcrinkle.local",
          name: "Setup mode",
        }}
      >
        <div className="mb-6 border border-mang-brown/20 bg-mang-tan/50 px-4 py-3 text-[13px] text-mang-brown-mid">
          CMS auth env vars are not set yet. You can preview the admin UI locally;
          add <code>CMS_AUTH_SECRET</code>, <code>CMS_ADMIN_EMAIL</code>, and{" "}
          <code>CMS_ADMIN_PASSWORD_HASH</code> before deploying.
        </div>
        {children}
      </AdminShell>
    );
  }

  return <AdminShell session={session}>{children}</AdminShell>;
}
