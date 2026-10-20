import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Server-only Drizzle client for the native CMS.
 * Uses a small pool suitable for Vercel serverless.
 */
function createClient() {
  const url = process.env.CMS_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!url) {
    return null;
  }

  const client = postgres(url, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  return drizzle(client, { schema });
}

export type CmsDb = NonNullable<ReturnType<typeof createClient>>;

const globalForDb = globalThis as unknown as { __mangCmsDb?: CmsDb | null };

export function getDb(): CmsDb | null {
  if (globalForDb.__mangCmsDb !== undefined) {
    return globalForDb.__mangCmsDb;
  }
  const db = createClient();
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__mangCmsDb = db;
  }
  return db;
}

export function isCmsDatabaseConfigured(): boolean {
  return Boolean(process.env.CMS_DATABASE_URL ?? process.env.DATABASE_URL);
}
