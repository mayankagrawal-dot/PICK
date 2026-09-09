import { DAILY_GOAL, EXPERIMENTS, TREND_DAYS } from "./constants";
import type { DayStats, PickupEvent, TrendBadge, Trigger } from "./types";

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/** Pickups on the day `offsetDays` before today (0 = today), oldest first. */
export function getPickupsForDay(pickups: PickupEvent[], offsetDays: number): PickupEvent[] {
  const target = new Date();
  target.setDate(target.getDate() - offsetDays);
  return pickups
    .filter((p) => isSameDay(new Date(p.timestamp), target))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export function computeGapsMinutes(pickups: PickupEvent[]): number[] {
  const gaps: number[] = [];
  for (let i = 1; i < pickups.length; i++) {
    const diffMs = new Date(pickups[i].timestamp).getTime() - new Date(pickups[i - 1].timestamp).getTime();
    gaps.push(diffMs / 60000);
  }
  return gaps;
}

export function formatMinutes(mins: number | null): string {
  if (mins == null || Number.isNaN(mins)) return "—";
  const m = Math.round(mins);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return `${h}h ${rem}m`;
}

export function dayStats(pickups: PickupEvent[]): DayStats {
  const gaps = computeGapsMinutes(pickups);
  const longestGap = gaps.length ? Math.max(...gaps) : null;
  const avgGap = gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : null;
  const intentionalCount = pickups.filter((p) => p.intentional).length;
  const intentionalPct = pickups.length ? Math.round((intentionalCount / pickups.length) * 100) : null;
  return { count: pickups.length, longestGap, avgGap, intentionalPct };
}

export function mostCommonTrigger(pickups: PickupEvent[]): { trigger: Trigger | null; count: number } {
  const counts: Partial<Record<Trigger, number>> = {};
  pickups.forEach((p) => {
    counts[p.trigger] = (counts[p.trigger] ?? 0) + 1;
  });
  let best: Trigger | null = null;
  let bestCount = 0;
  (Object.entries(counts) as [Trigger, number][]).forEach(([t, c]) => {
    if (c > bestCount) {
      best = t;
      bestCount = c;
    }
  });
  return { trigger: best, count: bestCount };
}

export function bucketByHour(pickups: PickupEvent[]): number[] {
  const buckets = new Array(24).fill(0);
  pickups.forEach((p) => {
    buckets[new Date(p.timestamp).getHours()]++;
  });
  return buckets;
}

export function hourLabel(hour: number): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}${hour < 12 ? "AM" : "PM"}`;
}

interface TrendOptions {
  higherIsBetter: boolean;
  unit: "" | "m" | "%";
}

export function trendBadge(current: number | null, previous: number | null, opts: TrendOptions): TrendBadge {
  if (current == null || previous == null) {
    return { text: "No data from yesterday yet", tone: "neutral" };
  }
  const diff = current - previous;
  const threshold = opts.unit === "%" ? 1 : 0.5;
  if (Math.abs(diff) < threshold) {
    return { text: "Same as yesterday", tone: "neutral" };
  }
  const better = opts.higherIsBetter ? diff > 0 : diff < 0;
  const arrow = diff > 0 ? "▲" : "▼";
  const magnitude = `${Math.abs(Math.round(diff))}${opts.unit}`;
  return { text: `${arrow} ${magnitude} vs. yesterday`, tone: better ? "good" : "bad" };
}

/** Consecutive days (walking back from today) at/under the daily goal.
 *  A day with zero logged pickups breaks the streak, except today (still in progress). */
export function computeStreak(pickups: PickupEvent[]): number {
  let streak = 0;
  for (let offset = 0; offset < 60; offset++) {
    const count = getPickupsForDay(pickups, offset).length;
    if (count === 0) {
      if (offset === 0) continue;
      break;
    }
    if (count <= DAILY_GOAL) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export interface TrendDay {
  offset: number;
  count: number;
  label: string;
  isToday: boolean;
}

/** One entry per day over the trend window, oldest first, today last. */
export function buildTrendOverview(pickups: PickupEvent[]): TrendDay[] {
  const days: TrendDay[] = [];
  for (let offset = TREND_DAYS - 1; offset >= 0; offset--) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    days.push({
      offset,
      count: getPickupsForDay(pickups, offset).length,
      label: offset === 0 ? "Today" : date.toLocaleDateString([], { weekday: "short" }),
      isToday: offset === 0,
    });
  }
  return days;
}

export function generateInsights(pickups: PickupEvent[]): string[] {
  const today = getPickupsForDay(pickups, 0);
  const yesterday = getPickupsForDay(pickups, 1);
  const insights: string[] = [];

  if (today.length === 0) {
    return ["Log your first pickup to unlock personalized insights."];
  }

  const { trigger, count } = mostCommonTrigger(today);
  if (trigger && count >= 2) {
    insights.push(
      `Most of your checks today follow "${trigger}". Try a 90-second reset before reaching for your phone next time.`
    );
  }

  const buckets = bucketByHour(today);
  const max = Math.max(...buckets);
  const peakHour = buckets.indexOf(max);
  if (max >= 2) {
    insights.push(
      `Your highest-risk window is around ${hourLabel(peakHour)}. Keep your phone face-down during that hour tomorrow.`
    );
  }

  const autopilotCount = today.filter((p) => !p.intentional).length;
  if (autopilotCount / today.length >= 0.5) {
    insights.push(
      "Your brain may be looking for a break, not another feed — most checks today were automatic, not intentional."
    );
  } else if (today.length >= 3) {
    insights.push("Nice — most of today's checks were intentional. That awareness is the whole game.");
  }

  if (yesterday.length > 0) {
    const gapsToday = computeGapsMinutes(today);
    const gapsYesterday = computeGapsMinutes(yesterday);
    const avgToday = gapsToday.length ? gapsToday.reduce((a, b) => a + b, 0) / gapsToday.length : null;
    const avgYesterday = gapsYesterday.length
      ? gapsYesterday.reduce((a, b) => a + b, 0) / gapsYesterday.length
      : null;
    if (avgToday != null && avgYesterday != null) {
      const diff = Math.round(avgToday - avgYesterday);
      if (diff > 0) {
        insights.push(
          `You're checking less often than yesterday — your average gap is up by ${diff} minute${diff === 1 ? "" : "s"}.`
        );
      } else if (diff < 0) {
        insights.push(
          `Your average gap between checks dropped by ${Math.abs(diff)} minute${Math.abs(diff) === 1 ? "" : "s"} vs. yesterday. No judgment — just noticing.`
        );
      }
    }
    if (today.length < yesterday.length) {
      insights.push(
        `You've logged ${yesterday.length - today.length} fewer pickups than yesterday at this point. Keep going.`
      );
    }
  }

  if (insights.length === 0) {
    insights.push("Keep logging pickups today — patterns usually show up after 5–6 events.");
  }

  return insights.slice(0, 4);
}

export function experimentOfTheDay(): string {
  const startOfYear = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - startOfYear.getTime()) / 86400000);
  return EXPERIMENTS[dayOfYear % EXPERIMENTS.length];
}
