import { FOCUS_MINUTES, TRIGGERS } from "./constants";
import type { FocusSession, PickupEvent } from "./types";
import { uid } from "./storage";

// Simulates a realistic week of pickups so the dashboard has something to
// show right away. This is clearly a demo/simulation feature — it never
// claims to reflect real device activity (see README).

function weightedHour(): number {
  // rough real-world pickup distribution: small morning bump, lunch bump,
  // a bigger mid-afternoon peak, and an evening wind-down bump.
  const weights = [1, 0, 0, 0, 0, 0, 1, 2, 3, 3, 2, 3, 4, 3, 5, 6, 5, 3, 3, 4, 5, 4, 3, 2];
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let h = 0; h < weights.length; h++) {
    r -= weights[h];
    if (r <= 0) return h;
  }
  return 12;
}

export function buildDemoPickups(): PickupEvent[] {
  const pickups: PickupEvent[] = [];
  for (let offset = 6; offset >= 0; offset--) {
    const count = 15 + Math.floor(Math.random() * 25); // 15-39 pickups/day
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - offset);
      date.setHours(weightedHour(), Math.floor(Math.random() * 60), 0, 0);
      if (offset === 0 && date > new Date()) date.setHours(new Date().getHours());

      pickups.push({
        id: uid("pickup"),
        timestamp: date.toISOString(),
        trigger: TRIGGERS[Math.floor(Math.random() * TRIGGERS.length)],
        intentional: Math.random() < 0.35,
        focusSessionId: null,
      });
    }
  }
  return pickups;
}

export function buildDemoFocusSessions(): FocusSession[] {
  const sessions: FocusSession[] = [];
  for (let offset = 4; offset >= 1; offset -= 2) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    date.setHours(10, 0, 0, 0);
    sessions.push({
      id: uid("focus"),
      startedAt: date.toISOString(),
      durationMinutes: FOCUS_MINUTES,
      completed: true,
      pickupInterruptions: Math.random() < 0.5 ? 0 : 1,
    });
  }
  return sessions;
}
