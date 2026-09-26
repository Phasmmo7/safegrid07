"use client";

import { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { Loader2, TriangleAlert } from "lucide-react";
import {
  MAPBOX_TOKEN,
  MAPBOX_TOKEN_MISSING,
} from "../lib/safegrid-store";
import { positionAlongPath } from "../lib/geo";
import type { LngLat } from "../lib/geo";
import type { RouteOption } from "../lib/routes";
import { PALETTE, hexToRgba } from "../lib/palette";

type JourneyMapProps = {
  routes: RouteOption[];
  activeRouteId: string;
  from: LngLat;
  to: LngLat;
  progress: number;
};

function featureCollection(routes: RouteOption[], activeId: string) {
  return {
    type: "FeatureCollection",
    features: routes.map((r) => ({
      type: "Feature",
      properties: {
        id: r.id,
        active: r.id === activeId ? 1 : 0,
        color: r.color,
      },
      geometry: { type: "LineString", coordinates: r.path },
    })),
  };
}

export default function JourneyMap({
  routes,
  activeRouteId,
  from,
  to,
  progress,
}: JourneyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("mapbox-gl").Map | null>(null);
  const loadedRef = useRef(false);
  const dotRef = useRef<import("mapbox-gl").Marker | null>(null);
  const fromDotRef = useRef<import("mapbox-gl").Marker | null>(null);
  const toDotRef = useRef<import("mapbox-gl").Marker | null>(null);
  const lastFitKeyRef = useRef("");

  function applyActiveVisual(rt: RouteOption[], active: string) {
    const map = mapRef.current;
    if (!map || !loadedRef.current) return;
    const source = map.getSource("routes") as
      | import("mapbox-gl").GeoJSONSource
      | undefined;
    if (source) source.setData(featureCollection(rt, active));

    const fitKey = rt
      .map((r) => r.id)
      .sort()
      .join("|");
    if (fitKey !== lastFitKeyRef.current) {
      lastFitKeyRef.current = fitKey;
      if (rt.length > 0) {
        const coords = rt.flatMap((r) => r.path);
        const lngs = coords.map((c) => c[0]);
        const lats = coords.map((c) => c[1]);
        map.fitBounds(
          [
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)],
          ],
          { padding: 60, maxZoom: 14.5 },
        );
      }
    }
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (MAPBOX_TOKEN_MISSING) return;

    let disposed = false;
    let map: import("mapbox-gl").Map | null = null;

    const makeDot = (
      size: number,
      color: string,
      glow?: string,
    ) => {
      const el = document.createElement("div");
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.borderRadius = "9999px";
      el.style.background = color;
      el.style.border = `3px solid ${PALETTE.background}`;
      if (glow)
        el.style.boxShadow = `0 0 0 5px ${hexToRgba(PALETTE.gold, 0.25)}, 0 0 16px ${glow}`;
      return el;
    };

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (disposed || !container) return;
      mapboxgl.accessToken = MAPBOX_TOKEN;

      try {
        map = new mapboxgl.Map({
          container,
          style: "mapbox://styles/mapbox/dark-v11",
          center: from,
          zoom: 13,
        });
      } catch {
        return;
      }
      mapRef.current = map;
      map.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.on("load", () => {
        if (disposed || !map) return;
        loadedRef.current = true;

        map.addSource("routes", {
          type: "geojson",
          data: featureCollection(routes, activeRouteId),
        });
        map.addLayer({
          id: "route-casing",
          type: "line",
          source: "routes",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": PALETTE.background,
            "line-width": 12,
            "line-opacity": 0.9,
          },
        });
        map.addLayer({
          id: "route-glow",
          type: "line",
          source: "routes",
          filter: ["==", ["get", "active"], 1],
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": PALETTE.gold,
            "line-width": 16,
            "line-opacity": 0.22,
          },
        });
        map.addLayer({
          id: "routes",
          type: "line",
          source: "routes",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": ["get", "color"],
            "line-width": ["case", ["==", ["get", "active"], 1], 6, 3.5],
            "line-opacity": ["case", ["==", ["get", "active"], 1], 1, 0.55],
          },
        });

        fromDotRef.current = new mapboxgl.Marker({
          element: makeDot(16, PALETTE.safe),
        })
          .setLngLat(from)
          .addTo(map);
        toDotRef.current = new mapboxgl.Marker({
          element: makeDot(16, PALETTE.orange),
        })
          .setLngLat(to)
          .addTo(map);
        dotRef.current = new mapboxgl.Marker({
          element: makeDot(18, PALETTE.gold, hexToRgba(PALETTE.gold, 0.8)),
        })
          .setLngLat(from)
          .addTo(map);

        applyActiveVisual(routes, activeRouteId);
      });

      map.on("error", () => {
        /* transient tile errors are ignored */
      });
    })();

    return () => {
      disposed = true;
      loadedRef.current = false;
      lastFitKeyRef.current = "";
      if (map) {
        map.remove();
        mapRef.current = null;
        map = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyActiveVisual(routes, activeRouteId);
  }, [routes, activeRouteId]);

  useEffect(() => {
    const dot = dotRef.current;
    if (!mapRef.current || !loadedRef.current || !dot) return;
    const active =
      routes.find((r) => r.id === activeRouteId) ?? routes[0] ?? null;
    if (active) dot.setLngLat(positionAlongPath(active.path, progress));
  }, [progress, activeRouteId, routes]);

  if (MAPBOX_TOKEN_MISSING) {
    return (
      <div className="h-full min-h-[420px] rounded-xl bg-card border border-card-border flex items-center justify-center p-8 text-center">
        <div className="max-w-sm">
          <TriangleAlert className="w-8 h-8 text-gold mx-auto mb-3" />
          <h3 className="font-semibold mb-1">Mapbox token missing</h3>
          <p className="text-sm text-muted">
            Set{" "}
            <code className="text-gold">
              NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxxx
            </code>{" "}
            in <code className="text-gold">.env.local</code> to draw your route
            on the live map. Routing still works below with simulated paths.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[420px]">
      <div
        ref={containerRef}
        className="h-full min-h-[420px] w-full rounded-xl overflow-hidden border border-card-border"
      />
      {routes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="px-4 py-2.5 rounded-xl bg-background/85 backdrop-blur-sm border border-card-border text-sm text-muted flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-gold animate-spin" />
            Finding routes…
          </div>
        </div>
      )}
    </div>
  );
}