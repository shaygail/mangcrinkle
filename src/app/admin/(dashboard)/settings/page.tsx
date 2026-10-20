import AdminPlaceholder from "@/components/admin/AdminPlaceholder";
import { getContentSource } from "@/lib/content/source";
import { isCmsDatabaseConfigured } from "@/db";
import { isCmsAuthConfigured } from "@/lib/cms/auth";

export default function AdminSettingsPage() {
  const source = getContentSource();
  const dbReady = isCmsDatabaseConfigured();
  const authReady = isCmsAuthConfigured();

  return (
    <div className="space-y-6">
      <AdminPlaceholder
        title="Settings"
        body="Environment status for the native CMS. Storefront content source stays on Strapi until cutover is approved."
        ctaHref="/admin"
        ctaLabel="Back to overview"
      />
      <dl className="max-w-xl border border-mang-brown/20 bg-white divide-y divide-mang-tan">
        <div className="flex justify-between gap-4 px-4 py-3 text-[14px]">
          <dt className="font-bold">Content source</dt>
          <dd className="text-mang-brown-mid">{source}</dd>
        </div>
        <div className="flex justify-between gap-4 px-4 py-3 text-[14px]">
          <dt className="font-bold">CMS database</dt>
          <dd className="text-mang-brown-mid">
            {dbReady ? "Configured" : "Not set"}
          </dd>
        </div>
        <div className="flex justify-between gap-4 px-4 py-3 text-[14px]">
          <dt className="font-bold">Admin auth</dt>
          <dd className="text-mang-brown-mid">
            {authReady ? "Configured" : "Setup mode"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
