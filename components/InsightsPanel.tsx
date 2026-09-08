import { generateInsights } from "@/lib/stats";
import type { PickupEvent } from "@/lib/types";
import { Card } from "./ui";

export function InsightsPanel({ pickups }: { pickups: PickupEvent[] }) {
  const insights = generateInsights(pickups);

  return (
    <Card className="px-6 py-6 sm:px-8">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2.5">
        <h2 className="text-xl font-black tracking-tight">PICK AI Insights</h2>
        <span className="text-xs text-muted">rule-based, for now 🙂</span>
      </div>
      <ul className="flex flex-col gap-3">
        {insights.map((text, i) => (
          <li key={i} className="rounded-[10px] border-l-4 border-lime bg-[#faf7f0] px-4 py-3 text-sm leading-snug">
            {text}
          </li>
        ))}
      </ul>
    </Card>
  );
}
