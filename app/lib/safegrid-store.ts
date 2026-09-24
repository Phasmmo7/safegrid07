export type EmergencyContact = {
  name: string;
  phone: string;
};

export type SavedLocation = {
  granted: boolean;
  lat: number;
  lng: number;
  ts: number;
};

export const CONTACTS_KEY = "safegrid_contacts";
export const LOCATION_KEY = "safegrid_location";

export function loadContacts(): EmergencyContact[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CONTACTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter(
          (c): c is EmergencyContact =>
            c && typeof c.name === "string" && typeof c.phone === "string",
        )
      : [];
  } catch {
    return [];
  }
}

export function saveContacts(contacts: EmergencyContact[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

export function loadLocation(): SavedLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCATION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedLocation;
  } catch {
    return null;
  }
}

export function saveLocation(location: SavedLocation) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
}

export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
export const MAPBOX_TOKEN_MISSING =
  !MAPBOX_TOKEN ||
  MAPBOX_TOKEN === "pk.your_mapbox_token_here" ||
  MAPBOX_TOKEN.startsWith("pk.your");