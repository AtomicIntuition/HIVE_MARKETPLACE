const CATEGORY_KEYWORDS: Record<string, string[]> = {
  payments: [
    "payment", "stripe", "paypal", "billing", "invoice", "checkout",
    "subscription", "commerce", "shopify", "square", "fintech",
  ],
  communication: [
    "slack", "email", "sms", "messaging", "discord", "telegram",
    "whatsapp", "chat", "notification", "twilio", "sendgrid", "smtp",
  ],
  data: [
    "database", "postgres", "mysql", "mongodb", "redis", "sql",
    "supabase", "firebase", "sqlite", "neon", "airtable", "tinybird",
    "data", "query", "orm",
  ],
  devtools: [
    "github", "git", "docker", "kubernetes", "ci", "cd", "deploy",
    "vercel", "cloudflare", "aws", "testing", "playwright", "puppeteer",
    "browser", "filesystem", "fetch", "http", "sentry", "monitoring",
    "search", "brave", "exa", "crawl",
  ],
  productivity: [
    "notion", "google-drive", "calendar", "todoist", "obsidian",
    "spreadsheet", "document", "note", "wiki", "schedule",
  ],
  "ai-ml": [
    "openai", "anthropic", "llm", "gpt", "claude", "ml", "ai",
    "model", "embedding", "inference", "hugging", "replicate",
    "thinking", "reasoning", "memory", "knowledge",
  ],
  content: [
    "image", "video", "photo", "unsplash", "cloudinary", "youtube",
    "media", "cms", "markdown", "scraping", "firecrawl", "content",
  ],
  analytics: [
    "analytics", "posthog", "mixpanel", "amplitude", "segment",
    "tracking", "funnel", "metric", "dashboard", "google-analytics",
  ],
};

export function classifyCategory(
  name: string,
  description: string,
  topics: string[]
): string {
  const text = `${name} ${description} ${topics.join(" ")}`.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[category] = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        scores[category]++;
      }
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[0][1] > 0 ? sorted[0][0] : "devtools";
}
