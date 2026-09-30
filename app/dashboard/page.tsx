"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AudioLines,
  ChevronRight,
  LogOut,
  MapPin,
  Navigation,
  Radar,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import LiveMap from "./live-map";
import SetupGuard from "./setup-guard";
import TrustedNetwork from "./trusted-network";
import SiteHeader from "@/app/components/site-header";
import { loadJourneys, SavedJourney } from "../lib/safegrid-store";
import { formatWhen } from "../lib/datetime";
import {
  ButtonLink,
  Divider,
  LiveDot,
  Metric,
  Panel,
  SectionHeading,
} from "@/app/components/ui";

/* Most figures below are still illustrative: this dashboard has no backend.
   Journeys are the exception, they are really recorded on this device, so
   those numbers and the recent list are read from storage. Labelled as sample
   in the footer. Replace the rest with live reads when wired up. */
const ACCOUNT_NAME = "Ananya Rao";

const stats = [
  {
    label: "Journeys completed",
    value: "12",
    sub: "in the last 30 days",
  },
  {
    label: "Protection network",
    value: "5",
    sub: "active contacts",
  },
  {
    label: "Alerts resolved",
    value: "3",
    sub: "in the last 30 days",
    tone: "safe" as const,
  },
  {
    label: "Safety score",
    value: "94",
    sub: "out of 100",
  },
];

/* Four cells, laid out 2 + 1 / 1 + 2 on a three-column grid. The previous
   build was four identical equal-width cards, which is the banned feature-row
   pattern and carried no hierarchy between "start a journey" and the rest. */
const quickActions = [
  {
    icon: Navigation,
    label: "Start a safe journey",
    body: "Pick a destination and get routed toward the busier path.",
    href: "/journey",
    span: "lg:col-span-2",
    featured: true,
  },
  {
    icon: Radar,
    label: "Safety map",
    body: "See risk zones around you.",
    href: "#live-map",
    span: "lg:col-span-1",
  },
  {
    icon: Users,
    label: "Emergency contacts",
    body: "Manage the three people we call.",
    href: "#trusted-network",
    span: "lg:col-span-1",
  },
  {
    icon: Shield,
    label: "Command center",
    body: "Review incidents and live monitoring.",
    href: "/journey",
    span: "lg:col-span-2",
  },
];

const tips = [
  "Share a live journey with a contact before you set out at night.",
  "Keep your emergency PIN current in your profile.",
  'Say "SAFEGRID SOS" hands-free to raise an alert mid-journey.',
  "Mark unfamiliar stretches as high risk after you have driven them.",
];

export default function DashboardPage() {
  const [journeys, setJourneys] = useState<SavedJourney[]>([]);

  useEffect(() => {
    const t = window.setTimeout(() => setJourneys(loadJourneys()), 0);
    return () => window.clearTimeout(t);
  }, []);

  // Once a real journey exists its count is real, so the sample figure goes away.
  const journeyStat =
    journeys.length > 0
      ? { value: String(journeys.length), sub: "on this device" }
      : { value: stats[0].value, sub: stats[0].sub };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <SetupGuard />

      <SiteHeader>
        <ChipLive />
        <span className="hidden md:block text-sm text-muted">
          {ACCOUNT_NAME}
        </span>
        <Link
          href="/login"
          className="flex items-center justify-center w-11 h-11 rounded-lg text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
          title="Log out"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.75} />
          <span className="sr-only">Log out</span>
        </Link>
      </SiteHeader>

      <main className="flex-1 max-w-7xl mx-auto w-full px-5 sm:px-6 py-8">
        {/* Status. Elevation is doing real work here: this is the one thing the
            user opened the app to find. */}
        <Panel className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-safe-dim border border-safe-edge flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-safe-text" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-semibold tracking-[-0.02em] flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  You are safe
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-card-border px-2.5 py-0.5 text-xs font-normal text-muted">
                    <MapPin className="w-3 h-3 text-gold" strokeWidth={2} />
                    Bengaluru
                  </span>
                </h1>
                <p className="mt-1 text-sm text-muted">
                  No journey running. Start one to begin monitoring.
                </p>
              </div>
            </div>
            <ButtonLink href="/journey" className="shrink-0 px-5 py-3">
              <Navigation className="w-4 h-4" strokeWidth={2} />
              Start journey
            </ButtonLink>
          </div>
        </Panel>

        {/* Figures, not containers. Four cards each holding one number was the
            densest pocket of card soup in the previous build. */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-y-7">
          {stats.map((stat, i) => {
            const shown = i === 0 ? journeyStat : stat;
            return (
              <div
                key={stat.label}
                className={
                  "px-0 lg:px-6 " +
                  (i % 2 === 0 ? "pr-5 " : "pl-5 ") +
                  (i < 2 ? "border-r border-hairline " : "") +
                  (i < 2 ? "pb-7 lg:pb-0 " : "")
                }
              >
                <Metric
                  value={shown.value}
                  label={stat.label}
                  sub={shown.sub}
                  tone={stat.tone}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-10" id="live-map">
          <SectionHeading
            action={
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <LiveDot />
                Tracking active
              </span>
            }
          >
            Live location
          </SectionHeading>
          <LiveMap />
        </div>

        <div className="mt-10">
          <SectionHeading>Go somewhere</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={
                  "group relative rounded-2xl border p-5 transition-colors duration-200 active:translate-y-px " +
                  action.span +
                  (action.featured
                    ? " bg-gold-dim border-gold-edge hover:bg-gold/10"
                    : " bg-card border-card-border hover:border-gold-edge")
                }
              >
                <action.icon
                  className={
                    "w-5 h-5 " + (action.featured ? "text-gold" : "text-muted")
                  }
                  strokeWidth={1.75}
                />
                <h3 className="mt-3.5 font-medium">{action.label}</h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">
                  {action.body}
                </p>
                <ChevronRight
                  className="absolute right-4 top-5 w-4 h-4 text-dim opacity-0 transition-opacity group-hover:opacity-100"
                  strokeWidth={2}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* One band for "what is running right now". The previous build had a
            Voice SOS strip and an almost-identical ambient monitoring bar
            stacked 40px apart, saying the same thing twice. */}
        <Panel tone="sunken" className="mt-8 px-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-8 gap-y-4 py-1">
            <div className="flex items-start gap-3">
              <AudioLines
                className="w-4 h-4 text-gold shrink-0 mt-0.5"
                strokeWidth={1.75}
              />
              <div>
                <div className="text-sm text-foreground">Voice SOS</div>
                <p className="mt-0.5 text-xs text-muted leading-relaxed">
                  Say &quot;SAFEGRID SOS&quot; to alert your network without
                  touching your phone.
                </p>
              </div>
            </div>
            <div className="sm:border-l sm:border-hairline sm:pl-8 flex items-start gap-3">
              <Activity
                className="w-4 h-4 text-gold shrink-0 mt-0.5"
                strokeWidth={1.75}
              />
              <div>
                <div className="text-sm text-foreground">Ambient monitoring</div>
                <p className="mt-0.5 text-xs text-muted leading-relaxed">
                  Position, speed and audio anomalies are checked continuously
                  while you travel.
                </p>
              </div>
            </div>
          </div>
        </Panel>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Panel className="p-5">
            <SectionHeading
              action={
                <span className="flex items-center gap-1.5 text-xs text-safe-text">
                  <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2} />
                  All reached safely
                </span>
              }
            >
              Recent journeys
            </SectionHeading>
            {journeys.length === 0 ? (
              <p className="text-sm text-muted leading-relaxed">
                No journeys yet. Your first one will show up here.
              </p>
            ) : (
              <ul className="divide-y divide-hairline">
                {journeys.slice(0, 3).map((journey) => (
                  <li
                    key={journey.id}
                    className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {journey.fromLabel} to {journey.toLabel}
                      </div>
                      <p className="mt-0.5 font-mono text-xs text-muted">
                        {formatWhen(journey.startedAt)}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-muted">
                      {journey.distanceKm.toFixed(1)} km
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Divider className="mt-5" />
            <Link
              href="/journey/history"
              className="mt-1.5 -mb-2.5 inline-flex items-center gap-1 min-h-11 text-sm text-gold transition-colors hover:text-gold-hover"
            >
              View all journeys
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </Panel>

          <Panel className="p-5">
            <SectionHeading>Worth knowing</SectionHeading>
            <ul className="divide-y divide-hairline">
              {tips.map((tip, index) => (
                <li
                  key={tip}
                  className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0"
                >
                  <span
                    className="shrink-0 mt-0.5 font-mono text-xs text-gold"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-muted leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="mt-6" id="trusted-network">
          <Panel className="p-5">
            <SectionHeading
              action={
                <Link
                  href="/onboarding/contacts"
                  className="-my-2.5 inline-flex items-center gap-1 min-h-11 text-sm text-gold transition-colors hover:text-gold-hover"
                >
                  Manage
                  <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </Link>
              }
            >
              Trusted network
            </SectionHeading>
            <TrustedNetwork />
          </Panel>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto w-full px-5 sm:px-6 py-6">
        <Divider className="mb-4" />
        <p className="text-xs text-dim max-w-[70ch] leading-relaxed">
          Sample account. Safety score, alerts and contact details on this
          screen are illustrative. Journey history is real, and is read from
          this device only.
        </p>
      </footer>
    </div>
  );
}

function ChipLive() {
  return (
    <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-safe-edge bg-safe-dim px-3 py-1.5 text-xs font-medium text-safe-text">
      <LiveDot />
      Monitoring active
    </span>
  );
}
