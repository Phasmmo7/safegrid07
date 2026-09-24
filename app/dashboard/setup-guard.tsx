"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadContacts, loadLocation } from "../lib/safegrid-store";

export default function SetupGuard() {
  const router = useRouter();

  useEffect(() => {
    const contacts = loadContacts();
    const location = loadLocation();
    if (contacts.length < 3) {
      router.replace("/onboarding/contacts");
    } else if (!location) {
      router.replace("/onboarding/location");
    }
  }, [router]);

  return null;
}