"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, LogIn, TriangleAlert } from "lucide-react";
import { Button, Divider, Field, Input } from "@/app/components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulated auth, pending Supabase wiring.
    await new Promise((r) => setTimeout(r, 1500));

    if (email === "demo@safegrid.com" && password === "demo123") {
      window.location.href = "/onboarding/contacts";
    } else {
      setError("Those details did not match an account.");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-[-0.02em]">Welcome back</h1>
      <p className="mt-2 text-muted text-sm">
        Sign in to reach your safety dashboard.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl bg-danger-dim border border-danger-edge px-4 py-3 text-sm text-danger-text flex items-start gap-2.5"
        >
          <TriangleAlert className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Field label="Email address" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            invalid={!!error}
            icon={<Mail className="w-4 h-4" strokeWidth={1.75} />}
          />
        </Field>

        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
            invalid={!!error}
            icon={<Lock className="w-4 h-4" strokeWidth={1.75} />}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-lg text-muted hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" strokeWidth={1.75} />
                ) : (
                  <Eye className="w-4 h-4" strokeWidth={1.75} />
                )}
              </button>
            }
          />
        </Field>

        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer text-sm text-muted hover:text-foreground transition-colors">
            <input
              type="checkbox"
              name="remember"
              className="w-4 h-4 rounded accent-gold"
            />
            Keep me signed in
          </label>
          <Link
            href="#"
            className="text-sm text-gold hover:text-gold-hover transition-colors"
          >
            Reset password
          </Link>
        </div>

        <Button type="submit" block loading={isLoading}>
          Sign in
          <LogIn className="w-4 h-4" strokeWidth={2} />
        </Button>
      </form>

      <div className="my-8 flex items-center gap-4">
        <Divider className="flex-1" />
        <span className="text-xs text-dim">or</span>
        <Divider className="flex-1" />
      </div>

      <Button type="button" variant="ghost" block>
        <Image
          src="/images/google-mark.svg"
          alt=""
          width={20}
          height={20}
          className="w-5 h-5"
        />
        Continue with Google
      </Button>

      <p className="mt-8 text-sm text-muted">
        No account yet?{" "}
        <Link
          href="/signup"
          className="text-gold hover:text-gold-hover font-medium transition-colors"
        >
          Create one
        </Link>
      </p>

      {/* Sample credentials. Labelled as sample because they are. */}
      <div className="mt-8 rounded-xl bg-surface-sunken border border-hairline px-4 py-3">
        <p className="text-xs text-muted">
          <span className="text-foreground font-medium">Sample account</span>
        </p>
        <p className="mt-1 font-mono text-xs text-dim">
          demo@safegrid.com / demo123
        </p>
      </div>
    </div>
  );
}
