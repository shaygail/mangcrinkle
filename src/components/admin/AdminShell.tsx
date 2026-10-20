import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { logoutAction } from "@/app/admin/actions";
import type { CmsSession } from "@/lib/cms/auth";

export default function AdminShell({
  session,
  children,
}: {
  session: CmsSession;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-mang-cream-light text-mang-brown">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        <aside className="hidden w-[240px] shrink-0 flex-col border-r border-mang-brown/20 bg-[#1a120e] text-mang-cream md:flex">
          <div className="border-b border-white/10 px-5 py-6">
            <p className="font-display text-[28px] leading-none tracking-wide text-mang-orange-bright">
              MANG CRINKLE
            </p>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-mang-cream/55">
              Content studio
            </p>
          </div>
          <div className="flex-1 px-3 py-4">
            <AdminNav />
          </div>
          <div className="border-t border-white/10 px-4 py-4 space-y-3">
            <p className="truncate text-[12px] text-mang-cream/60">
              {session.name}
              <br />
              <span className="text-mang-cream/40">{session.email}</span>
            </p>
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full border border-white/20 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-mang-cream/80 hover:bg-white/5"
              >
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-mang-tan bg-mang-cream px-4 py-3 md:px-8">
            <div className="md:hidden">
              <p className="font-display text-xl text-mang-brown">MANG CMS</p>
            </div>
            <p className="hidden text-[12px] font-bold uppercase tracking-[0.18em] text-mang-brown-mid md:block">
              Private bakery admin
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                className="border border-mang-brown/25 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] hover:bg-mang-tan/40"
              >
                Preview site
              </Link>
              <form action={logoutAction} className="md:hidden">
                <button
                  type="submit"
                  className="border border-mang-brown/25 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em]"
                >
                  Out
                </button>
              </form>
            </div>
          </header>

          <div className="border-b border-mang-tan bg-mang-cream px-4 py-2 md:hidden">
            <AdminNav />
          </div>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
