import { DAILY_GOAL, TREND_DAYS } from "@/lib/constants";
import { buildTrendOverview } from "@/lib/stats";
import type { PickupEvent } from "@/lib/types";
import { Card } from "./ui";

export function TrendMap({ pickups }: { pickups: PickupEvent[] }) {
  const days = buildTrendOverview(pickups);
  const max = Math.max(DAILY_GOAL, ...days.map((d) => d.count));
  const goalLineBottomPct = Math.min(100, (DAILY_GOAL / max) * 100);

  return (
    <Card className="px-6 py-6 sm:px-8">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2.5">
        <h2 className="text-xl font-black tracking-tight">Last {TREND_DAYS} Days</h2>
        <span className="text-xs text-muted">total pickups per day · dashed line = daily goal</span>
      </div>

      <div className="relative flex h-[160px] items-end gap-2 border-b-2 border-ink pb-0.5 sm:gap-3">
        <div
          className="absolute left-0 right-0 z-0 border-t-2 border-dashed border-ink/35"
          style={{ bottom: `${goalLineBottomPct}%` }}
        />
        {days.map((d) => {
          const heightPct = d.count === 0 ? 2 : Math.max(4, (d.count / max) * 100);
          return (
            <div key={d.offset} className="z-[1] flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <div className="text-xs font-extrabold">{d.count || ""}</div>
              <div
                className={`w-full max-w-[46px] rounded-t-lg rounded-b-sm transition-all ${
                  d.count > DAILY_GOAL ? "bg-lavender-deep" : "bg-lavender"
                } ${d.isToday ? "outline outline-2 outline-offset-2 outline-ink" : ""}`}
                style={{ height: `${heightPct}%`, minHeight: "3px" }}
              />
              <div className="text-[10px] font-bold uppercase text-muted sm:text-[11px]">{d.label}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
