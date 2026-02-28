"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  filename?: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, filename, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn("group relative rounded-xl border border-border/50 bg-gray-950", className)}>
      {filename && (
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-2">
          <span className="font-mono text-xs text-muted-foreground">{filename}</span>
          {language && (
            <span className="text-xs text-muted-foreground/60">{language}</span>
          )}
        </div>
      )}
      <div className="relative">
        <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-muted-foreground">
          <code>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className={cn(
            "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md border border-border/50 bg-gray-900 transition-all",
            "opacity-0 group-hover:opacity-100 hover:bg-gray-800 hover:text-foreground",
            copied && "opacity-100 text-green-400"
          )}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
