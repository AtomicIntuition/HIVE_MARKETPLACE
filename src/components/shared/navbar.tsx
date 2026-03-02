"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Search, LogOut, Settings, LayoutDashboard, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HiveMarketLogo } from "@/components/icons/hive-market-logo";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/hooks/use-user";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { href: "/tools", label: "Browse Tools" },
  { href: "/stacks", label: "Stacks" },
  { href: "/categories", label: "Categories" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, loading } = useUser();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  }

  const avatarUrl = user?.user_metadata?.avatar_url;
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <HiveMarketLogo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/tools">
            <Button variant="ghost" size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </Link>

          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-border/50 p-0.5 transition-colors hover:border-violet-500/30"
              >
                {avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={avatarUrl}
                    alt={displayName || "User"}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-medium text-white">
                    {(displayName || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-border/50 bg-card p-1 shadow-xl">
                    <div className="border-b border-border/50 px-3 py-2">
                      <p className="text-sm font-medium text-foreground">{displayName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  className="bg-violet-600 text-white hover:bg-violet-700"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-b border-border/50 bg-background transition-all duration-200 md:hidden",
          mobileOpen ? "max-h-[calc(100vh-4rem)]" : "max-h-0 border-b-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-6 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
              <div className="flex items-center gap-2 px-3 py-1">
                {avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={avatarUrl} alt="" className="h-6 w-6 rounded-full" />
                ) : (
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm text-foreground">{displayName}</span>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/publish"
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Publish a Tool
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileOpen(false);
                }}
                className="w-full rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:text-foreground"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
                <Button
                  size="sm"
                  className="w-full bg-violet-600 text-white hover:bg-violet-700"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
