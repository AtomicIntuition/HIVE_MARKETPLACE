import { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { DocsHeader } from "@/components/docs/docs-header";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata: Metadata = createMetadata({
  title: "Publishing Tools",
  description:
    "How to publish your MCP server to Hive Market — prerequisites, submission form, pricing models, and best practices.",
  path: "/docs/publishing",
});

export default function PublishingPage() {
  return (
    <>
      <DocsHeader
        title="Publishing Tools"
        description="Submit your MCP server to Hive Market and reach thousands of AI agent users."
      />

      {/* Prerequisites */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Prerequisites
        </h2>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">1</span>
            <span>
              <strong className="text-foreground">A Hive Market account.</strong>{" "}
              <Link href="/auth/signup" className="text-violet-400 underline underline-offset-4 hover:text-violet-300">Sign up</Link> with email, GitHub, or Google.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">2</span>
            <span>
              <strong className="text-foreground">A working MCP server.</strong>{" "}
              Your server must implement the Model Context Protocol and be accessible
              via npm (<code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">npx</code>) or a public Git repository.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">3</span>
            <span>
              <strong className="text-foreground">A package on npm or GitHub.</strong>{" "}
              Users install your server locally via <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">npx -y your-package</code>,
              so it must be published somewhere accessible.
            </span>
          </li>
        </ul>
      </section>

      {/* Submission Form */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Submission Form
        </h2>
        <p className="mb-6 text-muted-foreground">
          Go to{" "}
          <Link href="/publish" className="text-violet-400 underline underline-offset-4 hover:text-violet-300">
            Publish
          </Link>{" "}
          and fill out the four-step submission form:
        </p>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="rounded-xl border border-border/50 bg-gray-950 p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-sm font-semibold text-violet-400">1</span>
              <h3 className="font-semibold text-foreground">Basic Info</h3>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><strong className="text-foreground">Name</strong> — a clear, descriptive name (e.g., &ldquo;Filesystem MCP Server&rdquo;)</li>
              <li><strong className="text-foreground">Slug</strong> — URL-friendly identifier, auto-generated from the name</li>
              <li><strong className="text-foreground">Short description</strong> — one sentence summary shown in search results</li>
              <li><strong className="text-foreground">Long description</strong> — detailed Markdown description for the tool page</li>
              <li><strong className="text-foreground">Category</strong> — choose one of the 8 marketplace categories</li>
              <li><strong className="text-foreground">Icon</strong> — upload a square icon (recommended 256x256)</li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl border border-border/50 bg-gray-950 p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-sm font-semibold text-violet-400">2</span>
              <h3 className="font-semibold text-foreground">Technical Details</h3>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><strong className="text-foreground">npm package</strong> — the npm package name (e.g., <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">@modelcontextprotocol/server-filesystem</code>)</li>
              <li><strong className="text-foreground">Repository URL</strong> — link to your GitHub repository</li>
              <li><strong className="text-foreground">Command</strong> — how to run the server (default: <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">npx</code>)</li>
              <li><strong className="text-foreground">Arguments</strong> — any required CLI arguments</li>
              <li><strong className="text-foreground">Environment variables</strong> — list any required env vars (API keys, tokens)</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl border border-border/50 bg-gray-950 p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-sm font-semibold text-violet-400">3</span>
              <h3 className="font-semibold text-foreground">Pricing</h3>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><strong className="text-foreground">Free</strong> — open source, no charges</li>
              <li><strong className="text-foreground">Per-call</strong> — charge per API invocation</li>
              <li><strong className="text-foreground">Monthly</strong> — recurring subscription</li>
            </ul>
            <p className="mt-2 text-sm text-muted-foreground">
              Publishing is free. You keep <strong className="text-foreground">100% of your tool&apos;s revenue</strong> — set your own price and collect payments directly.
            </p>
          </div>

          {/* Step 4 */}
          <div className="rounded-xl border border-border/50 bg-gray-950 p-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-sm font-semibold text-violet-400">4</span>
              <h3 className="font-semibold text-foreground">Review &amp; Submit</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Preview your listing, confirm all details, and submit. Your tool
              goes live immediately — no manual approval queue.
            </p>
          </div>
        </div>
      </section>

      {/* Example package.json */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Example MCP Server Package
        </h2>
        <p className="mb-4 text-muted-foreground">
          A minimal MCP server npm package should have a binary entry point and
          list the MCP SDK as a dependency:
        </p>
        <CodeBlock
          code={`{
  "name": "@your-org/mcp-server-example",
  "version": "1.0.0",
  "bin": {
    "mcp-server-example": "./dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  }
}`}
          filename="package.json"
          language="JSON"
        />
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Best Practices
        </h2>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <h3 className="mb-1 font-medium text-foreground">Write a clear description</h3>
            <p className="text-sm">
              Explain what your tool does, what capabilities it gives the AI
              agent, and what use cases it supports. Users search by keyword, so
              be specific.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-medium text-foreground">Document environment variables</h3>
            <p className="text-sm">
              If your server needs API keys or tokens, list them clearly. Tell
              users where to obtain them and what permissions they need.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-medium text-foreground">Keep the install simple</h3>
            <p className="text-sm">
              Aim for a zero-config <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">npx -y your-package</code> install.
              Minimize required arguments and provide sensible defaults.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-medium text-foreground">Test with multiple clients</h3>
            <p className="text-sm">
              Verify your server works with Claude Desktop, Cursor, and Windsurf
              before publishing. Each client has slight differences in how it
              handles tool calls.
            </p>
          </div>
        </div>
      </section>

      <Callout variant="info" title="Ready to publish?">
        <p>
          Head to the{" "}
          <Link href="/publish" className="text-violet-400 underline underline-offset-4 hover:text-violet-300">
            Publish page
          </Link>{" "}
          to submit your MCP server. If you need help building one, check out
          the{" "}
          <Link href="/docs/mcp-basics" className="text-violet-400 underline underline-offset-4 hover:text-violet-300">
            MCP Basics
          </Link>{" "}
          guide first.
        </p>
      </Callout>
    </>
  );
}
