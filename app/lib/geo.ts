export type LngLat = [number, number];

export function haversineKm(a: LngLat, b: LngLat): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const lat1 = toRad(a[1]);
  const lat2 = toRad(b[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function pathDistanceKm(path: LngLat[]): number {
  let d = 0;
  for (let i = 1; i < path.length; i++) d += haversineKm(path[i - 1], path[i]);
  return d;
}

export function positionAlongPath(path: LngLat[], t: number): LngLat {
  if (path.length === 0) return [0, 0];
  if (path.length === 1) return path[0];
  if (t <= 0) return path[0];
  if (t >= 1) return path[path.length - 1];

  const segLens = [];
  let total = 0;
  for (let i = 1; i < path.length; i++) {
    const len = haversineKm(path[i - 1], path[i]);
    segLens.push(len);
    total += len;
  }
  if (total === 0) return path[0];

  let target = t * total;
  for (let i = 0; i < segLens.length; i++) {
    if (target <= segLens[i]) {
      const f = segLens[i] === 0 ? 0 : target / segLens[i];
      return [
        path[i][0] + (path[i + 1][0] - path[i][0]) * f,
        path[i][1] + (path[i + 1][1] - path[i][1]) * f,
      ];
    }
    target -= segLens[i];
  }
  return path[path.length - 1];
}

export function lerpPath(
  a: LngLat,
  b: LngLat,
  detour: number,
  phase: number,
  steps: number,
): LngLat[] {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const pts: LngLat[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const midLng = a[0] + dx * t;
    const midLat = a[1] + dy * t;
    const wave = Math.sin(t * Math.PI + phase) * detour * 0.2;
    pts.push([
      midLng + (-dy / len) * wave * len,
      midLat + (dx / len) * wave * len,
    ]);
  }
  return pts;
}