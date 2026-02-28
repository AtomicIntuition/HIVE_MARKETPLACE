import { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { DocsHeader } from "@/components/docs/docs-header";
import { Callout } from "@/components/docs/callout";

export const metadata: Metadata = createMetadata({
  title: "Account & Dashboard",
  description:
    "Manage your Hive Market account, view your dashboard, and learn how to leave reviews.",
  path: "/docs/account",
});

export default function AccountPage() {
  return (
    <>
      <DocsHeader
        title="Account & Dashboard"
        description="Create your account, manage submissions, and track your tools' performance."
      />

      {/* Creating an Account */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Creating an Account
        </h2>
        <p className="mb-4 text-muted-foreground">
          You need a Hive Market account to publish tools, leave reviews, and
          track your connected tools. Creating an account is free and takes a few
          seconds.
        </p>
        <p className="mb-6 text-muted-foreground">
          Go to{" "}
          <Link href="/auth/signup" className="text-violet-400 underline underline-offset-4 hover:text-violet-300">
            Sign Up
          </Link>{" "}
          and choose one of the following methods:
        </p>
        <div className="space-y-3">
          <div className="rounded-xl border border-border/50 bg-gray-950 p-4">
            <h3 className="mb-1 font-medium text-foreground">Email &amp; Password</h3>
            <p className="text-sm text-muted-foreground">
              Enter your email and choose a password. You&apos;ll receive a
              confirmation email to verify your address.
            </p>
          </div>
          <div className="rounded-xl border border-border/50 bg-gray-950 p-4">
            <h3 className="mb-1 font-medium text-foreground">GitHub OAuth</h3>
            <p className="text-sm text-muted-foreground">
              Sign in with your GitHub account. This links your GitHub profile
              and makes it easy to publish tools from your repositories.
            </p>
          </div>
          <div className="rounded-xl border border-border/50 bg-gray-950 p-4">
            <h3 className="mb-1 font-medium text-foreground">Google OAuth</h3>
            <p className="text-sm text-muted-foreground">
              Sign in with your Google account for quick access.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <Callout variant="info" title="Already have an account?">
            <p>
              <Link href="/auth/login" className="text-violet-400 underline underline-offset-4 hover:text-violet-300">
                Sign in
              </Link>{" "}
              to access your dashboard and manage your tools.
            </p>
          </Callout>
        </div>
      </section>

      {/* Dashboard */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Dashboard
        </h2>
        <p className="mb-6 text-muted-foreground">
          Your{" "}
          <Link href="/dashboard" className="text-violet-400 underline underline-offset-4 hover:text-violet-300">
            Dashboard
          </Link>{" "}
          is your home base for managing everything on Hive Market.
        </p>
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-medium text-foreground">Submitted Tools</h3>
            <p className="text-sm text-muted-foreground">
              View all the MCP servers you&apos;ve published. See their status,
              edit descriptions, update pricing, or remove listings. Each tool
              shows its current install count and average rating.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-medium text-foreground">Install Stats</h3>
            <p className="text-sm text-muted-foreground">
              Track how many users have connected your tools. The dashboard shows
              total installs and connections across all your published servers,
              broken down by AI client (Claude Desktop, Cursor, Windsurf).
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-medium text-foreground">Connected Tools</h3>
            <p className="text-sm text-muted-foreground">
              See the tools you&apos;ve connected to your own AI clients. This
              helps you keep track of your installed MCP servers in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Leaving Reviews */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Leaving Reviews
        </h2>
        <p className="mb-4 text-muted-foreground">
          Reviews help the community discover quality tools. After connecting and
          using a tool, you can leave a review on its page.
        </p>
        <ol className="space-y-3 text-muted-foreground">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">1</span>
            <span>Navigate to the tool&apos;s page on Hive Market.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">2</span>
            <span>Scroll down to the <strong className="text-foreground">Reviews</strong> section.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">3</span>
            <span>Select a star rating (1–5) and write your review.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">4</span>
            <span>Click <strong className="text-foreground">Submit Review</strong>. Your review appears immediately and the tool&apos;s average rating is recalculated.</span>
          </li>
        </ol>
        <div className="mt-6">
          <Callout variant="tip" title="Write helpful reviews">
            <p>
              Mention what you used the tool for, how reliable it was, and
              whether the setup was smooth. Specific feedback helps creators
              improve their tools.
            </p>
          </Callout>
        </div>
      </section>

      {/* Profile Settings */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Profile Settings
        </h2>
        <p className="text-muted-foreground">
          Visit{" "}
          <Link href="/settings" className="text-violet-400 underline underline-offset-4 hover:text-violet-300">
            Settings
          </Link>{" "}
          to update your display name, avatar, and bio. Your profile is shown
          on any tools you publish and reviews you leave.
        </p>
      </section>
    </>
  );
}
