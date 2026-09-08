"use client";

import { useState } from "react";
import { TRIGGERS, TRIGGER_EMOJI } from "@/lib/constants";
import type { Trigger } from "@/lib/types";
import { Card, Chip, TextButton } from "./ui";

interface ReasonModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (trigger: Trigger, intentional: boolean) => void;
  onSkip: () => void;
}

export function ReasonModal({ open, onClose, onSubmit, onSkip }: ReasonModalProps) {
  const [pendingTrigger, setPendingTrigger] = useState<Trigger | null>(null);

  if (!open) return null;

  function choose(intentional: boolean) {
    onSubmit(pendingTrigger ?? TRIGGERS[Math.floor(Math.random() * TRIGGERS.length)], intentional);
    setPendingTrigger(null);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Card className="w-[92%] max-w-[480px] px-6 py-7">
        <h3 className="mb-2.5 text-[15px] font-bold">What triggered it?</h3>
        <div className="mb-5 flex flex-wrap gap-2">
          {TRIGGERS.map((trigger) => (
            <Chip
              key={trigger}
              selected={pendingTrigger === trigger}
              onClick={() => setPendingTrigger(trigger)}
            >
              {TRIGGER_EMOJI[trigger]} {trigger}
            </Chip>
          ))}
        </div>

        <h3 className="mb-2.5 text-[15px] font-bold">Was it intentional?</h3>
        <div className="mb-5 flex flex-wrap gap-2">
          <Chip onClick={() => choose(true)}>✅ Yes, on purpose</Chip>
          <Chip onClick={() => choose(false)}>🤖 No, autopilot</Chip>
        </div>

        <TextButton onClick={onSkip}>Skip &amp; just log it</TextButton>
      </Card>
    </div>
  );
}
