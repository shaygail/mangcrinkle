import { getDashboardCounts, getDraftWebsite } from "@/lib/supabase/catalog";

export type DashboardStats = {
  databaseReady: boolean;
  publishedProducts: number;
  draftProducts: number;
  unpublishedProductEdits: number;
  websiteDrafts: number;
  recentDrafts: {
    id: string;
    title: string;
    kind: "product" | "website";
    updatedAt: string;
  }[];
  websiteStatus: "live" | "needs_attention" | "not_configured";
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const [counts, homepage] = await Promise.all([
    getDashboardCounts(),
    getDraftWebsite("homepage"),
  ]);
  const websiteDrafts = homepage?.has_unpublished_changes ? 1 : 0;
  return {
    databaseReady: true,
    publishedProducts: counts.publishedProducts,
    draftProducts: counts.draftProducts,
    unpublishedProductEdits: counts.unpublishedProductEdits,
    websiteDrafts,
    recentDrafts: counts.recentDrafts,
    websiteStatus:
      counts.unpublishedProductEdits + websiteDrafts > 0 ? "needs_attention" : "live",
  };
}
