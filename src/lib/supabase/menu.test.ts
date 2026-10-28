import assert from "node:assert/strict";
import test from "node:test";
import { centsToDollars, confirmedMenu, dollarsToCents } from "./menu";

test("confirmed menu prices are integer cents and packs are single flavour", () => {
  const variants = confirmedMenu.flatMap((line) => line.variants);
  assert.equal(confirmedMenu.every((line) => line.allowsMixedFlavours === false), true);

  const priceOf = (sku: string) => variants.find((item) => item.sku === sku)?.priceCents;

  assert.equal(priceOf("drink-ube-matcha"), 1250);
  assert.equal(priceOf("drink-ube-latte"), 1150);
  assert.equal(priceOf("drink-iced-chocolate"), 1100);
  assert.equal(priceOf("classic-chocolate"), 400);
  assert.equal(priceOf("classic-ube-pack-3"), 1100);
  assert.equal(priceOf("classic-mint-pack-6"), 2100);
  assert.equal(priceOf("classic-red-velvet-pack-12"), 4000);
  assert.equal(priceOf("crunch-pistachio"), 500);
  assert.equal(priceOf("crunch-ube-matcha-pack-3"), 1400);
  assert.equal(priceOf("crunch-pistachio-pack-6"), 2700);
  assert.equal(priceOf("lava-champorado"), 950);
  assert.equal(priceOf("lava-ube"), 950);
  assert.equal(priceOf("crunch-pistachio-pack-12"), undefined);
  assert.equal(priceOf("lava-ube-pack-3"), undefined);
  assert.equal(variants.every((item) => Number.isInteger(item.priceCents)), true);
});

test("dollar conversion matches checkout boundary", () => {
  assert.equal(centsToDollars(1250), 12.5);
  assert.equal(centsToDollars(400), 4);
  assert.equal(dollarsToCents(9.5), 950);
  assert.equal(dollarsToCents(11.5), 1150);
});
