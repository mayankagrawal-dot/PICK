import { BigButton, Card } from "./ui";

export function Hero({ onLogPickup }: { onLogPickup: () => void }) {
  return (
    <Card className="flex flex-wrap items-center justify-between gap-7 px-7 py-9 sm:px-10">
      <div className="max-w-[520px]">
        <h1 className="mb-3 text-[28px] font-black leading-[1.05] tracking-tight sm:text-[44px]">
          It&apos;s not how long.
          <br />
          It&apos;s how <span className="rounded-lg bg-lime px-2.5">often</span>.
        </h1>
        <p className="text-muted">
          Every time you feel the pull to check your phone, log it here. PICK finds the pattern
          behind the pickup.
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BigButton onClick={onLogPickup}>📱 Log a pickup</BigButton>
        <div className="text-xs text-muted">
          or press <kbd>Space</kbd>
        </div>
      </div>
    </Card>
  );
}
