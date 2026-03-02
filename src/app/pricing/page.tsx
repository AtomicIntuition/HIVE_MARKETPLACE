import { Metadata } from "next";
import { Check, ArrowRight, Zap, Users, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata: Metadata = createMetadata({
  title: "Pricing",
  description:
    "Hive Market is free for everyone. Browse tools, publish tools, earn from your tools.",
  path: "/pricing",
});

const PLATFORM_FEATURES = [
  "Browse and discover all MCP tools",
  "Connect tools to any MCP client",
  "Publish unlimited tools",
  "Creator dashboard and analytics",
  "API access for agents",
  "Curated stacks and recommendations",
];

const PRICING_MODELS = [
  {
    icon: Zap,
    name: "Per-call",
    description: "Charge a small fee every time an agent uses your tool",
    example: "e.g. $0.002/call",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Users,
    name: "Monthly",
    description: "Offer a subscription for unlimited access to your tool",
    example: "e.g. $9/month",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Code,
    name: "Free / Open Source",
    description: "Give your tool away and build community adoption",
    example: "Always an option",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

export default function PricingPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Hive Market is free
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            Free to browse. Free to publish. Creators earn directly from their
            tools — you set the price, you keep the revenue.
          </p>
        </div>

        {/* Free Platform Card */}
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-950/50 to-gray-900 p-8 shadow-xl shadow-violet-500/5">
            <div className="text-center">
              <div className="text-sm font-medium text-violet-400">
                The Marketplace
              </div>
              <div className="mt-2 flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-foreground">$0</span>
                <span className="text-gray-500">forever</span>
              </div>
              <p className="mt-2 text-gray-400">
                Everything you need to discover and publish MCP tools
              </p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {PLATFORM_FEATURES.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 text-sm text-gray-300"
                >
                  <Check className="h-4 w-4 shrink-0 text-amber-400" />
                  {feature}
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/tools">
                <Button
                  size="lg"
                  className="w-full gap-2 bg-violet-600 text-white hover:bg-violet-700 sm:w-auto"
                >
                  Browse Tools
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/publish">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 border-white/[0.1] sm:w-auto"
                >
                  Publish a Tool
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* How Creators Earn */}
        <div className="mx-auto mt-24 max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              How creators earn
            </h2>
            <p className="mt-3 text-gray-400">
              You set the pricing on your tools. Developers and agents pay you directly
              when they use them — just like Stripe, Twilio, or any paid API.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {PRICING_MODELS.map((model) => (
              <div
                key={model.name}
                className="rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-6"
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${model.bg}`}
                >
                  <model.icon className={`h-5 w-5 ${model.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {model.name}
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  {model.description}
                </p>
                <p className={`mt-3 text-sm font-medium ${model.color}`}>
                  {model.example}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ-style bottom */}
        <div className="mx-auto mt-24 max-w-2xl text-center">
          <p className="text-sm text-gray-500">
            Need a private marketplace or custom setup for your team?{" "}
            <a href="mailto:hello@hive.sh" className="text-violet-400 hover:text-violet-300">
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
