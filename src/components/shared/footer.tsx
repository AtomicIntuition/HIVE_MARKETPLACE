import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { HiveMarketLogo } from "@/components/icons/hive-market-logo";

const FOOTER_LINKS = {
  Marketplace: [
    { href: "/tools", label: "Browse Tools" },
    { href: "/categories", label: "Categories" },
    { href: "/tools?sort=popular", label: "Popular Tools" },
    { href: "/tools?sort=newest", label: "New Tools" },
  ],
  Creators: [
    { href: "/docs/publishing", label: "Publish a Tool" },
    { href: "/docs/account", label: "Creator Dashboard" },
    { href: "/pricing", label: "Pricing" },
    { href: "/docs/mcp-basics", label: "MCP Spec" },
  ],
  Platform: [
    { href: "https://hive.sh", label: "Hive Deploy", external: true },
    { href: "/docs", label: "Documentation" },
    { href: "/docs/connecting-tools", label: "Setup Guide" },
    { href: "/docs/faq", label: "FAQ" },
  ],
  Community: [
    { href: "https://github.com/AtomicIntuition/HIVE_MARKETPLACE", label: "GitHub", external: true },
    { href: "https://x.com/hivemarketplace", label: "X / Twitter", external: true },
    { href: "/publish", label: "Publish a Tool" },
    { href: "/docs/faq", label: "Support" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-gray-950">
      {/* Gradient top border accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <HiveMarketLogo />
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              The marketplace for MCP-compatible tools. Power your AI agents
              with 60+ ready-to-use integrations.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-foreground"
                      >
                        {link.label}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 md:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Hive. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-gray-500 transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-500 transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <a
              href="https://hive.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-foreground"
            >
              Hive Platform
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
