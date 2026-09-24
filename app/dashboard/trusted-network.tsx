"use client";

import { useEffect, useState } from "react";
import { Phone, UserPlus } from "lucide-react";
import { EmergencyContact, loadContacts } from "../lib/safegrid-store";

const FALLBACK: EmergencyContact[] = [
  { name: "Mom", phone: "+91 98XXXXXX21" },
  { name: "Arjun", phone: "+91 98XXXXXX37" },
  { name: "Priya", phone: "+91 98XXXXXX54" },
];

export default function TrustedNetwork() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(FALLBACK);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const saved = loadContacts();
      if (saved.length > 0) setContacts(saved.slice(0, 3));
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  if (contacts.length === 0) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-background border border-card-border text-sm text-muted">
        <UserPlus className="w-4 h-4 text-gold" />
        No contacts added yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {contacts.map((contact, index) => {
        const initials = contact.name.trim()
          ? contact.name
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((w) => w[0]?.toUpperCase())
              .join("")
          : `C${index + 1}`;
        return (
          <div
            key={contact.name || index}
            className="flex items-center gap-3 p-3 rounded-xl bg-background border border-card-border"
          >
            <div className="w-10 h-10 rounded-full bg-gold-dim border border-gold/20 text-gold font-semibold flex items-center justify-center">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">
                {contact.name}
              </div>
              <div className="text-xs text-muted flex items-center gap-1 truncate">
                <Phone className="w-3 h-3 shrink-0" />
                {contact.phone}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}