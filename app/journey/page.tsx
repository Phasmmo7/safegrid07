"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CircleCheck,
  Flag,
  LocateFixed,
  MapPin,
  Navigation,
  RefreshCw,
  Route as RouteIcon,
  Square,
  Timer,
  TriangleAlert,
  Users,
} from "lucide-react";
import JourneyMap from "./journey-map";
import {
  DEFAULT_ORIGIN,
  DESTINATIONS,
  getJourneyRoutes,
  recommendBetterRoute,
  RouteOption,
} from "../lib/routes";
import { loadLocation } from "../lib/safegrid-store";
import SiteHeader from "@/app/components/site-header";
import {
  Button,
  Chip,
  Divider,
  LiveDot,
  Panel,
  Select,
  StatusStrip,
} from "@/app/components/ui";

type Phase = "setup" | "loading" | "active";

export default function JourneyPage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [origin, setOrigin] = useState<[number, number]>(DEFAULT_ORIGIN);
  const [originLabel, setOriginLabel] = useState("Your live location");
  const [destinationId, setDestinationId] = useState(DESTINATIONS[0].id);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [activeId, setActiveId] = useState("");
  const [progress, setProgress] = useState(0);
  const [notice, setNotice] = useState("");
  const [rerouteDelta, setRerouteDelta] = useState<number | null>(null);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const saved = loadLocation();
      if (saved?.granted && saved.lat && saved.lng) {
        setOrigin([saved.lng, saved.lat]);
        setOriginLabel("Your live location");
      } else {
        setOriginLabel("Bengaluru (demo location)");
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "active") return;
    tickRef.current = window.setInterval(() => {
      setProgress((p) => Math.min(0.999, p + 0.002));
    }, 250);
    return () => {
      if (tickRef.current !== null) window.clearInterval(tickRef.current);
    };
  }, [phase]);

  const destination = DESTINATIONS.find((d) => d.id === destinationId)!;
  const activeRoute = routes.find((r) => r.id === activeId) ?? routes[0] ?? null;

  const handleStart = async () => {
    setPhase("loading");
    setNotice("");
    setRerouteDelta(null);
    setProgress(0);
    const rs = await getJourneyRoutes(origin, destination.coords);
    setRoutes(rs);
    setActiveId(rs[0].id);
    setPhase("active");
  };

  const handleStop = () => {
    setPhase("setup");
    setRoutes([]);
    setActiveId("");
    setProgress(0);
    setNotice("");
    setRerouteDelta(null);
  };

  const handleBetterRoute = () => {
    const current = activeRoute;
    if (!current || routes.length === 0) return;
    const result = recommendBetterRoute(routes, current.id);
    setActiveId(result.route.id);
    setRerouteDelta(result.delta);
    setNotice(
      result.isBest
        ? "This is already the busiest route. You have the most people around you."
        : `Rerouted onto ${result.route.name}, the busiest of the options.`,
    );
  };

  const crowd = (route: RouteOption) => (
    <div className="shrink-0 text-right">
      <div className="font-mono text-sm font-medium tabular-nums">
        {route.peoplePresent.toLocaleString("en-IN")}
      </div>
      <div className="text-xs text-muted">people now</div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <SiteHeader>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 -ml-2.5 min-h-11 rounded-lg px-2.5 text-sm text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          Dashboard
        </Link>
      </SiteHeader>

      <main className="flex-1 max-w-7xl mx-auto w-full px-5 sm:px-6 py-8">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">
          Safe journey
        </h1>
        <p className="mt-2 text-sm text-muted max-w-[62ch] leading-relaxed">
          Set a destination, then let SAFEGRID move you onto the route with the
          most people on it.
        </p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
          {/* Control column. The previous build stacked three separate cards
              (setup, current route, alternatives) with gaps. They are now one
              panel with hairline-separated sections, so the column reads as a
              single instrument instead of a pile. */}
          <Panel className="px-5">
            <div className="flex items-center gap-3 py-5">
              <div className="w-9 h-9 rounded-xl bg-gold-dim border border-gold-edge flex items-center justify-center shrink-0">
                <LocateFixed className="w-4 h-4 text-gold" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted">Starting from</div>
                <div className="text-sm font-medium truncate">
                  {originLabel}
                </div>
              </div>
            </div>

            <Divider />

            <div className="py-5">
              <label
                htmlFor="destination"
                className="block text-sm font-medium mb-2"
              >
                Destination
              </label>
              <Select
                id="destination"
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                disabled={phase === "active"}
                icon={<Flag className="w-4 h-4 text-gold" strokeWidth={1.75} />}
              >
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </Select>

              <div className="mt-4">
                {phase !== "active" ? (
                  <Button
                    type="button"
                    onClick={handleStart}
                    block
                    loading={phase === "loading"}
                  >
                    <Navigation className="w-4 h-4" strokeWidth={2} />
                    Start journey
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="danger"
                    block
                    onClick={handleStop}
                  >
                    <Square className="w-3.5 h-3.5" strokeWidth={2.5} />
                    End journey
                  </Button>
                )}
              </div>
            </div>

            {phase === "active" && activeRoute && (
              <>
                <Divider />

                {/* Current route */}
                <div className="py-5">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="flex items-center gap-2 text-sm font-semibold">
                      <RouteIcon
                        className="w-4 h-4 text-gold"
                        strokeWidth={1.75}
                      />
                      Current route
                    </h2>
                    <Chip tone="safe">
                      <LiveDot />
                      Live
                    </Chip>
                  </div>

                  <div className="mt-3.5 font-medium">{activeRoute.name}</div>

                  <dl className="mt-4 flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">Estimated time</dt>
                      <Timer
                        className="w-4 h-4 text-muted"
                        strokeWidth={1.75}
                      />
                      <dd className="font-mono tabular-nums">
                        {activeRoute.etaMinutes} min
                      </dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">Distance</dt>
                      <Navigation
                        className="w-4 h-4 text-muted"
                        strokeWidth={1.75}
                      />
                      <dd className="font-mono tabular-nums">
                        {activeRoute.distanceKm.toFixed(1)} km
                      </dd>
                    </div>
                  </dl>

                  {/* Crowding. The figure leads and a hairline bar supports it,
                      rather than a filled track with a number in a corner. */}
                  <div className="mt-5 rounded-xl bg-gold-dim border border-gold-edge px-4 py-3.5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="text-xs text-muted">
                          People on this route
                        </div>
                        <div className="mt-1 font-mono text-2xl leading-none text-gold tabular-nums">
                          {activeRoute.peoplePresent.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm tabular-nums">
                          {activeRoute.crowdScore}
                          <span className="text-muted">/100</span>
                        </div>
                        <div className="text-xs text-muted">crowding</div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-0.5" aria-hidden="true">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < Math.round(activeRoute.crowdScore / 5)
                              ? "h-1 flex-1 rounded-full bg-gold"
                              : "h-1 flex-1 rounded-full bg-gold/20"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="tinted"
                      block
                      onClick={handleBetterRoute}
                    >
                      <RefreshCw className="w-4 h-4" strokeWidth={2} />
                      Find a busier route
                    </Button>
                  </div>

                  {notice && (
                    <p
                      role="status"
                      className="mt-3.5 flex items-start gap-2 text-xs text-muted leading-relaxed"
                    >
                      <CircleCheck
                        className="w-3.5 h-3.5 text-safe-text shrink-0 mt-0.5"
                        strokeWidth={2}
                      />
                      {notice}
                    </p>
                  )}
                  {rerouteDelta !== null && rerouteDelta > 0 && (
                    <p className="mt-2 flex items-start gap-2 text-xs text-safe-text leading-relaxed">
                      <Users className="w-3.5 h-3.5 shrink-0 mt-0.5" strokeWidth={2} />
                      {rerouteDelta.toLocaleString("en-IN")} more people on this
                      route than the one before.
                    </p>
                  )}
                </div>

                <Divider />

                {/* Alternatives */}
                <div className="py-5">
                  <h2 className="mb-3.5 flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="w-4 h-4 text-gold" strokeWidth={1.75} />
                    Other routes
                  </h2>
                  <ul className="space-y-1.5">
                    {routes.map((route) => {
                      const isActive = route.id === activeId;
                      return (
                        <li key={route.id}>
                          <button
                            type="button"
                            disabled={isActive}
                            onClick={() => {
                              setActiveId(route.id);
                              setRerouteDelta(null);
                              setNotice(
                                `Now showing ${route.name}. Ask for a busier route to compare crowding.`,
                              );
                            }}
                            className={
                              "w-full flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors duration-200 " +
                              (isActive
                                ? "bg-gold-dim border-gold-edge"
                                : "border-card-border hover:border-gold-edge bg-transparent disabled:cursor-default")
                            }
                          >
                            <span className="min-w-0">
                              <span className="flex items-center gap-2 text-sm font-medium truncate">
                                <span
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{ background: route.color }}
                                  aria-hidden="true"
                                />
                                {route.name}
                                {isActive && (
                                  <span className="sr-only">(current route)</span>
                                )}
                              </span>
                              <span className="mt-0.5 block font-mono text-xs text-muted tabular-nums">
                                {route.etaMinutes} min
                                <span className="text-dim"> / </span>
                                {route.distanceKm.toFixed(1)} km
                              </span>
                            </span>
                            {crowd(route)}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            )}
          </Panel>

          {/* Map */}
          <JourneyMap
            routes={routes}
            activeRouteId={activeId}
            from={origin}
            to={destination.coords}
            progress={progress}
          />
        </div>

        {originLabel !== "Your live location" && (          <div
            role="status"
            className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl bg-warning-dim border border-warning-edge px-4 py-3.5"
          >
            <TriangleAlert
              className="w-4 h-4 text-warning-text shrink-0"
              strokeWidth={2}
            />
            <p className="text-sm text-muted leading-relaxed">
              Location permission was not granted, so this journey starts from a
              demo point in Bengaluru.
            </p>
            <Link
              href="/onboarding/location"
              className="shrink-0 text-sm text-gold transition-colors hover:text-gold-hover"
            >
              Enable location
            </Link>
          </div>
        )}

        <StatusStrip className="mt-4">
          Voice SOS is active. Say &quot;SAFEGRID SOS&quot; to alert your network
          without touching your phone.
        </StatusStrip>
      </main>
    </div>
  );
}
