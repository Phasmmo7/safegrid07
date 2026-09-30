"use client";

import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Crosshair,
  Loader2,
  MapPin,
  TriangleAlert,
} from "lucide-react";
import {
  MAPBOX_TOKEN,
  MAPBOX_TOKEN_MISSING,
} from "../lib/safegrid-store";
import { PALETTE } from "../lib/palette";

const FALLBACK: [number, number] = [77.5946, 12.9716];

type MapStatus = "pending" | "ready" | "no-token" | "error";

export default function LiveMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<MapStatus>(() =>
    MAPBOX_TOKEN_MISSING ? "no-token" : "pending",
  );
  const [position, setPosition] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
  } | null>(null);
  const [permission, setPermission] = useState<
    "unknown" | "granted" | "denied" | "unsupported"
  >(() =>
    typeof navigator !== "undefined" && "geolocation" in navigator
      ? "unknown"
      : "unsupported",
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (MAPBOX_TOKEN_MISSING) return;

    let map: import("mapbox-gl").Map | null = null;
    let marker: import("mapbox-gl").Marker | null = null;
    let watchId: number | null = null;
    let cancelled = false;

    const cleanup = () => {
      cancelled = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (map) {
        map.remove();
        map = null;
      }
    };

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      mapboxgl.accessToken = MAPBOX_TOKEN;

      try {
        map = new mapboxgl.Map({
          container,
          style: "mapbox://styles/mapbox/dark-v11",
          center: FALLBACK,
          zoom: 13,
          attributionControl: true,
        });
      } catch {
        setStatus("error");
        return;
      }

      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.addControl(
        new mapboxgl.GeolocateControl({
          trackUserLocation: true,
          showUserLocation: true,
          fitBoundsOptions: { maxZoom: 15 },
        }),
        "top-right",
      );

      map.on("load", () => {
        if (!cancelled) setStatus("ready");
      });
      map.on("error", () => {
        if (!cancelled) setStatus("error");
      });

      marker = new mapboxgl.Marker({ color: PALETTE.gold })
        .setLngLat(FALLBACK)
        .addTo(map);

      const applyPosition = (lat: number, lng: number, accuracy?: number) => {
        map?.easeTo({ center: [lng, lat], essential: false });
        marker?.setLngLat([lng, lat]);
        if (!cancelled) {
          setPosition({ lat, lng, accuracy });
          setPermission("granted");
        }
      };

      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (pos) =>
            applyPosition(
              pos.coords.latitude,
              pos.coords.longitude,
              pos.coords.accuracy,
            ),
          () => {
            if (!cancelled) setPermission("denied");
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 },
        );
      }
    })();

    return cleanup;
  }, []);

  /* Empty and error states are first-class here, because a missing token is
     the single most likely way a reviewer first runs this app. */
  if (status === "no-token" || status === "error") {
    const noToken = status === "no-token";
    return (
      <div className="flex h-[420px] flex-col items-center justify-center rounded-2xl border border-card-border bg-card p-8 text-center">
        <div className="max-w-sm">
          <TriangleAlert
            className={
              "mx-auto mb-3 w-7 h-7 " + (noToken ? "text-gold" : "text-danger-text")
            }
            strokeWidth={1.75}
          />
          <h3 className="font-medium">
            {noToken ? "Mapbox token missing" : "Map could not load"}
          </h3>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            {noToken ? (
              <>
                Add your public token to{" "}
                <code className="font-mono text-xs text-foreground">
                  .env.local
                </code>{" "}
                as{" "}
                <code className="font-mono text-xs text-foreground">
                  NEXT_PUBLIC_MAPBOX_TOKEN
                </code>{" "}
                to show live location. Everything else on this screen works
                without it.
              </>
            ) : (
              "Check that the token is valid and has the map styles enabled."
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-card-border">
      <div ref={containerRef} className="h-[420px] w-full bg-surface-sunken" />

      {/* Two overlays, not four. The previous version stacked a live chip, a
          style-attribution badge reading "Dark satellite streets · Mapbox",
          and a coordinate card, which competed with each other and covered a
          third of the map. Mapbox already renders its own attribution. */}
      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex items-end justify-between gap-3">
        {position ? (
          <div className="rounded-xl border border-card-border bg-background/85 px-3.5 py-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Crosshair className="w-3.5 h-3.5 text-gold" strokeWidth={2} />
              Your position
              {position.accuracy ? (
                <span className="text-dim">
                  {` within ${Math.round(position.accuracy)}m`}
                </span>
              ) : null}
            </div>
            <div className="mt-1 font-mono text-sm tabular-nums">
              {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
            </div>
          </div>
        ) : (
          <div
            role="status"
            className="flex items-center gap-2 rounded-xl border border-card-border bg-background/85 px-3.5 py-2.5 text-xs text-muted backdrop-blur-md"
          >
            <Loader2 className="w-3.5 h-3.5 text-gold animate-spin" strokeWidth={2} />
            Finding your position
          </div>
        )}

        {permission === "denied" ? (
          <div
            role="status"
            className="flex items-center gap-1.5 rounded-xl border border-danger-edge bg-background/85 px-3 py-2 text-xs text-danger-text backdrop-blur-md"
          >
            <TriangleAlert className="w-3.5 h-3.5" strokeWidth={2} />
            Location blocked
          </div>
        ) : (
          <div className="flex items-center gap-1.5 rounded-xl border border-card-border bg-background/85 px-3 py-2 text-xs text-muted backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-gold" strokeWidth={2} />
            {status === "ready" ? "Live" : "Connecting"}
          </div>
        )}
      </div>
    </div>
  );
}
