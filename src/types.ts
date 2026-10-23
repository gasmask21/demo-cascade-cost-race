export type Decider = "llm" | "decision-model" | "deferred→LLM";

export type LaneId = "llm-only" | "replace" | "cascade";

export interface RaceStep {
  id: string;
  tool: string;
  args: Record<string, string>;
  decider: Decider;
  confidence: number | null;
  observation: string;
  tau?: number;
  accepted?: boolean;
  proposedBy?: string;
  deferredTool?: string;
  deferredArgs?: Record<string, string>;
  irreversibleFailure?: boolean;
}

export interface LaneFixture {
  id: LaneId;
  label: string;
  subtitle: string;
  success: boolean;
  failureReason?: string;
  steps: RaceStep[];
}

export interface RaceFixture {
  taskId: string;
  seed: number;
  task: {
    title: string;
    customer: string;
    orders: Array<{
      id: string;
      status: string;
      item: string;
      note: string;
    }>;
    successCriteria: string;
  };
  timing: {
    decisionModelMs: number;
    llmMs: number;
    decisionModelCost: number;
    llmCost: number;
    playbackSpeed: number;
  };
  fittedTau: number;
  lanes: Record<LaneId, LaneFixture>;
  paperNumbers: Array<{
    stat: string;
    label: string;
    source: string;
  }>;
}

export type RacePhase = "idle" | "racing" | "done";

export interface LaneRuntime {
  revealed: number;
  wallMs: number;
  cost: number;
  llmCalls: number;
  decisionCalls: number;
  finished: boolean;
  success: boolean | null;
}

export interface RaceTotals {
  wallMs: number;
  cost: number;
  llmCalls: number;
  decisionCalls: number;
  success: boolean;
}

export function stepDurationMs(
  step: RaceStep,
  timing: RaceFixture["timing"],
): number {
  // deferred→LLM = decision-model reject check; the following step bills the LLM.
  if (step.decider === "llm") return timing.llmMs;
  return timing.decisionModelMs;
}

export function stepCost(
  step: RaceStep,
  timing: RaceFixture["timing"],
): number {
  if (step.decider === "llm") return timing.llmCost;
  return timing.decisionModelCost;
}

export function isLlmDecider(decider: Decider): boolean {
  return decider === "llm";
}

export function computeLaneTotals(
  lane: LaneFixture,
  timing: RaceFixture["timing"],
): RaceTotals {
  let wallMs = 0;
  let cost = 0;
  let llmCalls = 0;
  let decisionCalls = 0;
  for (const step of lane.steps) {
    wallMs += stepDurationMs(step, timing);
    cost += stepCost(step, timing);
    if (isLlmDecider(step.decider)) llmCalls += 1;
    else decisionCalls += 1;
  }
  return {
    wallMs,
    cost,
    llmCalls,
    decisionCalls,
    success: lane.success,
  };
}
