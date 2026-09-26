"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CircleCheck,
  Flag,
  LocateFixed,
  MapPin,
  Navigation,
  RefreshCw,
  Route,
  Timer,
  TriangleAlert,
  Users,
} from "lucide-react";
import JourneyMap from "./journey-map";
import { DEFAULT_ORIGIN, DESTINATIONS, getJourneyRoutes, recommendBetterRoute, RouteOption } from "../lib/routes";
import { loadLocation } from "../lib/safegrid-store";
import SiteHeader from "@/app/components/site-header";
import { Button, Card, Pill, StatusStrip } from "@/app/components/ui";

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
    if (result.isBest) {
      setNotice(
        "You're already on the busiest route — maximum people around you.",
      );
    } else {
      setNotice("Rerouted to the busier route for safer travel.");
    }
  };

  const crowdBadge = (route: RouteOption) => (
    <div className="text-right shrink-0">
      <div className="text-sm font-bold inline-flex items-center gap-1">
        <Users className="w-3.5 h-3.5 text-gold" />
        {route.peoplePresent.toLocaleString("en-IN")}
      </div>
      <div className="text-[11px] text-muted">people now</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background bg-mesh-warm relative overflow-hidden">
      <SiteHeader>
        <Link
          href="/dashboard"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Back to dashboard
        </Link>
      </SiteHeader>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-1">Safe Journey</h1>
        <p className="text-muted mb-6">
          Choose a destination, then ask SAFEGRID to reroute to the safest path
          — the one with more people around.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[400px,1fr] gap-6">
          {/* Left: controls */}
          <div className="space-y-4">
            {/* Setup card */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gold-dim border border-gold/25 flex items-center justify-center">
                  <LocateFixed className="w-5 h-5 text-gold" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted">From</div>
                  <div className="font-medium truncate text-sm">
                    {originLabel}
                  </div>
                </div>
              </div>

              <label className="block text-xs font-medium text-muted mb-2 uppercase tracking-wider">
                Destination
              </label>
              <div className="relative mb-4">
                <Flag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                <select
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  disabled={phase === "active"}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-input-bg border border-input-border text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all text-sm appearance-none"
                >
                  {DESTINATIONS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {phase !== "active" ? (
                <Button
                  type="button"
                  onClick={handleStart}
                  block
                  loading={phase === "loading"}
                >
                  <Navigation className="w-4 h-4" /> Start Journey
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="danger"
                  block
                  onClick={handleStop}
                >
                  End Journey
                </Button>
              )}
            </Card>

            {/* Active journey status */}
            {phase === "active" && activeRoute && (
              <>
                {/* Current route */}
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold flex items-center gap-2 text-sm">
                      <Route className="w-4 h-4 text-gold" /> Current route
                    </h2>
                    <Pill tone="safe" className="px-2.5 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
                      Live
                    </Pill>
                  </div>

                  <div className="font-medium">{activeRoute.name}</div>
                  <div className="flex items-center gap-4 mt-3 mb-4 text-sm">
                    <span className="text-muted flex items-center gap-1.5">
                      <Timer className="w-4 h-4 text-gold" />
                      {activeRoute.etaMinutes} min
                    </span>
                    <span className="text-muted flex items-center gap-1.5">
                      <Navigation className="w-4 h-4 text-gold" />
                      {activeRoute.distanceKm.toFixed(1)} km
                    </span>
                  </div>

                  {/* People present */}
                  <div className="p-3 rounded-xl bg-gold-dim border border-gold/20 mb-4">
                    <div className="flex items-center justify-between">
                      {crowdBadge(activeRoute)}
                      <div className="text-right w-full pl-3">
                        <div className="flex items-center justify-between text-xs text-muted mb-1.5">
                          <span>Crowd density</span>
                          <span className="text-gold font-semibold">
                            {activeRoute.crowdScore}/100
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-card overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-orange via-gold to-safe transition-all duration-700"
                            style={{ width: `${activeRoute.crowdScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Better route CTA */}
                  <Button
                    type="button"
                    variant="tinted"
                    block
                    className="py-3"
                    onClick={handleBetterRoute}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Find better route — more people
                  </Button>

                  {notice && (
                    <p className="mt-3 text-xs text-muted flex items-start gap-2">
                      <CircleCheck className="w-4 h-4 text-safe shrink-0 mt-0.5" />
                      {notice}
                    </p>
                  )}
                  {rerouteDelta !== null && rerouteDelta > 0 && (
                    <p className="mt-2 text-xs flex items-start gap-2 text-safe">
                      <Users className="w-4 h-4 shrink-0 mt-0.5" />
                      +{rerouteDelta.toLocaleString("en-IN")} more people on
                      this route
                    </p>
                  )}
                </Card>

                {/* Alternatives */}
                <Card className="p-5">
                  <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold" /> Alternative routes
                  </h2>
                  <div className="space-y-2.5">
                    {routes.map((route) => {
                      const isActive = route.id === activeId;
                      return (
                        <button
                          key={route.id}
                          type="button"
                          disabled={isActive}
                          onClick={() => {
                            setActiveId(route.id);
                            setRerouteDelta(null);
                            setNotice(
                              isActive
                                ? ""
                                : `Showing ${route.name}. Ask for a better route to compare crowd density.`,
                            );
                          }}
                          className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg border text-left transition-all ${
                            isActive
                              ? "bg-gold-dim border-gold/40"
                              : "bg-background border-card-border hover:border-gold/40"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ background: route.color }}
                              />
                              {route.name}
                            </div>
                            <div className="text-xs text-muted">
                              {route.etaMinutes} min ·{" "}
                              {route.distanceKm.toFixed(1)} km
                            </div>
                          </div>
                          {crowdBadge(route)}
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </>
            )}
          </div>

          {/* Right: map */}
          <div>
            <JourneyMap
              routes={routes}
              activeRouteId={activeId}
              from={origin}
              to={destination.coords}
              progress={progress}
            />
          </div>
        </div>

        {/* Voice SOS */}
        <StatusStrip className="mt-8">
          Voice SOS: <span className="text-safe font-medium">Active</span> —
          Say &quot;SAFEGRID SOS&quot; to trigger emergency
        </StatusStrip>

        {originLabel !== "Your live location" && (
          <div className="mt-4 p-4 rounded-xl bg-warning/10 border border-warning/20 text-sm text-muted flex items-start gap-3">
            <TriangleAlert className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            Location permission was not granted, so the journey starts from a
            demo location in Bengaluru.{" "}
            <Link
              href="/onboarding/location"
              className="text-gold hover:text-gold-hover transition-colors shrink-0"
            >
              Enable
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}