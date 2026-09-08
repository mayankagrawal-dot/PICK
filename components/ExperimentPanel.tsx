import { experimentOfTheDay } from "@/lib/stats";
import { BigButton, Card } from "./ui";

export function ExperimentPanel({ onStartFocus }: { onStartFocus: () => void }) {
  return (
    <Card className="flex flex-col px-6 py-6 sm:px-8">
      <div className="mb-4">
        <h2 className="text-xl font-black tracking-tight">Today&apos;s Experiment</h2>
      </div>
      <p className="mb-5 flex-1 rounded-2xl bg-[#faf7f0] px-[18px] py-4 text-[15px] font-semibold leading-snug">
        {experimentOfTheDay()}
      </p>
      <BigButton variant="secondary" onClick={onStartFocus}>
        🎯 Start phone-down focus sprint
      </BigButton>
    </Card>
  );
}
