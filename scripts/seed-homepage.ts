/**
 * Seeds homepage content, testimonials, and order steps into Strapi.
 *
 * Usage: npx tsx scripts/seed-homepage.ts
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import {
  fallbackHomepage,
  fallbackOrderSteps,
  fallbackTestimonials,
} from "../src/data/homepage";

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

  if (!strapiUrl || !token) {
    console.error("STRAPI_URL and STRAPI_API_TOKEN are required in .env.local");
    process.exit(1);
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const homepagePayload = {
    data: {
      announcementText: fallbackHomepage.announcementText,
      heroTitle: fallbackHomepage.heroTitle,
      heroSubtitle: fallbackHomepage.heroSubtitle,
      heroDescription: fallbackHomepage.heroDescription,
      heroButtonText: fallbackHomepage.heroButtonText,
      heroButtonLink: fallbackHomepage.heroButtonLink,
      tagline: fallbackHomepage.tagline,
      storyTitle: fallbackHomepage.storyTitle,
      storyBody: fallbackHomepage.storyBody,
      storyButtonText: fallbackHomepage.storyButtonText,
      storyMarqueeQuotes: fallbackHomepage.storyMarqueeQuotes.map((text) => ({
        text,
      })),
      howToOrderTitle: fallbackHomepage.howToOrderTitle,
      howToOrderSubtitle: fallbackHomepage.howToOrderSubtitle,
      howToOrderButtonText: fallbackHomepage.howToOrderButtonText,
      testimonialsTitle: fallbackHomepage.testimonialsTitle,
      ctaTitle: fallbackHomepage.ctaTitle,
      ctaBody: fallbackHomepage.ctaBody,
      ctaButtonText: fallbackHomepage.ctaButtonText,
      ctaMarqueeText: fallbackHomepage.ctaMarqueeText,
    },
  };

  console.log("Seeding homepage single type...");
  const homepageRes = await fetch(`${strapiUrl}/api/homepage`, {
    method: "PUT",
    headers,
    body: JSON.stringify(homepagePayload),
  });

  if (!homepageRes.ok) {
    const body = await homepageRes.text();
    console.error(`Homepage seed failed: ${homepageRes.status} ${body}`);
  } else {
    console.log("✓ Homepage content seeded");
  }

  console.log(`Seeding ${fallbackTestimonials.length} testimonials...`);
  for (const [index, testimonial] of fallbackTestimonials.entries()) {
    const res = await fetch(`${strapiUrl}/api/testimonials`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          quote: testimonial.quote,
          author: testimonial.author,
          sortOrder: index + 1,
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`✗ testimonial ${testimonial.author}: ${res.status} ${body}`);
    } else {
      console.log(`✓ testimonial — ${testimonial.author}`);
    }
  }

  console.log(`Seeding ${fallbackOrderSteps.length} order steps...`);
  for (const step of fallbackOrderSteps) {
    const res = await fetch(`${strapiUrl}/api/order-steps`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          stepNumber: step.stepNumber,
          title: step.title,
          emoji: step.emoji,
          description: step.description,
          sortOrder: Number(step.stepNumber),
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`✗ order step ${step.title}: ${res.status} ${body}`);
    } else {
      console.log(`✓ order step — ${step.title}`);
    }
  }

  console.log("\n--- Homepage seed complete ---");
  console.log("Upload heroImage, storyImage, and ctaBackgroundImage in Strapi Admin.");
}

main();
