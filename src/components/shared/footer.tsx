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
    { href: "/docs", label: "Publish a Tool" },
    { href: "/docs", label: "Creator Dashboard" },
    { href: "/pricing", label: "Pricing" },
    { href: "/docs", label: "MCP Spec" },
  ],
  Platform: [
    { href: "https://hive.sh", label: "Hive Deploy", external: true },
    { href: "/docs", label: "Documentation" },
    { href: "/docs", label: "API Reference" },
    { href: "/docs", label: "CLI Reference" },
  ],
  Company: [
    { href: "/", label: "About" },
    { href: "/", label: "Blog" },
    { href: "/", label: "Careers" },
    { href: "/", label: "Contact" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <HiveMarketLogo />
            <p className="mt-4 text-sm text-muted-foreground">
              The marketplace for MCP-compatible tools. Power your AI agents
              with thousands of integrations.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Hive. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <a
              href="https://hive.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
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
