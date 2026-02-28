import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { DocsHeader } from "@/components/docs/docs-header";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata: Metadata = createMetadata({
  title: "MCP Basics",
  description:
    "Learn what the Model Context Protocol (MCP) is, how it works, and the core concepts behind AI agent tools.",
  path: "/docs/mcp-basics",
});

export default function McpBasicsPage() {
  return (
    <>
      <DocsHeader
        title="MCP Basics"
        description="Understand the Model Context Protocol — the open standard that powers AI agent tools."
      />

      {/* What is MCP */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          What is MCP?
        </h2>
        <p className="mb-4 text-muted-foreground">
          The <strong className="text-foreground">Model Context Protocol (MCP)</strong> is
          an open protocol created by Anthropic that standardizes how AI
          applications connect to external tools and data sources. Think of it as
          a USB-C port for AI — a universal interface that lets any compatible
          client talk to any compatible server.
        </p>
        <p className="text-muted-foreground">
          Before MCP, every AI application had to build custom integrations for
          each tool or API. MCP provides a single standard so that a tool built
          once works with every MCP-compatible client — Claude Desktop, Cursor,
          Windsurf, and more.
        </p>
      </section>

      {/* How it Works */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          How It Works
        </h2>
        <p className="mb-6 text-muted-foreground">
          MCP follows a client-server architecture. The AI application (client)
          connects to one or more MCP servers, each of which provides specific
          capabilities.
        </p>

        <div className="mb-6 rounded-xl border border-border/50 bg-gray-950 p-6">
          <pre className="font-mono text-sm leading-relaxed text-muted-foreground">
{`┌─────────────────┐          ┌──────────────────┐
│   AI Client     │          │   MCP Server     │
│  (Claude, etc.) │◄────────►│  (your tool)     │
│                 │ JSON-RPC │                  │
│  Sends requests │          │  Exposes tools,  │
│  to use tools   │          │  resources, and  │
│                 │          │  prompts         │
└─────────────────┘          └──────────────────┘`}
          </pre>
        </div>

        <p className="mb-4 text-muted-foreground">
          Communication happens over <strong className="text-foreground">JSON-RPC 2.0</strong>.
          The client sends a request (e.g., &ldquo;call this tool with these
          arguments&rdquo;) and the server responds with the result. All messages
          follow a structured format:
        </p>

        <CodeBlock
          code={`// Client request
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "read_file",
    "arguments": {
      "path": "/Users/you/document.txt"
    }
  }
}

// Server response
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Contents of the file..."
      }
    ]
  }
}`}
          language="JSON-RPC"
        />
      </section>

      {/* Three Primitives */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          The Three Primitives
        </h2>
        <p className="mb-6 text-muted-foreground">
          MCP servers can expose three types of capabilities:
        </p>

        <div className="space-y-4">
          <div className="rounded-xl border border-border/50 bg-gray-950 p-5">
            <h3 className="mb-2 font-semibold text-foreground">
              Tools
            </h3>
            <p className="mb-2 text-sm text-muted-foreground">
              Functions the AI can call to perform actions. Tools are the most
              common primitive — they let the AI read files, query databases,
              send messages, manage infrastructure, and more.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Example:</strong>{" "}
              <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">read_file</code>,{" "}
              <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">execute_query</code>,{" "}
              <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">send_slack_message</code>
            </p>
          </div>

          <div className="rounded-xl border border-border/50 bg-gray-950 p-5">
            <h3 className="mb-2 font-semibold text-foreground">
              Resources
            </h3>
            <p className="mb-2 text-sm text-muted-foreground">
              Data the AI can read for context. Resources are like files the AI
              can access — documentation, database schemas, configuration files,
              or any structured data that helps the AI understand your system.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Example:</strong>{" "}
              <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">file:///schema.sql</code>,{" "}
              <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">db://tables</code>
            </p>
          </div>

          <div className="rounded-xl border border-border/50 bg-gray-950 p-5">
            <h3 className="mb-2 font-semibold text-foreground">
              Prompts
            </h3>
            <p className="mb-2 text-sm text-muted-foreground">
              Pre-written prompt templates that guide the AI for specific tasks.
              Prompts are reusable instructions that help users get consistent
              results from tools.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Example:</strong>{" "}
              <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">analyze_code</code>,{" "}
              <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">summarize_document</code>
            </p>
          </div>
        </div>
      </section>

      {/* Transports */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Transports
        </h2>
        <p className="mb-6 text-muted-foreground">
          MCP supports two ways for clients and servers to communicate:
        </p>

        <div className="space-y-4">
          <div className="rounded-xl border border-border/50 bg-gray-950 p-5">
            <h3 className="mb-2 font-semibold text-foreground">
              stdio (Standard I/O)
            </h3>
            <p className="text-sm text-muted-foreground">
              The client launches the server as a local subprocess and
              communicates over stdin/stdout. This is the most common transport
              — it&apos;s what you use when you configure a server
              with <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-xs">npx</code> in
              your config file. No network required; everything runs locally.
            </p>
          </div>

          <div className="rounded-xl border border-border/50 bg-gray-950 p-5">
            <h3 className="mb-2 font-semibold text-foreground">
              SSE (Server-Sent Events)
            </h3>
            <p className="text-sm text-muted-foreground">
              The server runs as a web service and the client connects over HTTP.
              This is used for remote servers or servers that need to be shared
              across multiple clients. The client sends requests via HTTP POST
              and receives responses via an SSE stream.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Callout variant="info" title="Which transport to use?">
            <p>
              Most tools on Hive Market use <strong>stdio</strong>. It&apos;s
              simpler, requires no network configuration, and keeps everything
              local. Use SSE only if your server needs to run remotely or serve
              multiple users.
            </p>
          </Callout>
        </div>
      </section>

      {/* Learn More */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Learn More
        </h2>
        <p className="mb-4 text-muted-foreground">
          MCP is an open standard with a detailed specification and growing
          ecosystem. Here are the official resources:
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <a
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 underline underline-offset-4 hover:text-violet-300"
            >
              modelcontextprotocol.io
            </a>
            {" "}— official specification and documentation
          </li>
          <li>
            <a
              href="https://github.com/modelcontextprotocol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 underline underline-offset-4 hover:text-violet-300"
            >
              github.com/modelcontextprotocol
            </a>
            {" "}— SDK source code and reference server implementations
          </li>
          <li>
            <a
              href="https://github.com/modelcontextprotocol/servers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 underline underline-offset-4 hover:text-violet-300"
            >
              github.com/modelcontextprotocol/servers
            </a>
            {" "}— collection of official and community MCP servers
          </li>
        </ul>
      </section>
    </>
  );
}
