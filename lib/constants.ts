import type { Trigger } from "./types";

export const STORE_KEY = "pick_pickups_v1";
export const FOCUS_KEY = "pick_focus_sessions_v1";

export const DAILY_GOAL = 30;
export const FOCUS_MINUTES = 25;

// "Focus break" is logged automatically when a user breaks a focus sprint,
// it's not offered as a chip in the reason picker.
export const TRIGGERS: Trigger[] = [
  "Boredom",
  "Task switch",
  "Notification",
  "Waiting",
  "Habit",
  "Quick check",
  "Stress",
  "Other",
];

export const TRIGGER_EMOJI: Record<Trigger, string> = {
  Boredom: "😐",
  "Task switch": "🔀",
  Notification: "🔔",
  Waiting: "⏳",
  Habit: "🔁",
  "Quick check": "👀",
  Stress: "😬",
  "Focus break": "🎯",
  Other: "➕",
};

export const EXPERIMENTS: string[] = [
  "Complete one 25-minute phone-down sprint.",
  "Keep your phone face-down during your next study session.",
  "Wait 90 seconds before responding to the urge to check.",
  "Keep your phone outside arm's reach during lunch.",
  "Do not unlock your phone during the first 15 minutes after waking up.",
];
