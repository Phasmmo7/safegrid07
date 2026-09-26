"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Phone, ArrowRight, Check } from "lucide-react";
import { Button, Card, Input } from "@/app/components/ui";

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
    window.location.href = "/onboarding/contacts";
  };

  return (
    <Card glass className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 tracking-tight">
          Create your account
        </h2>
        <p className="text-muted">Join SAFEGRID and travel safer</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-2 text-muted"
          >
            Full name
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
            icon={<User className="w-5 h-5" />}
          />
        </div>

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
            htmlFor="phone"
            className="block text-sm font-medium mb-2 text-muted"
          >
            Phone number
          </label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            required
            icon={<Phone className="w-5 h-5" />}
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            required
            icon={<Lock className="w-5 h-5" />}
          />
          <div className="mt-2 flex gap-3">
            {["6+ chars", "1 number", "1 symbol"].map((rule) => (
              <span key={rule} className="flex items-center gap-1 text-xs text-muted">
                <Check className="w-3 h-3 text-gold/60" />
                {rule}
              </span>
            ))}
          </div>
        </div>

        <Button type="submit" block loading={isLoading}>
          Create Account
          <ArrowRight className="w-4 h-4" />
        </Button>
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
    </Card>
  );
}
