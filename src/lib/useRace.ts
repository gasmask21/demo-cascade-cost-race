import { useCallback, useEffect, useRef, useState } from "react";
import type {
  LaneId,
  LaneRuntime,
  RaceFixture,
  RacePhase,
  RaceStep,
} from "../types";
import { isLlmDecider, stepCost, stepDurationMs } from "../types";

const LANE_ORDER: LaneId[] = ["llm-only", "replace", "cascade"];

function emptyRuntime(): LaneRuntime {
  return {
    revealed: 0,
    wallMs: 0,
    cost: 0,
    llmCalls: 0,
    decisionCalls: 0,
    finished: false,
    success: null,
  };
}

function initialRuntimes(): Record<LaneId, LaneRuntime> {
  return {
    "llm-only": emptyRuntime(),
    replace: emptyRuntime(),
    cascade: emptyRuntime(),
  };
}

export function useRace(fixture: RaceFixture | null) {
  const [phase, setPhase] = useState<RacePhase>("idle");
  const [runtimes, setRuntimes] =
    useState<Record<LaneId, LaneRuntime>>(initialRuntimes);
  const timers = useRef<number[]>([]);
  const startedAt = useRef<number>(0);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setPhase("idle");
    setRuntimes(initialRuntimes());
  }, [clearTimers]);

  const start = useCallback(() => {
    if (!fixture) return;
    clearTimers();
    setRuntimes(initialRuntimes());
    setPhase("racing");
    startedAt.current = performance.now();

    const speed = fixture.timing.playbackSpeed;
    let remaining = LANE_ORDER.length;

    for (const laneId of LANE_ORDER) {
      const lane = fixture.lanes[laneId];
      let delay = 80;
      lane.steps.forEach((step: RaceStep, index: number) => {
        const duration = stepDurationMs(step, fixture.timing) / speed;
        delay += duration;
        const captureDelay = delay;
        const timer = window.setTimeout(() => {
          setRuntimes((prev) => {
            const cur = prev[laneId];
            const next: LaneRuntime = {
              ...cur,
              revealed: index + 1,
              wallMs: cur.wallMs + stepDurationMs(step, fixture.timing),
              cost: cur.cost + stepCost(step, fixture.timing),
              llmCalls: cur.llmCalls + (isLlmDecider(step.decider) ? 1 : 0),
              decisionCalls:
                cur.decisionCalls + (isLlmDecider(step.decider) ? 0 : 1),
            };
            if (index === lane.steps.length - 1) {
              next.finished = true;
              next.success = lane.success;
            }
            return { ...prev, [laneId]: next };
          });
        }, captureDelay);
        timers.current.push(timer);
      });

      const finishTimer = window.setTimeout(() => {
        remaining -= 1;
        if (remaining <= 0) setPhase("done");
      }, delay + 40);
      timers.current.push(finishTimer);
    }
  }, [clearTimers, fixture]);

  return { phase, runtimes, start, reset, laneOrder: LANE_ORDER };
}
