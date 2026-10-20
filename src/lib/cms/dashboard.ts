import { count, desc, eq } from "drizzle-orm";
import { getDb, isCmsDatabaseConfigured } from "@/db";
import { products, siteDocuments } from "@/db/schema";

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

const emptyStats = (status: DashboardStats["websiteStatus"]): DashboardStats => ({
  databaseReady: false,
  publishedProducts: 0,
  draftProducts: 0,
  unpublishedProductEdits: 0,
  websiteDrafts: 0,
  recentDrafts: [],
  websiteStatus: status,
});

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isCmsDatabaseConfigured()) {
    return emptyStats("not_configured");
  }

  const db = getDb();
  if (!db) {
    return emptyStats("not_configured");
  }

  try {
    const [publishedRow] = await db
      .select({ value: count() })
      .from(products)
      .where(eq(products.status, "published"));

    const [draftRow] = await db
      .select({ value: count() })
      .from(products)
      .where(eq(products.status, "draft"));

    const [unpublishedRow] = await db
      .select({ value: count() })
      .from(products)
      .where(eq(products.hasUnpublishedChanges, true));

    const [websiteDraftRow] = await db
      .select({ value: count() })
      .from(siteDocuments)
      .where(eq(siteDocuments.hasUnpublishedChanges, true));

    const recentProducts = await db
      .select({
        id: products.id,
        title: products.name,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .where(eq(products.hasUnpublishedChanges, true))
      .orderBy(desc(products.updatedAt))
      .limit(5);

    const publishedProducts = Number(publishedRow?.value ?? 0);
    const draftProducts = Number(draftRow?.value ?? 0);
    const unpublishedProductEdits = Number(unpublishedRow?.value ?? 0);
    const websiteDrafts = Number(websiteDraftRow?.value ?? 0);

    return {
      databaseReady: true,
      publishedProducts,
      draftProducts,
      unpublishedProductEdits,
      websiteDrafts,
      recentDrafts: recentProducts.map((p) => ({
        id: p.id,
        title: p.title,
        kind: "product" as const,
        updatedAt: p.updatedAt.toISOString(),
      })),
      websiteStatus:
        unpublishedProductEdits + websiteDrafts > 0
          ? "needs_attention"
          : "live",
    };
  } catch {
    // Schema not migrated yet, or DB unreachable — keep admin usable.
    return emptyStats("not_configured");
  }
}
