import { Category } from "./types";

export const SITE_CONFIG = {
  name: "Hive Market",
  description:
    "The marketplace for MCP-compatible tools. Discover, connect, and power your AI agents with thousands of integrations.",
  url: "https://market.hive.sh",
  hiveUrl: "https://hive.sh",
  ogImage: "/og/default.png",
  creator: "@hivemarketplace",
} as const;

export const COLORS = {
  primary: "#F59E0B",
  secondary: "#0F172A",
  accent: "#8B5CF6",
  background: "#030712",
  surface: "#111827",
  surfaceHover: "#1F2937",
  border: "#1F2937",
  text: "#F9FAFB",
  textMuted: "#9CA3AF",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  categories: {
    payments: "#10B981",
    communication: "#3B82F6",
    data: "#8B5CF6",
    devtools: "#F59E0B",
    productivity: "#EC4899",
    "ai-ml": "#06B6D4",
    content: "#F97316",
    analytics: "#6366F1",
  },
} as const;

export const CATEGORIES: Category[] = [
  {
    name: "Payments & Commerce",
    slug: "payments",
    description: "Process payments, manage invoices, and handle subscriptions",
    icon: "CreditCard",
    color: COLORS.categories.payments,
    toolCount: 4,
  },
  {
    name: "Communication",
    slug: "communication",
    description: "Send messages, manage channels, and automate outreach",
    icon: "MessageSquare",
    color: COLORS.categories.communication,
    toolCount: 5,
  },
  {
    name: "Data & Databases",
    slug: "data",
    description: "Query databases, manage data, and build backends",
    icon: "Database",
    color: COLORS.categories.data,
    toolCount: 4,
  },
  {
    name: "Developer Tools",
    slug: "devtools",
    description: "Manage repos, track issues, deploy, and monitor",
    icon: "Code",
    color: COLORS.categories.devtools,
    toolCount: 5,
  },
  {
    name: "Productivity",
    slug: "productivity",
    description: "Calendars, documents, spreadsheets, and project management",
    icon: "Calendar",
    color: COLORS.categories.productivity,
    toolCount: 4,
  },
  {
    name: "AI & ML",
    slug: "ai-ml",
    description: "Access models, run inference, and build AI pipelines",
    icon: "Brain",
    color: COLORS.categories["ai-ml"],
    toolCount: 4,
  },
  {
    name: "Content & Media",
    slug: "content",
    description: "Images, videos, file management, and media processing",
    icon: "Image",
    color: COLORS.categories.content,
    toolCount: 3,
  },
  {
    name: "Analytics",
    slug: "analytics",
    description: "Track events, analyze traffic, and measure engagement",
    icon: "BarChart3",
    color: COLORS.categories.analytics,
    toolCount: 3,
  },
];

export const STATS = [
  { label: "MCP Tools Published", value: "500+" },
  { label: "Developers", value: "12,000+" },
  { label: "API Calls / Month", value: "2M+" },
] as const;
