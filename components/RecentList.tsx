import type { PickupEvent } from "@/lib/types";
import { Card, TextButton } from "./ui";

export function RecentList({ pickups, onReset }: { pickups: PickupEvent[]; onReset: () => void }) {
  const sorted = [...pickups].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const recent = sorted.slice(0, 10);

  return (
    <Card className="px-6 py-6 sm:px-8">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2.5">
        <h2 className="text-xl font-black tracking-tight">Recent pickups</h2>
        <TextButton danger onClick={onReset}>
          Reset all data
        </TextButton>
      </div>

      {recent.length === 0 ? (
        <p className="py-2.5 italic text-muted">No pickups logged yet. Hit the big button above.</p>
      ) : (
        <ul className="flex max-h-[260px] flex-col gap-0.5 overflow-y-auto">
          {recent.map((p) => {
            const time = new Date(p.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <li
                key={p.id}
                className="flex items-center justify-between border-b border-cardline py-2.5 text-sm"
              >
                <span>
                  <span className="font-bold">{time}</span>
                  &nbsp;&nbsp;
                  <span className="text-muted">{p.trigger}</span>
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    p.intentional ? "bg-lime" : "bg-pink"
                  }`}
                >
                  {p.intentional ? "intentional" : "autopilot"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
