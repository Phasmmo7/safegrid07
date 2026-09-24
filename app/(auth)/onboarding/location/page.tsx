"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Crosshair,
  Loader2,
  Locate,
  ShieldCheck,
  TriangleAlert,
  Globe,
} from "lucide-react";
import { loadLocation, saveLocation } from "../../../lib/safegrid-store";

type Status = "idle" | "requesting" | "granted" | "denied";

export default function OnboardingLocationPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const existing = loadLocation();
      if (existing?.granted) {
        router.replace("/dashboard");
        return;
      }
      setLoading(false);
    }, 0);
    return () => window.clearTimeout(t);
  }, [router]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }
    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        saveLocation({ granted: true, lat, lng, ts: Date.now() });
        setCoords({ lat, lng });
        setStatus("granted");
        window.setTimeout(() => router.push("/dashboard"), 900);
      },
      () => {
        setStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const continueAnyway = () => {
    saveLocation({ granted: false, lat: 0, lng: 0, ts: Date.now() });
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="p-8 rounded-2xl bg-card/50 border border-card-border flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 rounded-2xl bg-card/50 border border-card-border backdrop-blur-sm">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-dim border border-gold/20 text-xs text-gold font-medium">
            <Locate className="w-3.5 h-3.5" /> Step 2 of 2
          </span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Enable live location</h2>
        <p className="text-muted">
          SAFEGRID needs your location to show you on the safety map and share a
          live position with your safety net during an SOS.
        </p>
      </div>

      {/* Permission Illustration */}
      <div className="mb-8 rounded-2xl bg-gold-dim border border-gold/20 p-6 text-center">
        <div className="relative mx-auto mb-4 w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gold/10 animate-pulse-sos" />
          <div className="absolute inset-4 rounded-full bg-gold/15 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Crosshair className="w-10 h-10 text-gold" />
          </div>
        </div>
        <p className="text-sm text-muted mb-1">
          Your live position stays
          <span className="text-gold font-medium"> private</span> — only shared
          with your 3 emergency contacts, and only during an active SOS.
        </p>
      </div>

      {/* Status Message */}
      {status === "requesting" && (
        <div className="mb-6 p-4 rounded-xl bg-primary-dim border border-primary/20 text-sm text-muted flex items-center gap-3">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
          Waiting for you to allow location access in the browser prompt…
        </div>
      )}

      {status === "granted" && coords && (
        <div className="mb-6 p-4 rounded-xl bg-primary-dim border border-primary/20 text-sm flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-safe shrink-0" />
          <span className="text-muted">
            Location enabled at{" "}
            <span className="text-safe font-medium font-mono">
              {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </span>
            . Opening your dashboard…
          </span>
        </div>
      )}

      {status === "denied" && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger flex items-start gap-3">
          <TriangleAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            Location was blocked or the request timed out. You can continue, but
            live tracking on the dashboard will be unavailable.
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={requestLocation}
          disabled={status === "requesting"}
          className="w-full py-3.5 rounded-xl bg-gold text-background font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gold-hover transition-all glow-warm-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "requesting" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : status === "granted" ? (
            <>
              Access Enabled <ShieldCheck className="w-4 h-4" />
            </>
          ) : (
            <>
              <Locate className="w-4 h-4" /> Allow Location Access
            </>
          )}
        </button>

        {status !== "granted" && (
          <button
            type="button"
            onClick={continueAnyway}
            className="w-full py-3 rounded-xl bg-card border border-card-border text-muted text-sm hover:text-foreground hover:border-primary/30 transition-all"
          >
            Continue without location
          </button>
        )}
      </div>

      <p className="text-center text-xs text-muted mt-6 flex items-center justify-center gap-1.5">
        <Globe className="w-3.5 h-3.5" />
        Used only while you&apos;re on an active Safe Journey or SOS.
      </p>
    </div>
  );
}