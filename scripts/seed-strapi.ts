/**
 * One-off seed script: POSTs fallbackProducts into Strapi.
 *
 * Usage:
 *   npx tsx scripts/seed-strapi.ts
 *
 * Requires STRAPI_URL and STRAPI_API_TOKEN in the environment
 * (or a local .env.local — load manually / via your shell).
 * Images are skipped; upload them in the Strapi admin after seeding.
 */

import { fallbackProducts } from "../src/data/products";

async function main() {
  const strapiUrl = process.env.STRAPI_URL;
  const token = process.env.STRAPI_API_TOKEN;

  if (!strapiUrl) {
    console.error("STRAPI_URL is required");
    process.exit(1);
  }
  if (!token) {
    console.error("STRAPI_API_TOKEN is required");
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
