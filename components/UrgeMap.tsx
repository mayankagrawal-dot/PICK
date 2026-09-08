import { bucketByHour, getPickupsForDay, hourLabel, mostCommonTrigger } from "@/lib/stats";
import type { PickupEvent } from "@/lib/types";
import { Card } from "./ui";

export function UrgeMap({ pickups }: { pickups: PickupEvent[] }) {
  const today = getPickupsForDay(pickups, 0);
  const buckets = bucketByHour(today);
  const max = Math.max(1, ...buckets);
  const peakHour = buckets.indexOf(max);

  const insight =
    today.length === 0
      ? "No pickups logged yet today — log one to start the map."
      : `Your checks spike around ${hourLabel(peakHour)}${
          mostCommonTrigger(today).trigger ? `, often after "${mostCommonTrigger(today).trigger}"` : ""
        }.`;

  return (
    <Card className="px-6 py-6 sm:px-8">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2.5">
        <h2 className="text-xl font-black tracking-tight">Urge Map</h2>
        <span className="text-xs text-muted">Pickups by hour, today</span>
      </div>

      <div className="flex h-[140px] items-end gap-[3px] border-b-2 border-ink pb-0.5">
        {buckets.map((count, hour) => {
          const heightPct = count === 0 ? 2 : Math.max(6, (count / max) * 100);
          const isPeak = count === max && count > 0;
          return (
            <div key={hour} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <div
                title={`${count} pickup${count === 1 ? "" : "s"} at ${hour}:00`}
                className={`w-full max-w-[22px] rounded-t-md rounded-b-sm transition-all ${
                  isPeak ? "bg-pink" : "bg-lavender"
                }`}
                style={{ height: `${heightPct}%`, minHeight: "3px" }}
              />
              <div className="text-[9px] text-muted">{hour % 3 === 0 ? hour : ""}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-2.5 text-xs text-muted">{insight}</div>
    </Card>
  );
}
