import type { LaneId, LaneRuntime, RaceFixture } from "../types";

interface Props {
  fixture: RaceFixture;
  runtimes: Record<LaneId, LaneRuntime>;
  laneOrder: LaneId[];
  accents: Record<LaneId, string>;
}

export function Scoreboard({
  fixture,
  runtimes,
  laneOrder,
  accents,
}: Props) {
  const cascade = runtimes.cascade;
  const llm = runtimes["llm-only"];
  const cheaper =
    llm.cost > 0
      ? Math.round(((llm.cost - cascade.cost) / llm.cost) * 100)
      : 0;
  const faster =
    llm.wallMs > 0
      ? (llm.wallMs / Math.max(cascade.wallMs, 1)).toFixed(1)
      : "—";

  return (
    <section className="scoreboard" id="scoreboard" data-testid="scoreboard">
      <div className="scoreboard__intro">
        <h2>Final scoreboard</h2>
        <p>
          Cascade saved ~{cheaper}% cost and ran ~{faster}× faster than LLM-only
          on this fixture — because τ deferred the ambiguous cancel.
        </p>
      </div>
      <div className="scoreboard__grid">
        {laneOrder.map((id) => {
          const lane = fixture.lanes[id];
          const rt = runtimes[id];
          return (
            <div
              key={id}
              className="score-card"
              style={{ borderTopColor: accents[id] }}
              data-lane={id}
            >
              <h3>{lane.label}</h3>
              <p className={rt.success ? "ok" : "bad"}>
                {rt.success ? "✓ success" : "✗ fail"}
              </p>
              <dl>
                <div>
                  <dt>cost</dt>
                  <dd>{rt.cost.toFixed(2)} u</dd>
                </div>
                <div>
                  <dt>wall</dt>
                  <dd>{rt.wallMs} ms</dd>
                </div>
                <div>
                  <dt>LLM calls</dt>
                  <dd>{rt.llmCalls}</dd>
                </div>
                <div>
                  <dt>small-model</dt>
                  <dd>{rt.decisionCalls}</dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>
    </section>
  );
}
