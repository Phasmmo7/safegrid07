"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CircleCheck,
  Loader2,
  Phone,
  TriangleAlert,
  User,
  Users,
} from "lucide-react";
import {
  EmergencyContact,
  loadContacts,
  saveContacts,
} from "../../../lib/safegrid-store";
import {
  Button,
  Input,
  Panel,
  SetupProgress,
} from "@/app/components/ui";

const EMPTY: EmergencyContact = { name: "", phone: "" };
const SLOT_COUNT = 3;
const RELATIONSHIPS = ["Family", "Friend", "Work", "Other"];
const STEPS = ["Add your safety net", "Enable live location"];

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
      if (existing.length >= SLOT_COUNT) {
        router.replace("/onboarding/location");
        return;
      }
      if (existing.length > 0) {
        setContacts(
          [...existing, ...Array(SLOT_COUNT).fill(EMPTY)].slice(0, SLOT_COUNT),
        );
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
        !c.name.trim() ||
        !c.phone.trim() ||
        c.phone.replace(/\D/g, "").length < 10,
    );

    if (invalid) {
      setError(
        "Every contact needs a name and a phone number of at least 10 digits.",
      );
      return;
    }

    setSaving(true);
    saveContacts(contacts);
    window.setTimeout(() => router.push("/onboarding/location"), 600);
  };

  if (loading) {
    return (
      <Panel className="flex items-center justify-center py-16">
        <Loader2
          className="w-6 h-6 text-gold animate-spin"
          strokeWidth={2}
          role="status"
          aria-label="Loading saved contacts"
        />
      </Panel>
    );
  }

  return (
    <div>
      <SetupProgress current={0} steps={STEPS} />

      <h1 className="mt-8 text-2xl font-semibold tracking-[-0.02em]">
        Add your safety net
      </h1>
      <p className="mt-2 text-sm text-muted leading-relaxed">
        Choose three people to alert if you raise an SOS. Their details are
        stored only on this device.
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

      <form onSubmit={handleSubmit} className="mt-8">
        {/* One panel, three hairline-separated groups. Previously three
            separate cards stacked with a gap, which read as card soup. */}
        <Panel className="px-5">
          <ul className="divide-y divide-hairline">
            {contacts.map((contact, index) => (
              <li key={index} className="py-6 first:pt-5 last:pb-5">
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center w-7 h-7 rounded-full border border-gold-edge bg-gold-dim font-mono text-xs text-gold"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium">
                    <span className="sr-only">Emergency contact </span>
                    {relationship[index]}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {RELATIONSHIPS.map((rel) => {
                    const selected = relationship[index] === rel;
                    return (
                      <button
                        key={rel}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          setRelationship((prev) =>
                            prev.map((r, i) => (i === index ? rel : r)),
                          )
                        }
                        className={
                          selected
                            ? "rounded-full border border-gold-edge bg-gold-dim px-3 py-1 text-xs font-medium text-gold transition-colors"
                            : "rounded-full border border-card-border px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-gold-edge hover:text-foreground"
                        }
                      >
                        {rel}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 space-y-3">
                  <Input
                    type="text"
                    aria-label={`${relationship[index]} contact ${index + 1} name`}
                    value={contact.name}
                    onChange={(e) => updateContact(index, "name", e.target.value)}
                    placeholder="Full name"
                    required
                    icon={<User className="w-4 h-4" strokeWidth={1.75} />}
                  />
                  <Input
                    type="tel"
                    aria-label={`${relationship[index]} contact ${index + 1} phone`}
                    value={contact.phone}
                    onChange={(e) => updateContact(index, "phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    icon={<Phone className="w-4 h-4" strokeWidth={1.75} />}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Button type="submit" block className="mt-6" loading={saving}>
          Save and continue
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </Button>

        {saving && (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-safe-text">
            <CircleCheck className="w-3.5 h-3.5" strokeWidth={2} />
            Contacts saved to this device
          </p>
        )}
      </form>

      <p className="mt-8 flex items-center justify-center gap-2 text-xs text-muted">
        <Users className="w-3.5 h-3.5" strokeWidth={1.75} />
        You can change these later from the dashboard.
      </p>

      <p className="mt-4 text-center text-sm">
        <Link
          href="/login"
          className="text-gold hover:text-gold-hover transition-colors"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
