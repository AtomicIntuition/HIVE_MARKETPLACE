"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BadgeCheck,
  Download,
  ExternalLink,
  GitBranch,
  BookOpen,
  Copy,
  Check,
  Tag,
  Clock,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RatingStars } from "@/components/shared/rating-stars";
import { ToolCard } from "./tool-card";
import { ConnectDialog } from "./connect-dialog";
import { Tool } from "@/lib/types";
import { CATEGORIES, COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ToolDetailProps {
  tool: Tool;
  relatedTools: Tool[];
  reviewsSection?: React.ReactNode;
}

export function ToolDetail({ tool, relatedTools, reviewsSection }: ToolDetailProps) {
  const [copied, setCopied] = useState(false);
  const category = CATEGORIES.find((c) => c.slug === tool.category);
  const categoryColor =
    COLORS.categories[tool.category as keyof typeof COLORS.categories];
  const installCmd = tool.npmPackage
    ? `npx -y ${tool.npmPackage}`
    : null;

  const handleCopy = () => {
    if (!installCmd) return;
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/tools" className="hover:text-foreground transition-colors">
              Tools
            </Link>
            <span>/</span>
            <Link
              href={`/categories/${tool.category}`}
              className="hover:text-foreground transition-colors"
            >
              {category?.name}
            </Link>
            <span>/</span>
            <span className="text-foreground">{tool.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Hero */}
              <div className="flex items-start gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white"
                  style={{ backgroundColor: tool.iconBg }}
                >
                  {tool.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                      {tool.name}
                    </h1>
                    {tool.verified && (
                      <BadgeCheck className="h-6 w-6 text-violet-400" />
                    )}
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    by{" "}
                    <span className="text-foreground">{tool.author.name}</span>
                    {tool.author.verified && (
                      <BadgeCheck className="ml-1 inline h-3.5 w-3.5 text-violet-400" />
                    )}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <RatingStars
                      rating={tool.rating}
                      count={tool.reviewCount}
                      size="md"
                    />
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Download className="h-4 w-4" />
                      {tool.installCount.toLocaleString()} installs
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Tag className="h-4 w-4" />v{tool.version}
                    </div>
                  </div>
                </div>
              </div>

              {/* Install command */}
              {installCmd && (
                <div className="mt-8 overflow-hidden rounded-xl border border-border/50 bg-gray-950">
                  <div className="flex items-center justify-between border-b border-border/50 px-4 py-2">
                    <span className="text-xs text-muted-foreground">
                      Quick Install
                    </span>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-4 font-mono text-sm">
                    <span className="text-violet-400">$</span> {installCmd}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  About
                </h2>
                <div className="prose prose-invert max-w-none text-muted-foreground">
                  {tool.longDescription.split("\n").map((line, i) => {
                    if (line.startsWith("## ")) {
                      return (
                        <h3
                          key={i}
                          className="mb-3 mt-6 text-lg font-semibold text-foreground"
                        >
                          {line.replace("## ", "")}
                        </h3>
                      );
                    }
                    if (line.startsWith("- ")) {
                      return (
                        <li key={i} className="ml-4 text-sm text-muted-foreground">
                          {line.replace("- ", "")}
                        </li>
                      );
                    }
                    if (line.trim() === "") return <br key={i} />;
                    return (
                      <p key={i} className="text-sm leading-relaxed">
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Features */}
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  Features
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {tool.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 rounded-lg border border-border/50 bg-card px-3 py-2 text-sm"
                    >
                      <div
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: categoryColor }}
                      />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Compatibility */}
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  Compatibility
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tool.compatibility.map((c) => (
                    <Badge key={c} variant="secondary">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              {reviewsSection}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Connect CTA */}
                <div className="rounded-xl border border-border/50 bg-card p-6">
                  <div className="mb-4">
                    {tool.pricing.model === "free" ? (
                      <div className="text-2xl font-bold text-emerald-400">
                        Free
                      </div>
                    ) : (
                      <div>
                        <span className="text-2xl font-bold text-foreground">
                          ${tool.pricing.price}
                        </span>
                        <span className="text-muted-foreground">
                          /{tool.pricing.unit}
                        </span>
                      </div>
                    )}
                    {tool.pricing.freeTier && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Free tier: {tool.pricing.freeTier}
                      </p>
                    )}
                  </div>
                  <ConnectDialog
                    toolId={tool.id}
                    toolName={tool.name}
                    toolSlug={tool.slug}
                    npmPackage={tool.npmPackage}
                    githubUrl={tool.githubUrl}
                  />
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    One command to add to your agent
                  </p>
                </div>

                {/* Info card */}
                <div className="rounded-xl border border-border/50 bg-card p-6">
                  <h3 className="mb-4 text-sm font-semibold text-foreground">
                    Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category</span>
                      <Link
                        href={`/categories/${tool.category}`}
                        className="transition-colors hover:text-violet-400"
                        style={{ color: categoryColor }}
                      >
                        {category?.name}
                      </Link>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Version</span>
                      <span className="text-foreground">v{tool.version}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Updated</span>
                      <span className="flex items-center gap-1 text-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(tool.lastUpdated).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Verified</span>
                      <span
                        className={cn(
                          "flex items-center gap-1",
                          tool.verified
                            ? "text-emerald-400"
                            : "text-muted-foreground"
                        )}
                      >
                        <Shield className="h-3 w-3" />
                        {tool.verified ? "Yes" : "No"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Weekly installs
                      </span>
                      <span className="text-foreground">
                        {tool.weeklyInstalls.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div className="rounded-xl border border-border/50 bg-card p-6">
                  <h3 className="mb-4 text-sm font-semibold text-foreground">
                    Links
                  </h3>
                  <div className="space-y-2">
                    {tool.githubUrl && (
                      <a
                        href={tool.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <GitBranch className="h-4 w-4" />
                        GitHub Repository
                        <ExternalLink className="ml-auto h-3 w-3" />
                      </a>
                    )}
                    {tool.docsUrl && (
                      <a
                        href={tool.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <BookOpen className="h-4 w-4" />
                        Documentation
                        <ExternalLink className="ml-auto h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="rounded-xl border border-border/50 bg-card p-6">
                  <h3 className="mb-4 text-sm font-semibold text-foreground">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag) => (
                      <Link key={tag} href={`/tools?q=${tag}`}>
                        <Badge
                          variant="outline"
                          className="cursor-pointer transition-colors hover:bg-violet-500/10 hover:text-violet-400"
                        >
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 text-xl font-semibold text-foreground">
                Related Tools
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedTools.map((t) => (
                  <ToolCard key={t.id} tool={t} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
