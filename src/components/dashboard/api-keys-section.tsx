"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Plus, Trash2, Copy, Check, AlertTriangle } from "lucide-react";

interface ApiKeyEntry {
  id: string;
  keyPrefix: string;
  name: string;
  status: "active" | "revoked";
  createdAt: string;
  lastUsedAt: string | null;
}

export function ApiKeysSection() {
  const [keys, setKeys] = useState<ApiKeyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    try {
      const res = await fetch("/api/keys");
      if (!res.ok) return;
      const data = await res.json();
      setKeys(data.keys ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  async function handleCreate() {
    if (!newKeyName.trim()) return;
    setCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to create key");
        return;
      }

      setRevealedKey(data.key);
      setNewKeyName("");
      setShowCreate(false);
      fetchKeys();
    } catch {
      setError("Failed to create key");
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    setRevoking(id);
    try {
      const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchKeys();
      }
    } catch {
      // silent
    } finally {
      setRevoking(null);
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const activeKeys = keys.filter((k) => k.status === "active");

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">API Keys</h2>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => {
            setShowCreate(!showCreate);
            setRevealedKey(null);
            setError(null);
          }}
        >
          <Plus className="h-3 w-3" />
          New Key
        </Button>
      </div>

      {/* Revealed key warning */}
      {revealedKey && (
        <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-amber-400">
                Copy your API key now — it won&apos;t be shown again
              </p>
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 truncate rounded bg-background px-3 py-1.5 text-xs font-mono text-foreground">
                  {revealedKey}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-1.5 text-xs"
                  onClick={() => handleCopy(revealedKey)}
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-green-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div className="mb-4 rounded-xl border border-border/50 bg-card p-4">
          <label className="text-sm text-muted-foreground">Key name</label>
          <div className="mt-1.5 flex gap-2">
            <Input
              placeholder='e.g. "My Review Agent"'
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="flex-1"
              maxLength={255}
            />
            <Button
              onClick={handleCreate}
              disabled={creating || !newKeyName.trim()}
              className="bg-violet-600 text-white hover:bg-violet-700"
            >
              {creating ? "Creating..." : "Create"}
            </Button>
          </div>
          {error && (
            <p className="mt-2 text-xs text-red-400">{error}</p>
          )}
        </div>
      )}

      {/* Keys list */}
      {loading ? (
        <div className="rounded-xl border border-border/50 bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">Loading keys...</p>
        </div>
      ) : activeKeys.length === 0 ? (
        <div className="rounded-xl border border-border/50 bg-card p-8 text-center">
          <Key className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-2 text-muted-foreground">No API keys yet.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Create a key to authenticate agent reviews via the API.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeKeys.map((k) => (
            <div
              key={k.id}
              className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <Key className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {k.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <code>{k.keyPrefix}</code>
                    {" · "}
                    Created {new Date(k.createdAt).toLocaleDateString()}
                    {k.lastUsedAt && (
                      <>
                        {" · "}
                        Last used {new Date(k.lastUsedAt).toLocaleDateString()}
                      </>
                    )}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-red-400 hover:text-red-300"
                onClick={() => handleRevoke(k.id)}
                disabled={revoking === k.id}
              >
                <Trash2 className="h-3 w-3" />
                {revoking === k.id ? "Revoking..." : "Revoke"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
