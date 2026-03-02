"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HiveMarketLogo } from "@/components/icons/hive-market-logo";
import { createClient } from "@/lib/supabase/client";

export function SignUpForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  async function handleEmailSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="mb-4 text-4xl">✉️</div>
          <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a confirmation link to <strong className="text-foreground">{email}</strong>.
            Click the link to activate your account.
          </p>
          <Link href="/auth/login">
            <Button variant="outline" className="mt-6">
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-6 inline-block">
            <HiveMarketLogo iconOnly />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join Hive Market to discover and publish tools
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm text-muted-foreground">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm text-muted-foreground">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Minimum 6 characters
            </p>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full gap-2 bg-violet-600 text-white hover:bg-violet-700"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={`/auth/login${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
            className="text-violet-400 hover:text-violet-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
