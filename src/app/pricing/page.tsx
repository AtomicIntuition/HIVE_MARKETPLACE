import { Metadata } from "next";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Pricing",
  description:
    "Hive Market pricing for creators and developers. Publish tools for free, earn on every API call.",
  path: "/pricing",
});

const TIERS = [
  {
    name: "Free",
    price: "$0",
    description: "For developers using tools",
    features: [
      "Browse all tools",
      "Connect free tools unlimited",
      "Community support",
      "Usage analytics",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Creator",
    price: "$0",
    description: "For tool publishers",
    features: [
      "Publish unlimited tools",
      "Creator dashboard & analytics",
      "Set your own pricing",
      "80% revenue share",
      "Verified badge eligibility",
      "Priority support",
    ],
    cta: "Start Publishing",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams and organizations",
    features: [
      "Private marketplace",
      "Custom SLAs",
      "Volume discounts",
      "Dedicated support",
      "SSO & advanced auth",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Free to browse and connect. Creators keep 80% of revenue.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-8 ${
                tier.featured
                  ? "border-violet-500/30 bg-gradient-to-b from-violet-950/50 to-gray-900 shadow-xl shadow-violet-500/5"
                  : "border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-semibold text-foreground">
                {tier.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">
                  {tier.price}
                </span>
                {tier.price !== "Custom" && (
                  <span className="text-gray-500">/month</span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-400">
                {tier.description}
              </p>
              <Button
                className={`mt-6 w-full ${
                  tier.featured
                    ? "bg-violet-600 text-white hover:bg-violet-700"
                    : ""
                }`}
                variant={tier.featured ? "default" : "outline"}
              >
                {tier.cta}
              </Button>
              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-gray-400"
                  >
                    <Check className="h-4 w-4 shrink-0 text-amber-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
