"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLockup } from "@/app/components/brand";
import SplashField from "@/app/components/splash-field";

/* Boot screen. Runs for 2s then replaces to /login.
   Auto-redirect and duration are product behaviour, preserved as-is. */

const BOOT_MS = 2000;

export default function SplashScreen() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const out = window.setTimeout(() => setLeaving(true), BOOT_MS - 260);
    const nav = window.setTimeout(() => router.replace("/login"), BOOT_MS);
    return () => {
      window.clearTimeout(out);
      window.clearTimeout(nav);
    };
  }, [router]);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background">
      {/*
        No photograph ships yet. Rather than decorate with a generic gradient,
        this draws the product's own idea: people cluster along a route, and
        the route traces itself. Swap in real night-street photography later
        with:
          <Image src="/images/boot-night.jpg" alt="" fill priority
                 sizes="100vw" className="object-cover" />
        behind the same scrim.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 8% 30%, rgba(255,179,0,0.12) 0%, rgba(255,179,0,0.03) 32%, transparent 62%)",
        }}
      />
      <SplashField />

      {/* Scrim. Guarantees the lockup and line keep their contrast whatever
          the field is doing behind them. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40"
      />

      <div className="relative min-h-[100dvh] flex flex-col justify-center px-6 sm:px-10 lg:px-16">
        <div
          className="max-w-xl transition-opacity duration-200 ease-out"
          style={{ opacity: leaving ? 0 : 1 }}
        >
          <div className="animate-rise">
            <BrandLockup />
          </div>

          <p
            className="animate-rise mt-8 text-2xl sm:text-3xl leading-[1.25] tracking-[-0.02em] text-muted max-w-[18ch] sm:max-w-none"
            style={{ animationDelay: "120ms" }}
          >
            From emergency response to{" "}
            <span className="text-foreground">preventive safety</span>.
          </p>
        </div>
      </div>

      {/* Load progress. Communicates time remaining, so it earns its motion. */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-card-border">
        <div
          className="h-full bg-gold animate-fill"
          style={{ animationDuration: `${BOOT_MS}ms` }}
        />
      </div>
    </div>
  );
}
