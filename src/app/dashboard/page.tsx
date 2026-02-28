import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = createMetadata({
  title: "Dashboard",
  description: "Manage your tools, submissions, and connected integrations.",
  path: "/dashboard",
});

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user's submissions
  const { data: submissions } = await supabase
    .from("tool_submissions")
    .select("*")
    .eq("submitted_by", user?.id ?? "")
    .order("submitted_at", { ascending: false });

  // Fetch user's connected tools
  const { data: connections } = await supabase
    .from("user_connections")
    .select("tool_id, connected_at, tools(name, slug, icon_bg)")
    .eq("user_id", user?.id ?? "")
    .order("connected_at", { ascending: false });

  const totalSubmissions = submissions?.length ?? 0;
  const totalConnections = connections?.length ?? 0;

  // Calculate total installs across user's tools
  const { data: userTools } = await supabase
    .from("tools")
    .select("install_count")
    .in(
      "id",
      (submissions ?? []).map((s) => s.id)
    );
  const totalInstalls = (userTools ?? []).reduce(
    (sum, t) => sum + (t.install_count ?? 0),
    0
  );

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your tools and integrations
            </p>
          </div>
          <Link href="/publish">
            <Button className="gap-2 bg-violet-600 text-white hover:bg-violet-700">
              <Plus className="h-4 w-4" />
              Publish a Tool
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border/50 bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Tools Submitted
            </h3>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {totalSubmissions}
            </p>
          </div>
          <div className="rounded-xl border border-border/50 bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Installs
            </h3>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {totalInstalls}
            </p>
          </div>
          <div className="rounded-xl border border-border/50 bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Connected Tools
            </h3>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {totalConnections}
            </p>
          </div>
        </div>

        {/* Submitted Tools */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Your Tools
          </h2>
          {totalSubmissions === 0 ? (
            <div className="rounded-xl border border-border/50 bg-card p-8 text-center">
              <p className="text-muted-foreground">
                You haven&apos;t submitted any tools yet.
              </p>
              <Link href="/publish">
                <Button variant="outline" className="mt-4">
                  Publish Your First Tool
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {(submissions ?? []).map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                      style={{ backgroundColor: sub.icon_bg || "#8B5CF6" }}
                    >
                      {sub.name.charAt(0)}
                    </div>
                    <div>
                      <Link
                        href={`/tools/${sub.slug}`}
                        className="font-medium text-foreground hover:text-violet-400"
                      >
                        {sub.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {sub.description?.slice(0, 60)}...
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      sub.status === "approved"
                        ? "default"
                        : sub.status === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {sub.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Connected Tools */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Connected Tools
          </h2>
          {totalConnections === 0 ? (
            <div className="rounded-xl border border-border/50 bg-card p-8 text-center">
              <p className="text-muted-foreground">
                You haven&apos;t connected any tools yet.
              </p>
              <Link href="/tools">
                <Button variant="outline" className="mt-4">
                  Browse Tools
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {(connections ?? []).map((conn) => {
                const tool = conn.tools as unknown as {
                  name: string;
                  slug: string;
                  icon_bg: string;
                } | null;
                if (!tool) return null;
                return (
                  <div
                    key={conn.tool_id}
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4"
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                      style={{ backgroundColor: tool.icon_bg || "#8B5CF6" }}
                    >
                      {tool.name.charAt(0)}
                    </div>
                    <div>
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="font-medium text-foreground hover:text-violet-400"
                      >
                        {tool.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        Connected{" "}
                        {new Date(conn.connected_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
