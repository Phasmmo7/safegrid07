"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  Lock,
  Mail,
  Phone,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { Button, Field, Input } from "@/app/components/ui";

/* Rules are evaluated against the live value. The previous build rendered a
   gold tick next to all three unconditionally, so the form claimed the
   password was already valid before a character was typed. */
const rules = [
  { id: "length", label: "At least 6 characters", test: (v: string) => v.length >= 6 },
  { id: "number", label: "One number", test: (v: string) => /\d/.test(v) },
  { id: "symbol", label: "One symbol", test: (v: string) => /[^\w\s]/.test(v) },
];

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const results = useMemo(
    () => rules.map((r) => ({ ...r, met: r.test(password) })),
    [password],
  );
  const passwordValid = results.every((r) => r.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated auth, pending Supabase wiring.
    await new Promise((r) => setTimeout(r, 1500));
    window.location.href = "/onboarding/contacts";
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-[-0.02em]">
        Create your account
      </h1>
      <p className="mt-2 text-muted text-sm">
        Two details to finish setting up: your safety net and your location.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Field label="Full name" htmlFor="name">
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
            icon={<User className="w-4 h-4" strokeWidth={1.75} />}
          />
        </Field>

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
            icon={<Mail className="w-4 h-4" strokeWidth={1.75} />}
          />
        </Field>

        <Field
          label="Phone number"
          htmlFor="phone"
          hint="Used to reach you if we cannot reach your contacts."
        >
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            required
            icon={<Phone className="w-4 h-4" strokeWidth={1.75} />}
          />
        </Field>

        <Field
          label="Password"
          htmlFor="password"
          error={
            password.length > 0 && !passwordValid
              ? "Password does not meet all three rules yet."
              : undefined
          }
        >
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            icon={<Lock className="w-4 h-4" strokeWidth={1.75} />}
          />
        </Field>

        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {results.map((rule) => (
            <li
              key={rule.id}
              className={
                rule.met
                  ? "flex items-center gap-1.5 text-xs text-safe-text"
                  : "flex items-center gap-1.5 text-xs text-muted"
              }
            >
              {rule.met ? (
                <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
              ) : (
                <X className="w-3.5 h-3.5 text-dim" strokeWidth={2} />
              )}
              {rule.label}
            </li>
          ))}
        </ul>

        <Button
          type="submit"
          block
          loading={isLoading}
          disabled={!passwordValid}
        >
          Create account
          <UserPlus className="w-4 h-4" strokeWidth={2} />
        </Button>
      </form>

      <p className="mt-8 text-sm text-muted">
        Already registered?{" "}
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
