import type { RaceStep } from "../types";

interface Props {
  step: RaceStep;
  visible: boolean;
  index: number;
}

export function StepChip({ step, visible, index }: Props) {
  const kind =
    step.decider === "decision-model"
      ? "dm"
      : step.decider === "deferred→LLM"
        ? "defer"
        : "llm";

  return (
    <li
      className={`step-chip step-chip--${kind} ${visible ? "is-in" : ""} ${step.irreversibleFailure ? "is-fail" : ""}`}
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      <div className="step-chip__head">
        <span className="step-chip__tag">{step.decider}</span>
        <span className="step-chip__tool">{step.tool}</span>
      </div>
      {step.confidence != null && (
        <div className="conf-bar" aria-label={`confidence ${step.confidence}`}>
          <div
            className="conf-bar__fill"
            style={{
              width: visible ? `${Math.round(step.confidence * 100)}%` : "0%",
            }}
          />
          <span className="conf-bar__label">
            conf {step.confidence.toFixed(2)}
            {step.tau != null && (
              <span>
                {" "}
                · τ {step.tau.toFixed(2)}
                {step.accepted === false
                  ? " → defer"
                  : step.accepted
                    ? " → accept"
                    : ""}
              </span>
            )}
          </span>
        </div>
      )}
      <p className="step-chip__obs">{step.observation}</p>
      {Object.keys(step.args).length > 0 && (
        <code className="step-chip__args">
          {Object.entries(step.args)
            .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
            .join(" · ")}
        </code>
      )}
    </li>
  );
}
