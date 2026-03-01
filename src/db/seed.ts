import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { tools, categories } from "./schema";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Create a .env.local file.");
  process.exit(1);
}

const client = postgres(connectionString, { ssl: "require" });
const db = drizzle(client);

const SEED_CATEGORIES = [
  {
    slug: "payments" as const,
    name: "Payments & Commerce",
    description: "Process payments, manage invoices, and handle subscriptions",
    icon: "CreditCard",
    color: "#10B981",
  },
  {
    slug: "communication" as const,
    name: "Communication",
    description: "Send messages, manage channels, and automate outreach",
    icon: "MessageSquare",
    color: "#3B82F6",
  },
  {
    slug: "data" as const,
    name: "Data & Databases",
    description: "Query databases, manage data, and build backends",
    icon: "Database",
    color: "#8B5CF6",
  },
  {
    slug: "devtools" as const,
    name: "Developer Tools",
    description: "Manage repos, track issues, deploy, and monitor",
    icon: "Code",
    color: "#F59E0B",
  },
  {
    slug: "productivity" as const,
    name: "Productivity",
    description: "Calendars, documents, spreadsheets, and project management",
    icon: "Calendar",
    color: "#EC4899",
  },
  {
    slug: "ai-ml" as const,
    name: "AI & ML",
    description: "Access models, run inference, and build AI pipelines",
    icon: "Brain",
    color: "#06B6D4",
  },
  {
    slug: "content" as const,
    name: "Content & Media",
    description: "Images, videos, file management, and media processing",
    icon: "Image",
    color: "#F97316",
  },
  {
    slug: "analytics" as const,
    name: "Analytics",
    description: "Track events, analyze traffic, and measure engagement",
    icon: "BarChart3",
    color: "#6366F1",
  },
];

async function seed() {
  console.log("Seeding database...\n");

  // Seed categories
  console.log("Seeding categories...");
  for (const cat of SEED_CATEGORIES) {
    await db
      .insert(categories)
      .values(cat)
      .onConflictDoUpdate({
        target: categories.slug,
        set: { name: cat.name, description: cat.description, icon: cat.icon, color: cat.color },
      });
  }
  console.log(`  ✓ ${SEED_CATEGORIES.length} categories\n`);

  // Load tools from JSON
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const toolsPath = resolve(__dirname, "../data/tools.json");
  const toolsData = JSON.parse(readFileSync(toolsPath, "utf-8"));

  console.log("Seeding tools...");

  // Delete existing tools and re-insert (clean slate)
  await db.delete(tools);

  for (const tool of toolsData) {
    await db.insert(tools).values({
      id: tool.id,
      name: tool.name,
      slug: tool.slug,
      description: tool.description,
      longDescription: tool.longDescription,
      category: tool.category,
      author: tool.author,
      pricing: tool.pricing,
      rating: tool.rating,
      reviewCount: tool.reviewCount,
      installCount: tool.installCount,
      weeklyInstalls: tool.weeklyInstalls,
      version: tool.version,
      lastUpdated: new Date(tool.lastUpdated).toISOString(),
      createdAt: new Date(tool.createdAt).toISOString(),
      tags: tool.tags,
      features: tool.features,
      githubUrl: tool.githubUrl || null,
      docsUrl: tool.docsUrl || null,
      iconBg: tool.iconBg,
      verified: tool.verified,
      trending: tool.trending,
      featured: tool.featured,
      compatibility: tool.compatibility,
      npmPackage: tool.npmPackage || null,
      installCommand: tool.installCommand || "npx",
      envVars: tool.envVars || null,
    });
  }

  console.log(`  ✓ ${toolsData.length} tools\n`);
  console.log("Seeding complete!");

  await client.end();
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
