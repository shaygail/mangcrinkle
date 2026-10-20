import {
  boolean,
  integer,
  jsonb,
  pgSchema,
  text,
  timestamp,
  uuid,
  varchar,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Isolated schema so native CMS tables never collide with Strapi's public tables.
 */
export const cms = pgSchema("cms");

export const productCategories = [
  "crinkle-standard",
  "crinkle-premium",
  "crinkle-signature",
  "crinkle-pack",
  "lava",
  "hot-drink",
  "iced-drink",
] as const;

export type ProductCategory = (typeof productCategories)[number];

export const admins = cms.table("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 120 }).notNull().default("Admin"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const media = cms.table(
  "media",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storageKey: text("storage_key").notNull(),
    url: text("url").notNull(),
    altText: text("alt_text").notNull().default(""),
    mimeType: varchar("mime_type", { length: 120 }).notNull(),
    byteSize: integer("byte_size").notNull().default(0),
    width: integer("width"),
    height: integer("height"),
    createdBy: uuid("created_by").references(() => admins.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("media_storage_key_uidx").on(t.storageKey)]
);

export const products = cms.table(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    /** Stable storefront / cart id (e.g. classic-chocolate, pack-6). */
    productId: varchar("product_id", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    name: varchar("name", { length: 200 }).notNull(),
    category: varchar("category", { length: 40 }).notNull(),
    shortDescription: text("short_description").notNull().default(""),
    fullDescription: text("full_description").notNull().default(""),
    /** Integer minor units (NZD cents). */
    priceCents: integer("price_cents").notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("NZD"),
    isAvailable: boolean("is_available").notNull().default(true),
    onlineOrderingEnabled: boolean("online_ordering_enabled")
      .notNull()
      .default(true),
    featured: boolean("featured").notNull().default(false),
    badge: varchar("badge", { length: 80 }),
    tier: varchar("tier", { length: 80 }),
    note: text("note"),
    ingredients: text("ingredients"),
    allergens: text("allergens"),
    displayOrder: integer("display_order").notNull().default(0),
    shopSortOrder: integer("shop_sort_order").notNull().default(0),
    showInBoxBuilder: boolean("show_in_box_builder").notNull().default(false),
    boxBuilderSortOrder: integer("box_builder_sort_order").notNull().default(0),
    builderTitle: varchar("builder_title", { length: 200 }),
    builderSubtitle: text("builder_subtitle"),
    primaryImageId: uuid("primary_image_id").references(() => media.id),
    /** Unpublished owner edits; never exposed on public APIs. */
    draftPayload: jsonb("draft_payload").$type<Record<string, unknown>>(),
    hasUnpublishedChanges: boolean("has_unpublished_changes")
      .notNull()
      .default(false),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedBy: uuid("updated_by").references(() => admins.id),
  },
  (t) => [
    uniqueIndex("products_product_id_uidx").on(t.productId),
    uniqueIndex("products_slug_uidx").on(t.slug),
    index("products_status_idx").on(t.status),
    index("products_available_idx").on(t.isAvailable),
  ]
);

export const productImages = cms.table(
  "product_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    mediaId: uuid("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "restrict" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("product_images_product_idx").on(t.productId)]
);

/**
 * Single-type style website documents (homepage, shop page, outlet, FAQ, …).
 */
export const siteDocuments = cms.table(
  "site_documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: varchar("key", { length: 80 }).notNull(),
    draftPayload: jsonb("draft_payload")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    publishedPayload: jsonb("published_payload")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    hasUnpublishedChanges: boolean("has_unpublished_changes")
      .notNull()
      .default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedBy: uuid("updated_by").references(() => admins.id),
  },
  (t) => [uniqueIndex("site_documents_key_uidx").on(t.key)]
);

export const contentRevisions = cms.table(
  "content_revisions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entityType: varchar("entity_type", { length: 40 }).notNull(),
    entityId: uuid("entity_id").notNull(),
    revisionNumber: integer("revision_number").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    note: text("note"),
    publishedAt: timestamp("published_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    publishedBy: uuid("published_by").references(() => admins.id),
  },
  (t) => [
    uniqueIndex("content_revisions_entity_rev_uidx").on(
      t.entityType,
      t.entityId,
      t.revisionNumber
    ),
    index("content_revisions_entity_idx").on(t.entityType, t.entityId),
  ]
);

export const publishEvents = cms.table(
  "publish_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entityType: varchar("entity_type", { length: 40 }).notNull(),
    entityId: uuid("entity_id").notNull(),
    action: varchar("action", { length: 40 }).notNull(),
    actorId: uuid("actor_id").references(() => admins.id),
    meta: jsonb("meta").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("publish_events_created_idx").on(t.createdAt)]
);
