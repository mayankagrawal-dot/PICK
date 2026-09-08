import { FOCUS_KEY, STORE_KEY } from "./constants";
import type { FocusSession, PickupEvent } from "./types";

// All persistence is client-side localStorage — this is a browser demo,
// not a real device-activity tracker. See README "Important technical honesty".

function safeGet<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function safeSet<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadPickups(): PickupEvent[] {
  return safeGet<PickupEvent>(STORE_KEY);
}

export function savePickups(pickups: PickupEvent[]) {
  safeSet(STORE_KEY, pickups);
}

export function loadFocusSessions(): FocusSession[] {
  return safeGet<FocusSession>(FOCUS_KEY);
}

export function saveFocusSessions(sessions: FocusSession[]) {
  safeSet(FOCUS_KEY, sessions);
}

export function clearAllData() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORE_KEY);
  window.localStorage.removeItem(FOCUS_KEY);
}

export function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}
