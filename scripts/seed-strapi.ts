/**
 * One-off seed script: POSTs fallbackProducts into Strapi.
 *
 * Usage:
 *   npx tsx scripts/seed-strapi.ts
 *
 * Reads STRAPI_URL and STRAPI_API_TOKEN from .env.local (or the shell).
 * Images are skipped; upload them in the Strapi admin after seeding.
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { fallbackProducts } from "../src/data/products";

function loadEnvLocal() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, "utf8").replace(/^\uFEFF/, "");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key && !process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

async function main() {
  const strapiUrl = process.env.STRAPI_URL;
  const token = process.env.STRAPI_API_TOKEN;

  if (!strapiUrl) {
    console.error("STRAPI_URL is required");
    process.exit(1);
  }
  if (!token) {
    console.error("STRAPI_API_TOKEN is required");
    console.error(
      "Create .env.local with STRAPI_URL and STRAPI_API_TOKEN, then re-run."
    );
    process.exit(1);
  }

  // Preflight: Product content type must exist in Strapi Admin first
  const probe = await fetch(`${strapiUrl}/api/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (probe.status === 404) {
    console.error(
      "Strapi returned 404 for /api/products — the Product collection type"
    );
    console.error(
      "has not been created yet. In Strapi Admin → Content-Type Builder,"
    );
    console.error("create Product with fields from data/strapi-product-schema.json");
    process.exit(1);
  }

  const failures: { id: string; error: string }[] = [];

  console.log(`Seeding ${fallbackProducts.length} products to ${strapiUrl}...`);

  for (const product of fallbackProducts) {
    const payload = {
      data: {
        productId: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        ...(product.tier ? { tier: product.tier } : {}),
        ...(product.badge ? { badge: product.badge } : {}),
        ...(product.note ? { note: product.note } : {}),
      },
    };

    try {
      const res = await fetch(`${strapiUrl}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.text();
        const message = `${res.status} ${res.statusText}: ${body}`;
        console.error(`✗ ${product.id}: ${message}`);
        failures.push({ id: product.id, error: message });
        continue;
      }

      console.log(`✓ ${product.id} — ${product.name}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`✗ ${product.id}: ${message}`);
      failures.push({ id: product.id, error: message });
    }
  }

  console.log("\n--- Seed complete ---");
  console.log(
    `Succeeded: ${fallbackProducts.length - failures.length}/${fallbackProducts.length}`
  );

  if (failures.length > 0) {
    console.log("\nFailures:");
    for (const failure of failures) {
      console.log(`  - ${failure.id}: ${failure.error}`);
    }
    process.exit(1);
  }
}

main();
