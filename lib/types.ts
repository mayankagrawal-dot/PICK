export type Trigger =
  | "Boredom"
  | "Task switch"
  | "Notification"
  | "Waiting"
  | "Habit"
  | "Quick check"
  | "Stress"
  | "Focus break"
  | "Other";

export interface PickupEvent {
  id: string;
  /** ISO 8601 timestamp */
  timestamp: string;
  trigger: Trigger;
  intentional: boolean;
  focusSessionId: string | null;
}

export interface FocusSession {
  id: string;
  /** ISO 8601 timestamp */
  startedAt: string;
  durationMinutes: number;
  completed: boolean;
  pickupInterruptions: number;
}

export interface DayStats {
  count: number;
  longestGap: number | null;
  avgGap: number | null;
  intentionalPct: number | null;
}

export interface TrendBadge {
  text: string;
  tone: "good" | "bad" | "neutral";
}
