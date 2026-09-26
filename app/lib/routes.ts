import { LngLat, lerpPath, pathDistanceKm } from "./geo";
import { MAPBOX_TOKEN, MAPBOX_TOKEN_MISSING } from "./safegrid-store";
import { PALETTE } from "./palette";

export type RouteOption = {
  id: string;
  name: string;
  path: LngLat[];
  distanceKm: number;
  etaMinutes: number;
  peoplePresent: number;
  crowdScore: number;
  color: string;
};

export type DestinationOption = {
  id: string;
  label: string;
  coords: LngLat;
};

export const DESTINATIONS: DestinationOption[] = [
  { id: "mg-road", label: "MG Road, Bengaluru", coords: [77.616, 12.9752] },
  { id: "indiranagar", label: "Indiranagar, Bengaluru", coords: [77.6408, 12.9719] },
  { id: "koramangala", label: "Koramangala, Bengaluru", coords: [77.6244, 12.9352] },
  { id: "hsr", label: "HSR Layout, Bengaluru", coords: [77.642, 12.9121] },
  { id: "whitefield", label: "Whitefield, Bengaluru", coords: [77.749, 12.9698] },
  { id: "electronic-city", label: "Electronic City, Bengaluru", coords: [77.667, 12.8452] },
  { id: "central-silk-board", label: "Silk Board Junction, Bengaluru", coords: [77.6337, 12.9182] },
  { id: "jayanagar", label: "Jayanagar, Bengaluru", coords: [77.5855, 12.925] },
];

export const DEFAULT_ORIGIN: LngLat = [77.5946, 12.9716];

const ROUTE_COLORS = [
  PALETTE.safe,
  PALETTE.gold,
  PALETTE.info,
  PALETTE.orange,
];

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

export function peoplePresent(seed: string): number {
  const h = hashString(seed);
  return 380 + (h % 2100) + (hashString(seed + ":extra") % 500);
}

export function crowdScoreFromPeople(people: number, max: number): number {
  if (max <= 0) return 50;
  return Math.round((people / max) * 100);
}

function makeRoute(
  id: string,
  name: string,
  path: LngLat[],
  seed: string,
  color: string,
): RouteOption {
  const distanceKm = pathDistanceKm(path) * 1.18;
  const people = peoplePresent(seed);
  return {
    id,
    name,
    path,
    distanceKm,
    etaMinutes: Math.max(6, Math.round((distanceKm / 22) * 60)),
    peoplePresent: people,
    crowdScore: 0,
    color,
  };
}

function simulateRoutes(from: LngLat, to: LngLat): RouteOption[] {
  const detours = [0.15, 0.5, 0.95];
  const phases = [Math.PI / 2, 0.4, 2.2];
  const offsets = [[0, 0], [1, 0], [0.6, 0.4]] as const;
  return detours.map((d, i) => {
    const path = lerpPath(from, to, d, phases[i], 14);
    const shifted = [
      ...path.map(
        (p) =>
          [
            p[0] + offsets[i][0] * (to[0] - from[0]) * 0.06,
            p[1] + offsets[i][1] * (to[1] - from[1]) * 0.06,
          ] as LngLat,
      ),
    ];
    return makeRoute(
      `sim-${i}`,
      i === 0 ? "Direct route" : `Alternative ${i}`,
      shifted,
      `${from.join(",")}:${to.join(",")}:${i}`,
      ROUTE_COLORS[i],
    );
  });
}

function directionsUrl(from: LngLat, to: LngLat): string {
  const coords = `${from[0]},${from[1]};${to[0]},${to[1]}`;
  const params = new URLSearchParams({
    alternatives: "true",
    geometries: "geojson",
    overview: "full",
    steps: "false",
    access_token: MAPBOX_TOKEN,
  });
  return `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?${params.toString()}`;
}

type DirectionsResponse = {
  routes?: {
    geometry: { type: "LineString"; coordinates: LngLat[] };
    distance: number;
    duration: number;
    legs?: { summary?: string }[];
  }[];
};

async function fetchRealRoutes(
  from: LngLat,
  to: LngLat,
): Promise<RouteOption[] | null> {
  try {
    const res = await fetch(directionsUrl(from, to));
    if (!res.ok) return null;
    const data = (await res.json()) as DirectionsResponse;
    if (!data.routes || data.routes.length === 0) return null;
    return data.routes.slice(0, 4).map((r, i) =>
      makeRoute(
        `real-${i}`,
        r.legs?.[0]?.summary?.trim() ||
          (i === 0 ? "Fastest route" : `Alternative ${i}`),
        r.geometry.coordinates,
        `${from.join(",")}:${to.join(",")}:directions:${i}:${r.distance}`,
        ROUTE_COLORS[i % ROUTE_COLORS.length],
      ),
    );
  } catch {
    return null;
  }
}

export async function getJourneyRoutes(
  from: LngLat,
  to: LngLat,
): Promise<RouteOption[]> {
  let routes: RouteOption[] | null = null;
  if (!MAPBOX_TOKEN_MISSING) {
    routes = await fetchRealRoutes(from, to);
  }
  if (!routes || routes.length < 2) {
    routes = simulateRoutes(from, to);
    if (routes.length < 3) routes = simulateRoutes(from, to);
  }

  const max = Math.max(...routes.map((r) => r.peoplePresent));
  return routes.map((r) => ({
    ...r,
    crowdScore: crowdScoreFromPeople(r.peoplePresent, max),
  }));
}

export function recommendBetterRoute(
  routes: RouteOption[],
  currentId: string,
): {
  route: RouteOption;
  delta: number;
  isBest: boolean;
} {
  const sorted = [...routes].sort(
    (a, b) => b.peoplePresent - a.peoplePresent,
  );
  const best = sorted[0];
  const current = routes.find((r) => r.id === currentId) ?? routes[0];
  if (!current) return { route: best, delta: 0, isBest: true };
  if (best.id === currentId) {
    return { route: best, delta: 0, isBest: true };
  }
  return { route: best, delta: best.peoplePresent - current.peoplePresent, isBest: false };
}