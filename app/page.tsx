"use client";

import { useEffect, useRef, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ExperimentPanel } from "@/components/ExperimentPanel";
import { FocusOverlay } from "@/components/FocusOverlay";
import { FocusResultOverlay, type FocusResult } from "@/components/FocusResultOverlay";
import { Hero } from "@/components/Hero";
import { InsightsPanel } from "@/components/InsightsPanel";
import { ReasonModal } from "@/components/ReasonModal";
import { RecentList } from "@/components/RecentList";
import { StatsGrid } from "@/components/StatsGrid";
import { TopBar } from "@/components/TopBar";
import { TrendMap } from "@/components/TrendMap";
import { UrgeMap } from "@/components/UrgeMap";
import { buildDemoFocusSessions, buildDemoPickups } from "@/lib/demoData";
import { FOCUS_MINUTES, TREND_DAYS, TRIGGERS } from "@/lib/constants";
import {
  clearAllData,
  loadFocusSessions,
  loadPickups,
  saveFocusSessions,
  savePickups,
  uid,
} from "@/lib/storage";
import { computeStreak } from "@/lib/stats";
import type { FocusSession, PickupEvent, Trigger } from "@/lib/types";

interface ActiveFocusSprint {
  sessionId: string;
  secondsLeft: number;
  interruptions: number;
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [pickups, setPickups] = useState<PickupEvent[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [activeSprint, setActiveSprint] = useState<ActiveFocusSprint | null>(null);
  const [focusResult, setFocusResult] = useState<FocusResult | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load from localStorage once, on mount, to avoid SSR/CSR hydration mismatches.
  useEffect(() => {
    setPickups(loadPickups());
    setFocusSessions(loadFocusSessions());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) savePickups(pickups);
  }, [pickups, mounted]);

  useEffect(() => {
    if (mounted) saveFocusSessions(focusSessions);
  }, [focusSessions, mounted]);

  function addPickup(trigger: Trigger, intentional: boolean, focusSessionId: string | null = null) {
    setPickups((prev) => [
      ...prev,
      {
        id: uid("pickup"),
        timestamp: new Date().toISOString(),
        trigger,
        intentional,
        focusSessionId,
      },
    ]);
  }

  // ---------- reason modal / space-to-log ----------

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code !== "Space") return;
      if (reasonModalOpen || activeSprint || focusResult) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      e.preventDefault();
      setReasonModalOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [reasonModalOpen, activeSprint, focusResult]);

  // ---------- focus sprint countdown ----------

  // Tick the clock down. Kept free of side effects so it's safe for
  // React 18 Strict Mode's double-invoked updaters in dev.
  useEffect(() => {
    if (!activeSprint) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setActiveSprint((prev) => (prev ? { ...prev, secondsLeft: Math.max(0, prev.secondsLeft - 1) } : prev));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeSprint?.sessionId]);

  // Once the clock hits zero, finish the sprint (a separate effect keeps
  // this side effect out of the state updater above).
  useEffect(() => {
    if (activeSprint && activeSprint.secondsLeft <= 0) {
      finishSprint(activeSprint, true);
      setActiveSprint(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSprint]);

  function startFocusSprint() {
    const sessionId = uid("focus");
    setFocusSessions((prev) => [
      ...prev,
      {
        id: sessionId,
        startedAt: new Date().toISOString(),
        durationMinutes: FOCUS_MINUTES,
        completed: false,
        pickupInterruptions: 0,
      },
    ]);
    setActiveSprint({ sessionId, secondsLeft: FOCUS_MINUTES * 60, interruptions: 0 });
  }

  function breakFocus() {
    if (!activeSprint) return;
    const interruptions = activeSprint.interruptions + 1;
    addPickup("Focus break", false, activeSprint.sessionId);
    setActiveSprint({ ...activeSprint, interruptions });
    setFocusSessions((prev) =>
      prev.map((s) => (s.id === activeSprint.sessionId ? { ...s, pickupInterruptions: interruptions } : s))
    );
  }

  function finishSprint(sprint: ActiveFocusSprint, completed: boolean) {
    setFocusSessions((prev) =>
      prev.map((s) =>
        s.id === sprint.sessionId ? { ...s, completed, pickupInterruptions: sprint.interruptions } : s
      )
    );

    if (completed && sprint.interruptions === 0) {
      setFocusResult({
        title: "SPRINT PROTECTED",
        emoji: "🎉",
        message: "You protected the full focus block with zero pickups. That's the pattern you're building.",
      });
    } else if (completed) {
      setFocusResult({
        title: "SPRINT COMPLETE",
        emoji: "💪",
        message: `You finished the sprint with ${sprint.interruptions} pickup${
          sprint.interruptions === 1 ? "" : "s"
        } along the way. Progress, not perfection.`,
      });
    } else {
      setFocusResult({
        title: "SPRINT ENDED EARLY",
        emoji: "🌱",
        message: "You exited early — that's okay. Every attempt still builds awareness. Try again when you're ready.",
      });
    }
  }

  function exitFocusSprint() {
    if (!activeSprint) return;
    const sprint = activeSprint;
    setActiveSprint(null);
    finishSprint(sprint, false);
  }

  // ---------- demo data / reset ----------

  function seedDemoData() {
    if (
      !window.confirm(
        `This replaces your current demo data with a simulated ${TREND_DAYS}-day history. Continue?`
      )
    ) {
      return;
    }
    setPickups(buildDemoPickups());
    setFocusSessions(buildDemoFocusSessions());
  }

  function resetAllData() {
    if (!window.confirm("Clear all demo pickup and focus session data?")) return;
    clearAllData();
    setPickups([]);
    setFocusSessions([]);
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Loading your dashboard…
      </div>
    );
  }

  const streak = computeStreak(pickups);

  return (
    <>
      <TopBar />
      <main className="mx-auto flex max-w-[1100px] flex-col gap-5 px-4 pb-20 pt-4 sm:px-6">
        <Hero onLogPickup={() => setReasonModalOpen(true)} />
        <DashboardHeader streak={streak} onSeedDemo={seedDemoData} />
        <StatsGrid pickups={pickups} />
        <UrgeMap pickups={pickups} />
        <TrendMap pickups={pickups} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
          <InsightsPanel pickups={pickups} />
          <ExperimentPanel onStartFocus={startFocusSprint} />
        </div>

        <RecentList pickups={pickups} onReset={resetAllData} />
      </main>

      <ReasonModal
        open={reasonModalOpen}
        onClose={() => setReasonModalOpen(false)}
        onSubmit={(trigger, intentional) => {
          addPickup(trigger, intentional);
          setReasonModalOpen(false);
        }}
        onSkip={() => {
          addPickup(TRIGGERS[Math.floor(Math.random() * TRIGGERS.length)], false);
          setReasonModalOpen(false);
        }}
      />

      {activeSprint && (
        <FocusOverlay secondsLeft={activeSprint.secondsLeft} onBreak={breakFocus} onExit={exitFocusSprint} />
      )}

      {focusResult && <FocusResultOverlay result={focusResult} onClose={() => setFocusResult(null)} />}
    </>
  );
}
