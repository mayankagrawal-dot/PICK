import { TextButton } from "./ui";

interface DashboardHeaderProps {
  streak: number;
  onSeedDemo: () => void;
}

export function DashboardHeader({ streak, onSeedDemo }: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="flex flex-wrap items-center justify-between gap-3 px-1">
      <div>
        <div className="mb-1 text-[13px] font-bold uppercase tracking-wide text-muted">{today}</div>
        <div className="inline-block rounded-full bg-ink px-3.5 py-1.5 text-sm font-extrabold text-bg">
          {streak > 0 ? `🔥 ${streak}-day streak under your pickup goal` : "🔥 Start your streak today"}
        </div>
      </div>
      <TextButton onClick={onSeedDemo}>🎲 Load demo data</TextButton>
    </section>
  );
}
