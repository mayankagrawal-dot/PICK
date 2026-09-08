import { TextButton } from "./ui";

interface FocusOverlayProps {
  secondsLeft: number;
  onBreak: () => void;
  onExit: () => void;
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function FocusOverlay({ secondsLeft, onBreak, onExit }: FocusOverlayProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink text-bg">
      <div className="px-5 text-center">
        <div className="mb-3.5 text-[13px] font-bold tracking-[0.15em] opacity-70">FOCUS SPRINT</div>
        <div className="text-[64px] font-black tracking-tight [font-variant-numeric:tabular-nums] sm:text-[100px]">
          {formatTimer(secondsLeft)}
        </div>
        <p className="mx-auto my-5 max-w-[380px] leading-relaxed opacity-85">
          Leave your phone out of reach.
          <br />
          One tiny pause can change the pattern.
        </p>
        <div className="flex justify-center gap-5">
          <TextButton className="text-bg opacity-80" onClick={onBreak}>
            I picked up my phone
          </TextButton>
          <TextButton className="text-bg opacity-80" onClick={onExit}>
            Exit sprint
          </TextButton>
        </div>
      </div>
    </div>
  );
}
