import {
  Rocket,
  Cable,
  Upload,
  UserCircle,
  Cpu,
  HelpCircle,
} from "lucide-react";

export const DOCS_NAV = [
  {
    title: "Getting Started",
    href: "/docs",
    icon: Rocket,
    description: "Overview and quick start guide",
  },
  {
    title: "Connecting Tools",
    href: "/docs/connecting-tools",
    icon: Cable,
    description: "Set up MCP tools in your AI client",
  },
  {
    title: "Publishing",
    href: "/docs/publishing",
    icon: Upload,
    description: "Publish your MCP server to Hive Market",
  },
  {
    title: "Account & Dashboard",
    href: "/docs/account",
    icon: UserCircle,
    description: "Manage your profile and submissions",
  },
  {
    title: "MCP Basics",
    href: "/docs/mcp-basics",
    icon: Cpu,
    description: "Understand the Model Context Protocol",
  },
  {
    title: "FAQ",
    href: "/docs/faq",
    icon: HelpCircle,
    description: "Frequently asked questions",
  },
] as const;
