import "dotenv/config";
import { defineConfig } from "drizzle-kit";

/**
 * Native CMS migrations target schema `cms` on the Railway Postgres instance.
 * Prefer CMS_DATABASE_URL; fall back to DATABASE_URL for local setup.
 * Never point this at a client-exposed variable.
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.CMS_DATABASE_URL ?? process.env.DATABASE_URL ?? "",
  },
  schemaFilter: ["cms"],
  strict: true,
  verbose: true,
});
