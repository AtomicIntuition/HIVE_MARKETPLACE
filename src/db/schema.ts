import {
  pgTable,
  text,
  varchar,
  real,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// Enums
export const categorySlugEnum = pgEnum("category_slug", [
  "payments",
  "communication",
  "data",
  "devtools",
  "productivity",
  "ai-ml",
  "content",
  "analytics",
]);

export const pricingModelEnum = pgEnum("pricing_model", [
  "free",
  "per-call",
  "monthly",
  "tiered",
]);

export const submissionStatusEnum = pgEnum("submission_status", [
  "pending",
  "approved",
  "rejected",
]);

// Types for JSONB columns
export interface ToolAuthorJson {
  name: string;
  username: string;
  avatar?: string;
  verified: boolean;
}

export interface ToolPricingJson {
  model: "free" | "per-call" | "monthly" | "tiered";
  price?: number;
  unit?: string;
  freeTier?: string;
}

// Tables
export const tools = pgTable(
  "tools",
  {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description").notNull(),
    longDescription: text("long_description").notNull(),
    category: categorySlugEnum("category").notNull(),
    author: jsonb("author").$type<ToolAuthorJson>().notNull(),
    pricing: jsonb("pricing").$type<ToolPricingJson>().notNull(),
    rating: real("rating").notNull().default(0),
    reviewCount: integer("review_count").notNull().default(0),
    installCount: integer("install_count").notNull().default(0),
    weeklyInstalls: integer("weekly_installs").notNull().default(0),
    version: varchar("version", { length: 50 }).notNull(),
    lastUpdated: timestamp("last_updated", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    tags: text("tags").array().notNull().default([]),
    features: text("features").array().notNull().default([]),
    githubUrl: text("github_url"),
    docsUrl: text("docs_url"),
    iconBg: varchar("icon_bg", { length: 20 }).notNull().default("#8B5CF6"),
    verified: boolean("verified").notNull().default(false),
    trending: boolean("trending").notNull().default(false),
    featured: boolean("featured").notNull().default(false),
    compatibility: text("compatibility").array().notNull().default([]),
    npmPackage: varchar("npm_package", { length: 255 }),
  },
  (table) => [
    uniqueIndex("tools_slug_idx").on(table.slug),
    index("tools_category_idx").on(table.category),
    index("tools_rating_idx").on(table.rating),
    index("tools_install_count_idx").on(table.installCount),
    index("tools_featured_idx").on(table.featured),
    index("tools_trending_idx").on(table.trending),
  ]
);

export const categories = pgTable("categories", {
  slug: categorySlugEnum("slug").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  color: varchar("color", { length: 20 }).notNull(),
});

export const reviews = pgTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    toolId: text("tool_id")
      .notNull()
      .references(() => tools.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    authorName: varchar("author_name", { length: 255 }).notNull(),
    authorUsername: varchar("author_username", { length: 255 }).notNull(),
    rating: integer("rating").notNull(),
    text: text("text").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    helpful: integer("helpful").notNull().default(0),
  },
  (table) => [
    index("reviews_tool_id_idx").on(table.toolId),
    index("reviews_user_id_idx").on(table.userId),
    uniqueIndex("reviews_user_tool_idx").on(table.userId, table.toolId),
  ]
);

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(), // matches Supabase auth user UUID
  username: varchar("username", { length: 100 }),
  displayName: varchar("display_name", { length: 255 }),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  website: text("website"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export const toolSubmissions = pgTable("tool_submissions", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description").notNull(),
  category: categorySlugEnum("category").notNull(),
  author: jsonb("author").$type<ToolAuthorJson>().notNull(),
  pricing: jsonb("pricing").$type<ToolPricingJson>().notNull(),
  tags: text("tags").array().notNull().default([]),
  features: text("features").array().notNull().default([]),
  githubUrl: text("github_url"),
  docsUrl: text("docs_url"),
  npmPackage: varchar("npm_package", { length: 255 }),
  iconBg: varchar("icon_bg", { length: 20 }).notNull().default("#8B5CF6"),
  compatibility: text("compatibility").array().notNull().default([]),
  version: varchar("version", { length: 50 }).notNull().default("1.0.0"),
  submittedBy: text("submitted_by")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  status: submissionStatusEnum("status").notNull().default("pending"),
  submittedAt: timestamp("submitted_at", { mode: "string" }).notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at", { mode: "string" }),
});

export const userConnections = pgTable(
  "user_connections",
  {
    userId: text("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    toolId: text("tool_id")
      .notNull()
      .references(() => tools.id, { onDelete: "cascade" }),
    connectedAt: timestamp("connected_at", { mode: "string" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("user_connections_pk").on(table.userId, table.toolId),
  ]
);
