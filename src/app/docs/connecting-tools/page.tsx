import { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { DocsHeader } from "@/components/docs/docs-header";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata: Metadata = createMetadata({
  title: "Connecting Tools",
  description:
    "Step-by-step guide to connecting MCP tools to Claude Desktop, Cursor, Windsurf, OpenClaw, and other AI clients.",
  path: "/docs/connecting-tools",
});

const EXAMPLE_CONFIG = `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/you/Documents"
      ]
    }
  }
}`;

const MULTI_SERVER_CONFIG = `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/Documents"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}`;

const CURSOR_CONFIG = `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/you/project"
      ]
    }
  }
}`;

const WINDSURF_CONFIG = `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/you/project"
      ]
    }
  }
}`;

export default function ConnectingToolsPage() {
  return (
    <>
      <DocsHeader
        title="Connecting Tools"
        description="How to connect MCP tools from Hive Market to your AI client."
      />

      {/* How MCP Connection Works */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          How MCP Connection Works
        </h2>
        <p className="mb-4 text-muted-foreground">
          When you connect an MCP tool, your AI client starts a local process
          (usually via <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">npx</code>)
          that runs the MCP server. The client communicates with this server over
          stdio using the JSON-RPC protocol. No data leaves your machine unless
          the tool explicitly makes network requests.
        </p>
        <p className="mb-4 text-muted-foreground">
          Each AI client stores its MCP configuration in a JSON file. You add
          server entries to the <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">mcpServers</code> object,
          and the client manages starting and stopping them automatically.
        </p>
        <Callout variant="info" title="Prerequisites">
          <p>
            You need <code>Node.js 18+</code> and <code>npm</code> installed.
            Most MCP servers are distributed as npm packages and run
            via <code>npx</code>.
          </p>
        </Callout>
      </section>

      {/* Claude Desktop */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground" id="claude-desktop">
          Claude Desktop
        </h2>
        <p className="mb-4 text-muted-foreground">
          Claude Desktop reads MCP server configuration from a JSON file on your
          machine. The file location depends on your operating system:
        </p>
        <div className="mb-6 space-y-2">
          <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-gray-950 px-4 py-3">
            <span className="shrink-0 rounded bg-gray-800 px-2 py-0.5 font-mono text-xs text-muted-foreground">
              macOS
            </span>
            <code className="font-mono text-sm text-muted-foreground break-all">
              ~/Library/Application Support/Claude/claude_desktop_config.json
            </code>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-gray-950 px-4 py-3">
            <span className="shrink-0 rounded bg-gray-800 px-2 py-0.5 font-mono text-xs text-muted-foreground">
              Windows
            </span>
            <code className="font-mono text-sm text-muted-foreground break-all">
              %APPDATA%\Claude\claude_desktop_config.json
            </code>
          </div>
        </div>

        <h3 className="mb-3 text-lg font-medium text-foreground">
          Step-by-step setup
        </h3>
        <ol className="mb-6 space-y-3 text-muted-foreground">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">1</span>
            <span>Open Claude Desktop and go to <strong className="text-foreground">Settings &rarr; Developer</strong>.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">2</span>
            <span>Click <strong className="text-foreground">&ldquo;Edit Config&rdquo;</strong> to open the config file in your editor. If the file doesn&apos;t exist, create it at the path above.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">3</span>
            <span>Add the MCP server configuration. Here&apos;s an example using the Filesystem server:</span>
          </li>
        </ol>

        <CodeBlock
          code={EXAMPLE_CONFIG}
          filename="claude_desktop_config.json"
          language="JSON"
        />

        <ol className="mt-6 space-y-3 text-muted-foreground" start={4}>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">4</span>
            <span>Save the file and <strong className="text-foreground">fully restart</strong> Claude Desktop (quit and reopen, not just close the window).</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">5</span>
            <span>Look for the <strong className="text-foreground">hammer icon</strong> in the chat input — clicking it should show your connected tools.</span>
          </li>
        </ol>

        <div className="mt-6">
          <Callout variant="tip" title="Multiple servers">
            <p>
              You can add as many servers as you need. Each key
              in <code>mcpServers</code> is a unique name you choose for that
              server.
            </p>
          </Callout>
        </div>

        <div className="mt-4">
          <CodeBlock
            code={MULTI_SERVER_CONFIG}
            filename="claude_desktop_config.json"
            language="JSON"
          />
        </div>
      </section>

      {/* Cursor */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground" id="cursor">
          Cursor
        </h2>
        <p className="mb-4 text-muted-foreground">
          Cursor supports MCP tools through a per-project configuration file in
          your project root.
        </p>
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-border/50 bg-gray-950 px-4 py-3">
          <span className="shrink-0 rounded bg-gray-800 px-2 py-0.5 font-mono text-xs text-muted-foreground">
            Config path
          </span>
          <code className="font-mono text-sm text-muted-foreground">
            .cursor/mcp.json
          </code>
          <span className="text-xs text-muted-foreground/60">(in your project root)</span>
        </div>

        <ol className="mb-6 space-y-3 text-muted-foreground">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">1</span>
            <span>Create a <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">.cursor</code> directory in your project root if it doesn&apos;t exist.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">2</span>
            <span>Create <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">mcp.json</code> inside it with your server configuration:</span>
          </li>
        </ol>

        <CodeBlock
          code={CURSOR_CONFIG}
          filename=".cursor/mcp.json"
          language="JSON"
        />

        <ol className="mt-6 space-y-3 text-muted-foreground" start={3}>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">3</span>
            <span>Restart Cursor. The tools will be available in your Composer and Agent panels.</span>
          </li>
        </ol>

        <div className="mt-6">
          <Callout variant="info" title="Project-scoped tools">
            <p>
              Cursor&apos;s MCP config is per-project. This means different projects
              can have different tools configured. Add <code>.cursor/mcp.json</code> to
              your <code>.gitignore</code> if it contains secrets.
            </p>
          </Callout>
        </div>
      </section>

      {/* Windsurf */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground" id="windsurf">
          Windsurf
        </h2>
        <p className="mb-4 text-muted-foreground">
          Windsurf (by Codeium) uses a global MCP configuration file.
        </p>
        <div className="mb-6 space-y-2">
          <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-gray-950 px-4 py-3">
            <span className="shrink-0 rounded bg-gray-800 px-2 py-0.5 font-mono text-xs text-muted-foreground">
              macOS/Linux
            </span>
            <code className="font-mono text-sm text-muted-foreground break-all">
              ~/.codeium/windsurf/mcp_config.json
            </code>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-gray-950 px-4 py-3">
            <span className="shrink-0 rounded bg-gray-800 px-2 py-0.5 font-mono text-xs text-muted-foreground">
              Windows
            </span>
            <code className="font-mono text-sm text-muted-foreground break-all">
              %USERPROFILE%\.codeium\windsurf\mcp_config.json
            </code>
          </div>
        </div>

        <ol className="mb-6 space-y-3 text-muted-foreground">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">1</span>
            <span>Open Windsurf and go to <strong className="text-foreground">Settings &rarr; MCP</strong> (or create the file manually at the path above).</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">2</span>
            <span>Add your MCP server configuration:</span>
          </li>
        </ol>

        <CodeBlock
          code={WINDSURF_CONFIG}
          filename="mcp_config.json"
          language="JSON"
        />

        <ol className="mt-6 space-y-3 text-muted-foreground" start={3}>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">3</span>
            <span>Restart Windsurf. The tools will appear in Cascade&apos;s tool list.</span>
          </li>
        </ol>
      </section>

      {/* OpenClaw */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground" id="openclaw">
          OpenClaw
        </h2>
        <p className="mb-4 text-muted-foreground">
          OpenClaw is an AI agent orchestration platform with 40+ communication
          channels and its own skills/plugins system. It uses a global MCP
          configuration file.
        </p>
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-border/50 bg-gray-950 px-4 py-3">
          <span className="shrink-0 rounded bg-gray-800 px-2 py-0.5 font-mono text-xs text-muted-foreground">
            Config path
          </span>
          <code className="font-mono text-sm text-muted-foreground">
            ~/.openclaw/openclaw.json
          </code>
        </div>

        <ol className="mb-6 space-y-3 text-muted-foreground">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">1</span>
            <span>Create the <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">~/.openclaw</code> directory if it doesn&apos;t exist.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">2</span>
            <span>Open or create <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">openclaw.json</code> and add your MCP server configuration:</span>
          </li>
        </ol>

        <CodeBlock
          code={EXAMPLE_CONFIG}
          filename="openclaw.json"
          language="JSON"
        />

        <ol className="mt-6 space-y-3 text-muted-foreground" start={3}>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-medium text-violet-400">3</span>
            <span>Restart OpenClaw. Your MCP tools will be available alongside OpenClaw&apos;s native skills and plugins.</span>
          </li>
        </ol>
      </section>

      {/* Generic / Other Clients */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground" id="generic">
          Other Clients
        </h2>
        <p className="mb-4 text-muted-foreground">
          Any MCP-compatible client can connect to tools from Hive Market. The
          core configuration is the same JSON structure — you just need to know
          where your client reads it from.
        </p>
        <p className="mb-4 text-muted-foreground">
          The minimal configuration for any MCP server looks like this:
        </p>
        <CodeBlock
          code={`{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@scope/package-name"],
      "env": {}
    }
  }
}`}
          filename="mcp_config.json"
          language="JSON"
        />
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">command</strong> — the executable
            to run (usually <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">npx</code>,{" "}
            <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">node</code>, or{" "}
            <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">uvx</code> for Python servers)
          </li>
          <li>
            <strong className="text-foreground">args</strong> — arguments passed
            to the command (<code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">-y</code> auto-confirms
            npx prompts)
          </li>
          <li>
            <strong className="text-foreground">env</strong> — environment
            variables for the server process (API keys, tokens, etc.)
          </li>
        </ul>
      </section>

      {/* Troubleshooting */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Troubleshooting
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-medium text-foreground">
              Tool doesn&apos;t appear after restart
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Verify the JSON is valid (no trailing commas, correct brackets).</li>
              <li>Ensure the config file is in the correct location for your OS.</li>
              <li>Make sure you fully quit and reopened the client, not just closed the window.</li>
              <li>Check that Node.js 18+ is installed and <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">npx</code> is on your PATH.</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-medium text-foreground">
              Server starts but tools are missing
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Some servers require environment variables (API keys). Check the tool&apos;s page on Hive Market for required configuration.</li>
              <li>Try running the npx command manually in your terminal to see error output.</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-medium text-foreground">
              Permission errors
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Filesystem-based servers need read/write access to the directories you pass as arguments.</li>
              <li>On macOS, you may need to grant Terminal or your AI client access in System Settings &rarr; Privacy &amp; Security.</li>
            </ul>
          </div>
        </div>
      </section>

      <Callout variant="tip" title="Still stuck?">
        <p>
          Check the{" "}
          <Link href="/docs/faq">FAQ</Link> or reach out on our community
          channels. Most connection issues come down to JSON syntax or file
          paths.
        </p>
      </Callout>
    </>
  );
}
