import { DAILY_GOAL } from "@/lib/constants";
import { dayStats, formatMinutes, getPickupsForDay, trendBadge } from "@/lib/stats";
import type { PickupEvent, TrendBadge } from "@/lib/types";
import { Card } from "./ui";

const toneClasses: Record<TrendBadge["tone"], string> = {
  good: "text-emerald-700",
  bad: "text-red-700",
  neutral: "text-muted",
};

function TrendLine({ badge }: { badge: TrendBadge }) {
  return <div className={`mb-0.5 min-h-[15px] text-xs font-extrabold ${toneClasses[badge.tone]}`}>{badge.text}</div>;
}

export function StatsGrid({ pickups }: { pickups: PickupEvent[] }) {
  const today = dayStats(getPickupsForDay(pickups, 0));
  const yesterday = dayStats(getPickupsForDay(pickups, 1));

  const countTrend = trendBadge(today.count, yesterday.count > 0 ? yesterday.count : null, {
    higherIsBetter: false,
    unit: "",
  });
  const longestTrend = trendBadge(today.longestGap, yesterday.longestGap, { higherIsBetter: true, unit: "m" });
  const avgTrend = trendBadge(today.avgGap, yesterday.avgGap, { higherIsBetter: true, unit: "m" });
  const intentionalTrend = trendBadge(today.intentionalPct, yesterday.intentionalPct, {
    higherIsBetter: true,
    unit: "%",
  });

  const progressPct = Math.min(100, Math.round((today.count / DAILY_GOAL) * 100));
  const overGoal = today.count > DAILY_GOAL;

  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <Card className="border-t-[6px] border-t-ink px-5 py-5">
        <div className="text-xs font-bold uppercase tracking-wide text-muted">Pickups today</div>
        <div className="my-1.5 text-[34px] font-black tracking-tight">{today.count}</div>
        <TrendLine badge={countTrend} />
        <div className="text-xs text-muted">
          Goal: under <span>{DAILY_GOAL}</span>
        </div>
        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#eee7da]">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progressPct}%`, background: overGoal ? "#ff9ecb" : "#14120f" }}
          />
        </div>
      </Card>

      <Card className="border-t-[6px] border-t-pink px-5 py-5">
        <div className="text-xs font-bold uppercase tracking-wide text-muted">Longest gap</div>
        <div className="my-1.5 text-[34px] font-black tracking-tight">{formatMinutes(today.longestGap)}</div>
        <TrendLine badge={longestTrend} />
        <div className="text-xs text-muted">between pickups today</div>
      </Card>

      <Card className="border-t-[6px] border-t-lavender px-5 py-5">
        <div className="text-xs font-bold uppercase tracking-wide text-muted">Average gap</div>
        <div className="my-1.5 text-[34px] font-black tracking-tight">{formatMinutes(today.avgGap)}</div>
        <TrendLine badge={avgTrend} />
        <div className="text-xs text-muted">time between checks</div>
      </Card>

      <Card className="border-t-[6px] border-t-lime px-5 py-5">
        <div className="text-xs font-bold uppercase tracking-wide text-muted">Intentionality</div>
        <div className="my-1.5 text-[34px] font-black tracking-tight">
          {today.intentionalPct == null ? "—" : `${today.intentionalPct}%`}
        </div>
        <TrendLine badge={intentionalTrend} />
        <div className="text-xs text-muted">checks made on purpose</div>
      </Card>
    </section>
  );
}
