"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Phone,
  ArrowRight,
  Loader2,
  Users,
  CircleCheck,
  TriangleAlert,
} from "lucide-react";
import {
  EmergencyContact,
  loadContacts,
  saveContacts,
} from "../../../lib/safegrid-store";
import { Button, Card, Input, Pill } from "@/app/components/ui";

const EMPTY: EmergencyContact = { name: "", phone: "" };

const RELATIONSHIPS = ["Family", "Friend", "Work", "Other"];

export default function OnboardingContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { ...EMPTY },
    { ...EMPTY },
    { ...EMPTY },
  ]);
  const [relationship, setRelationship] = useState<string[]>([
    "Family",
    "Friend",
    "Family",
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => {
      const existing = loadContacts();
      if (existing.length >= 3) {
        router.replace("/onboarding/location");
        return;
      }
      if (existing.length > 0) {
        const filled = [...existing, ...Array(3).fill(EMPTY)].slice(0, 3);
        setContacts(filled);
      }
      setLoading(false);
    }, 0);
    return () => window.clearTimeout(t);
  }, [router]);

  const updateContact = (
    index: number,
    key: keyof EmergencyContact,
    value: string,
  ) => {
    setContacts((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [key]: value } : c)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const invalid = contacts.some(
      (c) =>
        !c.name.trim() || !c.phone.trim() || c.phone.replace(/\D/g, "").length < 10,
    );

    if (invalid) {
      setError(
        "Please fill in a name and a valid phone number (10+ digits) for all 3 contacts.",
      );
      return;
    }

    setSaving(true);
    saveContacts(contacts);
    window.setTimeout(() => {
      router.push("/onboarding/location");
    }, 600);
  };

  if (loading) {
    return (
      <Card glass className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </Card>
    );
  }

  return (
    <Card glass className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Pill>
            <Users className="w-3.5 h-3.5" /> Step 1 of 2
          </Pill>
        </div>
        <h2 className="text-3xl font-bold mb-2 tracking-tight">
          Add your safety net
        </h2>
        <p className="text-muted">
          Add 3 people SAFEGRID can alert instantly if you raise an SOS. Their
          exact contact details are stored only on your device.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm flex items-start gap-3">
          <TriangleAlert className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Contacts Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {contacts.map((contact, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-background border border-card-border"
          >
            <div className="mb-3 space-y-2">
              <span className="block text-xs font-semibold text-gold uppercase tracking-wider">
                Emergency contact {index + 1}
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {RELATIONSHIPS.map((rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() =>
                      setRelationship((prev) =>
                        prev.map((r, i) => (i === index ? rel : r)),
                      )
                    }
                    className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                      relationship[index] === rel
                        ? "bg-gold text-background font-semibold"
                        : "bg-card border border-card-border text-muted hover:text-foreground"
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="mb-3">
              <Input
                type="text"
                small
                value={contact.name}
                onChange={(e) => updateContact(index, "name", e.target.value)}
                placeholder={`${relationship[index]} member name`}
                required
                icon={<User className="w-4 h-4" />}
              />
            </div>

            {/* Phone */}
            <Input
              type="tel"
              small
              value={contact.phone}
              onChange={(e) => updateContact(index, "phone", e.target.value)}
              placeholder="+91 98765 43210"
              required
              icon={<Phone className="w-4 h-4" />}
            />
          </div>
        ))}

        {/* Submit */}
        <Button type="submit" block loading={saving}>
          Save &amp; Continue
          <ArrowRight className="w-4 h-4" />
        </Button>

        {saving && (
          <p className="text-center text-xs text-muted flex items-center justify-center gap-1.5">
            <CircleCheck className="w-3.5 h-3.5 text-safe" /> Contacts saved
            locally
          </p>
        )}
      </form>

      <p className="text-center text-sm text-muted mt-6">
        <Link href="/login" className="text-gold hover:text-gold-hover transition-colors">
          Back to sign in
        </Link>
      </p>
    </Card>
  );
}