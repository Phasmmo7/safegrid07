"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button, Card, Input } from "@/app/components/ui";

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

    // Simulated auth - replace with Supabase
    await new Promise((r) => setTimeout(r, 1500));

    if (email === "demo@safegrid.com" && password === "demo123") {
      window.location.href = "/onboarding/contacts";
    } else {
      setError("Invalid credentials. Try demo@safegrid.com / demo123");
      setIsLoading(false);
    }
  };

  return (
    <Card glass className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 tracking-tight">
          Welcome back
        </h2>
        <p className="text-muted">
          Sign in to access your safety dashboard
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2 text-muted"
          >
            Email address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            icon={<Mail className="w-5 h-5" />}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-2 text-muted"
          >
            Password
          </label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            icon={<Lock className="w-5 h-5" />}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-input-border bg-input-bg text-gold focus:ring-gold/30"
            />
            <span className="text-sm text-muted">Remember me</span>
          </label>
          <Link
            href="#"
            className="text-sm text-gold hover:text-gold-hover transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" block loading={isLoading}>
          Sign In
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-card-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 text-muted">or continue with</span>
        </div>
      </div>

      <Button type="button" variant="ghost" block className="gap-3">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Sign in with Google
      </Button>

      <p className="text-center text-sm text-muted mt-8">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-gold hover:text-gold-hover font-medium transition-colors"
        >
          Create one now
        </Link>
      </p>

      <div className="mt-6 p-4 rounded-lg bg-gold-dim border border-gold/20">
        <p className="text-xs text-center text-muted">
          <span className="text-gold font-medium">Demo:</span>{" "}
          demo@safegrid.com / demo123
        </p>
      </div>
    </Card>
  );
}
