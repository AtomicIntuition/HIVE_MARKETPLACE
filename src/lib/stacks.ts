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
    description: "The must-have starter pack for AI-assisted development. Real-time docs, structured reasoning, persistent memory, and project access.",
    longDescription: "The foundation every AI coder needs. Context7 gives your agent real-time library documentation so it stops hallucinating APIs. Sequential Thinking forces step-by-step reasoning on complex architecture decisions instead of jumping to conclusions. Memory persists context across sessions — your agent remembers past decisions and project conventions. Filesystem and GitHub give it direct access to your code and repos. Brave Search fills the gaps when your agent needs to look something up. Install this stack first, then add domain-specific tools on top.",
    icon: "Zap",
    color: "#8B5CF6",
    toolSlugs: ["context7-mcp", "sequential-thinking-mcp", "memory-mcp", "filesystem-mcp", "github-mcp", "brave-search-mcp"],
    popular: true,
  },
  {
    id: "full-stack-web",
    name: "Full-Stack Web App",
    slug: "full-stack-web",
    description: "End-to-end web development: database, auth, deployment, testing, error monitoring, and payments.",
    longDescription: "The complete stack for shipping a modern web app. Supabase handles your Postgres database, auth, and file storage in one place. Vercel deploys your frontend with preview URLs on every PR. Playwright runs your end-to-end tests so your agent can verify its own changes. Sentry catches production errors before your users report them. Stripe handles payments when you're ready to monetize. GitHub ties it all together with PRs, code review, and CI. This is the stack for Next.js, Remix, or any modern framework.",
    icon: "Layers",
    color: "#3B82F6",
    toolSlugs: ["supabase-mcp", "vercel-mcp", "github-mcp", "playwright-mcp", "sentry-mcp", "stripe-mcp"],
    popular: true,
  },
  {
    id: "saas-operations",
    name: "SaaS Operations",
    slug: "saas-operations",
    description: "Run your SaaS day-to-day: billing, issue tracking, team alerts, error monitoring, analytics, and transactional email.",
    longDescription: "Built for the SaaS operator who wants their AI agent handling daily ops. Stripe manages subscriptions, invoices, and revenue reporting. Linear tracks your roadmap, sprints, and bugs — your agent can triage issues and update status. Slack pipes alerts to the right channels and handles customer comms. Sentry surfaces production errors with full stack traces. PostHog tracks product usage, funnels, and feature flags so you know what's working. Email SMTP sends transactional emails like password resets and billing receipts. Together, these six tools cover the full SaaS operations loop.",
    icon: "Rocket",
    color: "#F59E0B",
    toolSlugs: ["stripe-mcp", "linear-mcp", "slack-mcp", "sentry-mcp", "posthog-mcp", "email-smtp-mcp"],
    popular: true,
  },
  {
    id: "web-research",
    name: "Web Research & Scraping",
    slug: "web-research",
    description: "Turn your agent into a research machine: web crawling, search engines, browser automation, and data extraction.",
    longDescription: "Everything your agent needs to gather information from the web. Firecrawl handles large-scale crawling — point it at a site and get structured data back. Brave Search and Exa Search give you two complementary search approaches: traditional keyword search and AI-native semantic search that understands intent. Puppeteer automates browsers for JavaScript-heavy sites that need rendering. Browserbase runs those browser sessions in the cloud so you don't burn local resources. Fetch handles simple HTTP requests when you just need to grab a page or call an API. Perfect for competitive analysis, lead generation, market research, and content aggregation.",
    icon: "Globe",
    color: "#8B5CF6",
    toolSlugs: ["firecrawl-mcp", "brave-search-mcp", "exa-search-mcp", "puppeteer-mcp", "browserbase-mcp", "fetch-mcp"],
    popular: true,
  },
  {
    id: "e-commerce",
    name: "E-Commerce",
    slug: "e-commerce",
    description: "Complete online store operations: payments, storefront, product images, order emails, and store analytics.",
    longDescription: "Run your online store through your AI agent. Stripe and PayPal cover payment processing from both sides — cards, wallets, and invoices. Shopify manages your storefront, products, inventory, and orders. Cloudinary handles product image optimization, resizing, and CDN delivery. SendGrid sends order confirmations, shipping updates, and marketing emails. Google Analytics tracks your store traffic, conversions, and revenue. Your agent can update inventory, process refunds, generate product descriptions, and pull sales reports — all without leaving the conversation.",
    icon: "ShoppingCart",
    color: "#10B981",
    toolSlugs: ["stripe-mcp", "shopify-mcp", "paypal-mcp", "cloudinary-mcp", "sendgrid-mcp", "google-analytics-mcp"],
    popular: false,
  },
  {
    id: "data-analytics",
    name: "Data & Analytics",
    slug: "data-analytics",
    description: "Query databases, track product usage, monitor web traffic, and manage structured data.",
    longDescription: "For data-driven teams that want their AI agent querying and analyzing without context-switching. PostgreSQL gives direct SQL access to your production or analytics database. SQLite handles local and embedded databases for lightweight queries and prototyping. Tinybird provides real-time analytics APIs over streaming data. PostHog tracks product analytics, user sessions, and feature flags. Google Analytics covers web traffic, acquisition, and conversion funnels. Airtable manages structured datasets, lookup tables, and operational data your team maintains. Your agent can run complex joins, build reports, correlate metrics across platforms, and surface insights.",
    icon: "BarChart3",
    color: "#06B6D4",
    toolSlugs: ["postgresql-mcp", "sqlite-mcp", "tinybird-mcp", "posthog-mcp", "google-analytics-mcp", "airtable-mcp"],
    popular: false,
  },
  {
    id: "devops-infra",
    name: "DevOps & Infrastructure",
    slug: "devops-infra",
    description: "Containers, edge workers, deployments, error monitoring, and CI/CD — all through your agent.",
    longDescription: "Infrastructure management without the terminal hopping. Docker builds and manages your containers — your agent can spin up services, check logs, and restart crashed containers. Cloudflare handles edge deployments, Workers, DNS, and CDN configuration. Vercel manages your frontend deployments with preview URLs and environment variables. Sentry monitors production errors and performance regressions with full context. GitHub ties into your CI/CD pipeline — your agent can check workflow runs, merge PRs, and trigger deploys. Five tools that cover the deploy-monitor-fix loop end to end.",
    icon: "Server",
    color: "#EF4444",
    toolSlugs: ["docker-mcp", "cloudflare-mcp", "vercel-mcp", "sentry-mcp", "github-mcp"],
    popular: false,
  },
  {
    id: "content-marketing",
    name: "Content & Marketing",
    slug: "content-marketing",
    description: "Content creation pipeline: planning, writing, stock photos, video research, image optimization, and email distribution.",
    longDescription: "The full content pipeline for creators and marketing teams. Notion is your content calendar and draft workspace — your agent can create pages, update status, and pull research. Google Drive connects to your team's shared docs and files. Unsplash provides free high-quality stock photography for blog posts and social media. YouTube lets your agent pull video transcripts for repurposing content across formats. Cloudinary optimizes and transforms images for every platform and screen size. SendGrid handles email newsletters and campaign distribution. From ideation to publication to distribution, your agent manages the entire content lifecycle.",
    icon: "Palette",
    color: "#EC4899",
    toolSlugs: ["notion-mcp", "google-drive-mcp", "unsplash-mcp", "youtube-mcp", "cloudinary-mcp", "sendgrid-mcp"],
    popular: false,
  },
];

export function getAllStacks(): Stack[] {
  return STACKS;
}

export function getStackBySlug(slug: string): Stack | undefined {
  return STACKS.find((s) => s.slug === slug);
}

export function getPopularStacks(): Stack[] {
  return STACKS.filter((s) => s.popular);
}
