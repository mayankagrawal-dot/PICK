import { BigButton } from "./ui";

export interface FocusResult {
  title: string;
  emoji: string;
  message: string;
}

export function FocusResultOverlay({ result, onClose }: { result: FocusResult; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink text-bg">
      <div className="px-5 text-center">
        <div className="mb-3.5 text-[13px] font-bold tracking-[0.15em] opacity-70">{result.title}</div>
        <div className="my-2.5 text-6xl">{result.emoji}</div>
        <p className="mx-auto my-5 max-w-[380px] leading-relaxed opacity-85">{result.message}</p>
        <BigButton onClick={onClose}>Back to dashboard</BigButton>
      </div>
    </div>
  );
}
