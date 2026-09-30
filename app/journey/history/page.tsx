"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Route as RouteIcon,
  Users,
} from "lucide-react";
import { clearJourneys, loadJourneys, SavedJourney } from "../../lib/safegrid-store";
import { formatWhen } from "../../lib/datetime";
import SiteHeader from "@/app/components/site-header";
import { Button, ButtonLink, Chip, Divider, ListRow, Metric, Panel } from "@/app/components/ui";

/* Local-only for now. Journeys live in localStorage on this device, so
   "on this device" is stated rather than implying a synced account. */

function durationMinutes(j: SavedJourney): number {
  return Math.max(1, Math.round((j.endedAt - j.startedAt) / 60_000));
}

export default function JourneyHistoryPage() {
  const [journeys, setJourneys] = useState<SavedJourney[] | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setJourneys(loadJourneys()), 0);
    return () => window.clearTimeout(t);
  }, []);

  // Null means still reading storage, so do not flash an empty state at it.
  if (journeys === null) {
    return (
      <div className="min-h-[100dvh] bg-background" aria-busy="true">
        <SiteHeader />
      </div>
    );
  }

  const totalKm = journeys.reduce((sum, j) => sum + j.distanceKm, 0);
  const rerouted = journeys.filter((j) => j.rerouted).length;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <SiteHeader>
        <Link
          href="/journey"
          className="inline-flex items-center gap-1.5 -ml-2.5 min-h-11 rounded-lg px-2.5 text-sm text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          New journey
        </Link>
      </SiteHeader>

      <main className="flex-1 max-w-4xl mx-auto w-full px-5 sm:px-6 py-8">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">Journey history</h1>
        <p className="mt-2 text-sm text-muted max-w-[58ch] leading-relaxed">
          Every journey you have run, newest first. Stored on this device only.
        </p>

        {journeys.length === 0 ? (
          <Panel className="mt-8 px-5 py-10 text-center">
            <div className="mx-auto max-w-sm">
              <RouteIcon className="mx-auto mb-3 w-7 h-7 text-muted" strokeWidth={1.75} />
              <h2 className="font-medium">No journeys yet</h2>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Start a journey and it will be recorded here, with the route you
                took and how busy it was.
              </p>
              <ButtonLink href="/journey" className="mt-6">
                Start your first journey
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </ButtonLink>
            </div>
          </Panel>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-card-border bg-card-border">
              <div className="bg-card px-4 py-4">
                <Metric value={journeys.length} label="Journeys run" />
              </div>
              <div className="bg-card px-4 py-4">
                <Metric value={totalKm.toFixed(1)} label="Km travelled" />
              </div>
              <div className="bg-card px-4 py-4">
                <Metric value={rerouted} label="Rerouted" sub="onto a busier path" />
              </div>
            </div>

            <Panel className="mt-6 px-5 py-5">
              <ul>
                {journeys.map((j) => (
                  <ListRow key={j.id}>
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <span className="truncate">{j.fromLabel}</span>
                          <ArrowRight
                            className="w-3.5 h-3.5 text-muted shrink-0"
                            strokeWidth={2}
                          />
                          <span className="truncate">{j.toLabel}</span>
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
                            {formatWhen(j.startedAt)}
                          </span>
                          <span className="font-mono tabular-nums">
                            {durationMinutes(j)} min
                          </span>
                          <span className="font-mono tabular-nums">
                            {j.distanceKm.toFixed(1)} km
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                            <Users className="w-3.5 h-3.5" strokeWidth={1.75} />
                            {j.peoplePresent.toLocaleString("en-IN")} on route
                          </span>
                          {j.rerouted && <Chip tone="safe">Rerouted</Chip>}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="font-mono text-lg leading-none tabular-nums">
                          {j.crowdScore}
                          <span className="text-muted text-sm">/100</span>
                        </div>
                        <div className="mt-1 text-xs text-muted">crowding</div>
                      </div>
                    </div>
                  </ListRow>
                ))}
              </ul>
            </Panel>

            <p className="mt-3 text-xs text-dim">{journeys.length} journeys, newest first.</p>

            <Divider className="my-6" />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-dim max-w-[46ch] leading-relaxed">
                Clearing history removes these records from this device. It
                cannot be undone.
              </p>
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  clearJourneys();
                  setJourneys([]);
                }}
              >
                Clear history
              </Button>
            </div>
          </>
        )}

        <p className="mt-8 text-xs text-dim leading-relaxed max-w-[62ch]">
          Journeys are recorded on this device only. Nothing is uploaded, and
          clearing your browser data removes them.
        </p>
      </main>
    </div>
  );
}
