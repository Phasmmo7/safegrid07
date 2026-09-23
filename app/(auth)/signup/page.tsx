"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Phone, ArrowRight, Loader2, Check } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    window.location.href = "/dashboard";
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Create your account</h2>
        <p className="text-muted">
          Join SAFEGRID and travel safer
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-muted">
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-input-bg border border-input-border text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-muted">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-input-bg border border-input-border text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2 text-muted">
            Phone number
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-input-bg border border-input-border text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2 text-muted">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-input-bg border border-input-border text-foreground placeholder:text-muted/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
            />
          </div>
          <div className="mt-2 flex gap-3">
            {["6+ chars", "1 number", "1 symbol"].map((rule) => (
              <span key={rule} className="flex items-center gap-1 text-xs text-muted">
                <Check className="w-3 h-3 text-gold/50" />
                {rule}
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-gold text-background font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gold-hover transition-all glow-warm-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-8">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-gold hover:text-gold-hover font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
