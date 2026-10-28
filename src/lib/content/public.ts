import {
  getPublishedCopy,
  getPublishedHomepage,
  getPublishedOrderSteps,
  getPublishedOutlet,
  getPublishedProducts,
  getPublishedShopPage,
  getPublishedTestimonials,
} from "@/lib/supabase/catalog";

export async function getProducts() {
  return getPublishedProducts();
}

export async function getHomepage() {
  return getPublishedHomepage();
}

export async function getShopPage() {
  return getPublishedShopPage();
}

export async function getStorefrontCopy() {
  return getPublishedCopy();
}

export async function getStoreOutlet() {
  return getPublishedOutlet();
}

export async function getTestimonials() {
  return getPublishedTestimonials();
}

export async function getOrderSteps() {
  return getPublishedOrderSteps();
}
