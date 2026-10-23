import type { LaneFixture, LaneRuntime } from "../types";
import { AnimatedNumber } from "./AnimatedNumber";
import { StepChip } from "./StepChip";

interface Props {
  lane: LaneFixture;
  runtime: LaneRuntime;
  accent: string;
}

export function LaneColumn({ lane, runtime, accent }: Props) {
  return (
    <article className="lane" style={{ ["--lane-accent" as string]: accent }}>
      <header className="lane__header">
        <h2>{lane.label}</h2>
        <p>{lane.subtitle}</p>
      </header>

      <div className="meters" aria-live="polite">
        <div className="meter">
          <span className="meter__label">cost</span>
          <AnimatedNumber
            className="meter__value"
            value={runtime.cost}
            decimals={2}
            suffix=" u"
          />
        </div>
        <div className="meter">
          <span className="meter__label">wall</span>
          <AnimatedNumber
            className="meter__value"
            value={runtime.wallMs}
            decimals={0}
            suffix=" ms"
          />
        </div>
        <div className="meter">
          <span className="meter__label">LLM</span>
          <AnimatedNumber
            className="meter__value"
            value={runtime.llmCalls}
            decimals={0}
          />
        </div>
        <div className="meter">
          <span className="meter__label">small</span>
          <AnimatedNumber
            className="meter__value"
            value={runtime.decisionCalls}
            decimals={0}
          />
        </div>
      </div>

      <ol className="lane__steps">
        {lane.steps.map((step, i) => (
          <StepChip
            key={step.id}
            step={step}
            index={i}
            visible={i < runtime.revealed}
          />
        ))}
      </ol>

      {runtime.finished && (
        <footer
          className={`lane__result ${runtime.success ? "ok" : "bad"}`}
          data-testid={`result-${lane.id}`}
        >
          {runtime.success ? (
            <span>SUCCESS ✓</span>
          ) : (
            <span>
              FAILED ✗
              {lane.failureReason ? ` — ${lane.failureReason}` : ""}
            </span>
          )}
        </footer>
      )}
    </article>
  );
}
