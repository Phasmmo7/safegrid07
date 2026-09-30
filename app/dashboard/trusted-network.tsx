"use client";

import { useEffect, useState } from "react";
import { Phone, UserPlus } from "lucide-react";
import { EmergencyContact, loadContacts } from "../lib/safegrid-store";

/* Sample placeholders, shown only before the user has saved their own circle.
   Real numbers replace these on first setup. */
const SAMPLE: EmergencyContact[] = [
  { name: "Lakshmi Rao", phone: "+91 98450 21874" },
  { name: "Arjun Menon", phone: "+91 99002 77341" },
  { name: "Priya Nair", phone: "+91 88661 40529" },
];

export default function TrustedNetwork() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(SAMPLE);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const loaded = loadContacts();
      if (loaded.length > 0) {
        setContacts(loaded.slice(0, 3));
        setSaved(true);
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  if (contacts.length === 0) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted">
        <UserPlus className="w-4 h-4 text-gold" strokeWidth={1.75} />
        No contacts saved yet.
      </div>
    );
  }

  return (
    <div>
      {/* One row with hairline separators. Previously three separate bordered
          cards in a grid, which put six borders around three short names. */}
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-y-5 sm:gap-x-6">
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
            <li
              key={contact.name || index}
              className="flex items-center gap-3 min-w-0"
            >
              <span
                aria-hidden="true"
                className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full border border-gold-edge bg-gold-dim font-mono text-xs text-gold"
              >
                {initials}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {contact.name}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-muted">
                  <Phone className="w-3 h-3 shrink-0" strokeWidth={2} />
                  <span className="truncate">{contact.phone}</span>
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      {!saved && (
        <p className="mt-5 text-xs text-dim">
          Sample contacts. Add your own to replace them.
        </p>
      )}
    </div>
  );
}
