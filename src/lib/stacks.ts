export interface Stack {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
  toolSlugs: string[];
  popular: boolean;
}

export const STACKS: Stack[] = [
  {
    id: "vibe-coder-starter",
    name: "Vibe Coder Starter",
    slug: "vibe-coder-starter",
    description: "Essential MCPs for AI-assisted development. Search docs, manage files, reason through problems, and remember context.",
    longDescription: "The foundation stack for any developer using AI coding tools. Context7 gives your agent up-to-date library documentation instead of hallucinated APIs. Sequential Thinking helps break down complex architecture decisions. Memory creates a persistent knowledge graph across sessions. Filesystem and GitHub round it out with direct project access.",
    icon: "Zap",
    color: "#8B5CF6",
    toolSlugs: ["filesystem", "github", "sequential-thinking", "memory", "context7", "brave-search"],
    popular: true,
  },
  {
    id: "full-stack-dev",
    name: "Full-Stack Dev",
    slug: "full-stack-dev",
    description: "Everything you need for modern full-stack development. Database, deployment, testing, and serverless Postgres.",
    longDescription: "Built for the Next.js / Supabase / Vercel developer. Your AI agent can query your Supabase database, deploy to Vercel, run Playwright tests, manage Docker containers, and spin up serverless Postgres with Neon. Stop switching between terminals — let your agent handle the infrastructure.",
    icon: "Layers",
    color: "#3B82F6",
    toolSlugs: ["supabase", "vercel", "playwright", "docker", "neon", "fetch"],
    popular: true,
  },
  {
    id: "saas-builder",
    name: "SaaS Builder",
    slug: "saas-builder",
    description: "Ship a SaaS product with payments, email, team chat, project management, and error tracking.",
    longDescription: "Everything you need to build and run a SaaS product. Stripe handles payments and subscriptions. Slack keeps your team in sync. Linear manages your roadmap. Sentry catches production errors before your users do. Add email notifications and you've got a complete ops stack for your AI agent.",
    icon: "Rocket",
    color: "#F59E0B",
    toolSlugs: ["stripe", "slack", "linear", "sentry", "email-smtp"],
    popular: true,
  },
  {
    id: "content-creator",
    name: "Content Creator",
    slug: "content-creator",
    description: "Create and manage content with Notion, Google Drive, stock photos, and video transcripts.",
    longDescription: "For content teams and solo creators who want AI to help with the full content pipeline. Pull research from Notion and Google Drive, grab stock photos from Unsplash, transcribe YouTube videos for repurposing, and manage your knowledge base in Obsidian. Your AI agent becomes your content co-pilot.",
    icon: "Palette",
    color: "#EC4899",
    toolSlugs: ["notion", "google-drive", "unsplash", "youtube-transcript", "obsidian"],
    popular: false,
  },
  {
    id: "e-commerce",
    name: "E-Commerce",
    slug: "e-commerce",
    description: "Run your online store with payments, product management, and media handling.",
    longDescription: "A complete e-commerce operations stack. Stripe and PayPal handle payments from every angle. Shopify manages your storefront and products. Cloudinary optimizes your product images. Let your AI agent handle inventory updates, process refunds, and generate product descriptions.",
    icon: "ShoppingCart",
    color: "#10B981",
    toolSlugs: ["stripe", "shopify", "paypal", "cloudinary"],
    popular: false,
  },
  {
    id: "data-analytics",
    name: "Data & Analytics",
    slug: "data-analytics",
    description: "Query databases, track events, build dashboards, and manage data at scale.",
    longDescription: "For data-driven teams. Query your PostgreSQL database directly. Pipe events through Tinybird for real-time analytics. Manage structured data in Airtable. Your AI agent can run complex queries, build reports, and surface insights without you writing SQL.",
    icon: "BarChart3",
    color: "#06B6D4",
    toolSlugs: ["postgresql", "tinybird", "airtable", "sqlite"],
    popular: false,
  },
  {
    id: "devops-infra",
    name: "DevOps & Infra",
    slug: "devops-infra",
    description: "Manage containers, edge workers, deployments, and cloud infrastructure.",
    longDescription: "Infrastructure management through your AI agent. Deploy to Cloudflare Workers at the edge. Manage Docker containers. Push to Vercel. Monitor with Sentry. Your agent can handle the entire CI/CD pipeline, check deployment status, and roll back if something goes wrong.",
    icon: "Server",
    color: "#EF4444",
    toolSlugs: ["docker", "cloudflare", "vercel", "sentry"],
    popular: false,
  },
  {
    id: "web-scraping",
    name: "Web Scraping & Research",
    slug: "web-scraping",
    description: "Crawl websites, search the web, automate browsers, and extract data at scale.",
    longDescription: "Turn your AI agent into a research machine. Firecrawl handles large-scale web scraping. Brave Search and Exa provide different search paradigms — traditional and AI-native semantic. Puppeteer and Browserbase give you browser automation. Fetch grabs individual pages. Perfect for competitive research, lead generation, and data collection.",
    icon: "Globe",
    color: "#8B5CF6",
    toolSlugs: ["firecrawl", "brave-search", "exa-search", "puppeteer", "fetch", "browserbase"],
    popular: true,
  },
];
