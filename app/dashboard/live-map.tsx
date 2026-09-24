"use client";

import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Crosshair,
  Loader2,
  MapPin,
  Satellite,
  TriangleAlert,
} from "lucide-react";
import {
  MAPBOX_TOKEN,
  MAPBOX_TOKEN_MISSING,
} from "../lib/safegrid-store";

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
    timestamp: number;
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

      marker = new mapboxgl.Marker({ color: "#ffb300" })
        .setLngLat(FALLBACK)
        .addTo(map);

      const applyPosition = (
        lat: number,
        lng: number,
        accuracy?: number,
      ) => {
        map?.easeTo({ center: [lng, lat], essential: false });
        marker?.setLngLat([lng, lat]);
        if (!cancelled) {
          setPosition({ lat, lng, accuracy, timestamp: Date.now() });
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

  if (status === "no-token") {
    return (
      <div className="h-[420px] rounded-2xl bg-card border border-card-border flex items-center justify-center p-8 text-center">
        <div className="max-w-sm">
          <TriangleAlert className="w-8 h-8 text-gold mx-auto mb-3" />
          <h3 className="font-semibold mb-1">Mapbox token missing</h3>
          <p className="text-sm text-muted">
            Add your Mapbox public token to{" "}
            <code className="text-gold">.env.local</code> as{" "}
            <code className="text-gold">
              NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxxx
            </code>{" "}
            to see live location.
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="h-[420px] rounded-2xl bg-card border border-card-border flex items-center justify-center p-8 text-center">
        <TriangleAlert className="w-8 h-8 text-danger mx-auto mb-3" />
        <p className="text-sm text-muted">
          Could not load the map. Check that your Mapbox token is valid and has
          the map styles enabled.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-card-border relative">
      <div ref={containerRef} className="h-[420px] w-full bg-card" />

      {/* Overlay chip */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-card-border text-xs font-medium">
          <MapPin className="w-3.5 h-3.5 text-gold" />
          Live Location
          {status === "ready" ? (
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          ) : (
            <Loader2 className="w-3 h-3 text-muted animate-spin" />
          )}
        </div>
        {permission === "denied" && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-danger/20 backdrop-blur-sm border border-danger/30 text-xs text-danger">
            <TriangleAlert className="w-3.5 h-3.5" />
            Location blocked — showing default view
          </div>
        )}
      </div>

      {/* Coordinate card */}
      {position ? (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-10 px-4 py-3 rounded-xl bg-background/85 backdrop-blur-sm border border-card-border">
          <div className="text-xs text-muted flex items-center gap-1.5 mb-1">
            <Crosshair className="w-3.5 h-3.5 text-gold" />
            Your live position{" "}
            {position.accuracy ? (
              <span className="text-muted/60">
                · ±{Math.round(position.accuracy)}m accuracy
              </span>
            ) : null}
          </div>
          <div className="font-mono text-sm">
            {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
          </div>
        </div>
      ) : (
        <div className="absolute bottom-4 left-4 z-10 px-4 py-2.5 rounded-xl bg-background/85 backdrop-blur-sm border border-card-border text-xs text-muted flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 text-gold animate-spin" />
          Fetching your location…
        </div>
      )}

      {/* Style badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-card-border text-xs text-muted">
        <Satellite className="w-3.5 h-3.5 text-primary" />
        Dark satellite streets · Mapbox
      </div>
    </div>
  );
}