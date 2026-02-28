import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Settings",
  description: "Manage your Hive Market account settings.",
  path: "/settings",
});

export default function SettingsPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-8 text-center">
          <p className="text-muted-foreground">
            Account settings coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
