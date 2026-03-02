import { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { DocsHeader } from "@/components/docs/docs-header";

export const metadata: Metadata = createMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about Hive Market, MCP tools, connecting AI clients, and publishing.",
  path: "/docs/faq",
});

const FAQ_ITEMS = [
  {
    question: "What is Hive Market?",
    answer:
      "Hive Market is a marketplace for MCP-compatible tools — integrations that give AI agents like Claude Desktop, Cursor, and Windsurf new capabilities. Think of it as an app store for AI agent tools. You can browse, connect, and review tools, or publish your own MCP servers for others to use.",
  },
  {
    question: "What is MCP?",
    answer:
      "The Model Context Protocol (MCP) is an open protocol created by Anthropic that standardizes how AI applications connect to external tools and data sources. It uses JSON-RPC for communication and supports tools (actions the AI can take), resources (data the AI can read), and prompts (reusable instruction templates).",
  },
  {
    question: "Do I need an account to browse tools?",
    answer:
      "No. You can browse, search, and view all tools on Hive Market without an account. You only need an account to publish tools, leave reviews, or track your connected tools on your dashboard.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Browsing and connecting tools is completely free. Many tools on Hive Market are free and open source. Some creators offer paid tools with per-call or monthly pricing — these are clearly labeled on each tool's listing page.",
  },
  {
    question: "Which AI clients are supported?",
    answer:
      "Hive Market provides configuration snippets for Claude Desktop, Cursor, and Windsurf. Any MCP-compatible client can use tools from the marketplace — you just need to know where your client stores its MCP configuration file.",
  },
  {
    question: "Do MCP tools send my data to external servers?",
    answer:
      "Most MCP tools run locally on your machine via stdio transport. Your AI client starts the server as a local process and communicates over stdin/stdout — no data leaves your machine unless the tool explicitly makes network requests (e.g., a GitHub tool calling the GitHub API). Always check a tool's description and source code to understand what network calls it makes.",
  },
  {
    question: "How do I update a tool I've connected?",
    answer:
      "Tools installed via npx automatically use the latest version each time your AI client starts. If you've pinned a specific version in your config, update the version number in your MCP configuration file and restart your client.",
  },
  {
    question: "How do I remove a tool?",
    answer:
      'Open your AI client\'s MCP configuration file (see the Connecting Tools page for the path), remove the server entry from the "mcpServers" object, save the file, and restart your client.',
  },
  {
    question: "How do I publish a tool?",
    answer:
      "You need a Hive Market account and a working MCP server published to npm or hosted on GitHub. Go to the Publish page, fill out the four-step form (basic info, technical details, pricing, review), and submit. Your tool goes live immediately.",
  },
  {
    question: "Does Hive Market take a cut of my revenue?",
    answer:
      "No. Hive Market is completely free to use — free to browse, free to publish. If you set a price on your tool (per-call or monthly), you keep 100% of your revenue. You handle your own billing and payments, just like any API provider.",
  },
  {
    question: "Can I edit my tool listing after publishing?",
    answer:
      "Yes. Go to your Dashboard, find the tool you want to edit, and update its description, pricing, or technical details. Changes take effect immediately.",
  },
  {
    question: "My tool isn't showing up after I configured it. What should I do?",
    answer:
      "First, verify your JSON configuration is valid (no trailing commas, correct brackets). Make sure the config file is in the correct location for your OS and AI client. Fully quit and reopen your client — don't just close the window. Check that Node.js 18+ is installed and npx is available on your PATH. If the issue persists, try running the npx command manually in your terminal to see any error output.",
  },
];

export default function FaqPage() {
  return (
    <>
      <DocsHeader
        title="Frequently Asked Questions"
        description="Common questions about Hive Market, MCP tools, and getting started."
      />

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, i) => (
          <details
            key={i}
            className="group rounded-xl border border-border/50 bg-gray-950 transition-colors open:border-violet-500/20"
          >
            <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-foreground font-medium select-none [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <span className="ml-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
              {item.answer}
              {item.question === "How do I publish a tool?" && (
                <span>
                  {" "}See the{" "}
                  <Link
                    href="/docs/publishing"
                    className="text-violet-400 underline underline-offset-4 hover:text-violet-300"
                  >
                    Publishing guide
                  </Link>{" "}
                  for full details.
                </span>
              )}
              {item.question === "My tool isn't showing up after I configured it. What should I do?" && (
                <span>
                  {" "}See the{" "}
                  <Link
                    href="/docs/connecting-tools"
                    className="text-violet-400 underline underline-offset-4 hover:text-violet-300"
                  >
                    Connecting Tools
                  </Link>{" "}
                  page for detailed troubleshooting.
                </span>
              )}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-border/50 bg-gray-950 p-6 text-center">
        <p className="text-foreground font-medium">Still have questions?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Reach out on our community channels or check the{" "}
          <Link
            href="/docs"
            className="text-violet-400 underline underline-offset-4 hover:text-violet-300"
          >
            full documentation
          </Link>{" "}
          for more detailed guides.
        </p>
      </div>
    </>
  );
}
