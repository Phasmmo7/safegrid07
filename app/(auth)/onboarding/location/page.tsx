"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Crosshair,
  Globe,
  Loader2,
  LocateFixed,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { loadLocation, saveLocation } from "../../../lib/safegrid-store";
import { Button, Panel, SetupProgress } from "@/app/components/ui";

type Status = "idle" | "requesting" | "granted" | "denied";

const STEPS = ["Add your safety net", "Enable live location"];

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
      <Panel className="flex items-center justify-center py-16">
        <Loader2
          className="w-6 h-6 text-gold animate-spin"
          strokeWidth={2}
          role="status"
          aria-label="Loading saved location"
        />
      </Panel>
    );
  }

  return (
    <div>
      <SetupProgress current={1} steps={STEPS} />

      <h1 className="mt-8 text-2xl font-semibold tracking-[-0.02em]">
        Enable live location
      </h1>
      <p className="mt-2 text-sm text-muted leading-relaxed">
        SAFEGRID needs a position to place you on the safety map and to share
        with your contacts during an SOS.
      </p>

      {/* Radar motif. Static geometry, no looping animation: this panel is
          informational, so it does not need to move. */}
      <div className="relative mt-8 overflow-hidden rounded-2xl border border-gold-edge bg-gold-dim">
        <div className="flex items-center gap-5 p-5">
          <div className="relative shrink-0 w-16 h-16" aria-hidden="true">
            <div className="absolute inset-0 rounded-full border border-gold-edge" />
            <div className="absolute inset-3 rounded-full border border-gold/25" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Crosshair className="w-7 h-7 text-gold" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            Your position stays private. It is shared with your three emergency
            contacts, and only while a journey or SOS is active.
          </p>
        </div>
      </div>

      {status === "requesting" && (
        <div
          role="status"
          className="mt-5 rounded-xl bg-gold-dim border border-gold-edge px-4 py-3 text-sm text-muted flex items-center gap-3"
        >
          <Loader2 className="w-4 h-4 text-gold animate-spin" strokeWidth={2} />
          Waiting for you to allow location access in the browser prompt.
        </div>
      )}

      {status === "granted" && coords && (
        <div
          role="status"
          className="mt-5 rounded-xl bg-safe-dim border border-safe-edge px-4 py-3 text-sm flex items-start gap-3"
        >
          <ShieldCheck
            className="w-4 h-4 text-safe-text shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <span className="text-muted">
            Location enabled at{" "}
            <span className="font-mono text-safe-text">
              {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </span>
            . Opening your dashboard.
          </span>
        </div>
      )}

      {status === "denied" && (
        <div
          role="alert"
          className="mt-5 rounded-xl bg-danger-dim border border-danger-edge px-4 py-3 text-sm text-danger-text flex items-start gap-3"
        >
          <TriangleAlert className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2} />
          <span>
            Location was blocked or the request timed out. You can continue, but
            live tracking on the dashboard will be unavailable.
          </span>
        </div>
      )}

      <div className="mt-8 space-y-3">
        <Button
          type="button"
          onClick={requestLocation}
          block
          loading={status === "requesting"}
        >
          {status === "granted" ? (
            "Access enabled"
          ) : (
            <>
              <LocateFixed className="w-4 h-4" strokeWidth={2} />
              Allow location access
            </>
          )}
        </Button>

        {status !== "granted" && (
          <Button
            type="button"
            variant="quiet"
            block
            onClick={continueAnyway}
          >
            Continue without location
          </Button>
        )}
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
        <Globe className="w-3.5 h-3.5" strokeWidth={1.75} />
        Only used while a Safe Journey or SOS is running.
      </p>
    </div>
  );
}
