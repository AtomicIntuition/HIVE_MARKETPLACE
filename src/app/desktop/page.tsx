import type { Metadata } from "next";
import { DesktopHero } from "@/components/desktop/hero";
import { DesktopFeatures } from "@/components/desktop/features";
import { DesktopArchitecture } from "@/components/desktop/architecture";
import { DesktopWorkflows } from "@/components/desktop/workflows";
import { DesktopCta } from "@/components/desktop/cta";

export const metadata: Metadata = {
  title: "Hive Desktop — Local AI Agent Workflow Runtime",
  description:
    "Wire MCP tools into persistent, event-driven workflows using natural language. Everything runs locally. Your API keys never leave your machine.",
  openGraph: {
    title: "Hive Desktop — Local AI Agent Workflow Runtime",
    description:
      "Wire MCP tools into persistent, event-driven workflows using natural language. Everything runs locally.",
    url: "https://hive-mcp.vercel.app/desktop",
    type: "website",
  },
};

export default function DesktopPage() {
  return (
    <>
      <DesktopHero />
      <DesktopFeatures />
      <DesktopArchitecture />
      <DesktopWorkflows />
      <DesktopCta />
    </>
  );
}
