import { useEffect, useState } from "react";
import { LaneColumn } from "./components/LaneColumn";
import { PaperOverlay } from "./components/PaperOverlay";
import { Scoreboard } from "./components/Scoreboard";
import {
  buildExportPayload,
  downloadJson,
  downloadScoreboardPng,
} from "./lib/exportRace";
import { useRace } from "./lib/useRace";
import type { LaneId, RaceFixture } from "./types";
import "./App.css";

const ACCENTS: Record<LaneId, string> = {
  "llm-only": "#7EB8C9",
  replace: "#E07A5F",
  cascade: "#F0A202",
};

function App() {
  const [fixture, setFixture] = useState<RaceFixture | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showPaper, setShowPaper] = useState(false);
  const { phase, runtimes, start, laneOrder } = useRace(fixture);

  useEffect(() => {
    let cancelled = false;
    fetch("/fixtures/race.json")
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load fixtures (${r.status})`);
        return r.json() as Promise<RaceFixture>;
      })
      .then((data) => {
        if (!cancelled) setFixture(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "Load failed");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!fixture || phase !== "idle") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("autorun") === "1") {
      const t = window.setTimeout(() => start(), 400);
      return () => window.clearTimeout(t);
    }
  }, [fixture, phase, start]);

  const onExportJson = () => {
    if (!fixture) return;
    downloadJson(buildExportPayload(fixture));
  };

  const onExportPng = () => {
    if (!fixture) return;
    downloadScoreboardPng(fixture, buildExportPayload(fixture));
  };

  return (
    <div className="app">
      <div className="grain" aria-hidden />
      <header className="hero">
        <p className="hero__brand">Cascade Cost Race</p>
        <h1 className="hero__task">
          {fixture?.task.title ?? "Loading task…"}
        </h1>
        <p className="hero__lede">
          Three lanes. Same customer-service agent task. LLM-only vs Replace vs
          Cascade (accept only when confidence ≥ fitted τ). No API keys — scripted
          DecisionGym-style fixtures.
        </p>
        <div className="hero__cta">
          <button
            type="button"
            className="btn btn--primary"
            data-testid="race-btn"
            disabled={!fixture || phase === "racing"}
            onClick={() => start()}
          >
            {phase === "racing"
              ? "Racing…"
              : phase === "done"
                ? "Race again"
                : "Race"}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setShowPaper(true)}
            disabled={!fixture}
          >
            Show paper numbers
          </button>
          {phase === "done" && (
            <>
              <button type="button" className="btn btn--ghost" onClick={onExportJson}>
                Export JSON
              </button>
              <button type="button" className="btn btn--ghost" onClick={onExportPng}>
                Export PNG
              </button>
            </>
          )}
        </div>
        {fixture && (
          <p className="hero__meta">
            seed {fixture.seed} · fitted τ = {fixture.fittedTau} · decision ~31
            ms / LLM ~809 ms · demo mode
          </p>
        )}
        {loadError && <p className="hero__error">{loadError}</p>}
      </header>

      {fixture && (
        <>
          <section className="task-strip" aria-label="Orders in scope">
            {fixture.task.orders.map((o) => (
              <div key={o.id} className="order-pill">
                <strong>{o.id}</strong>
                <span>
                  {o.status} · {o.item}
                </span>
                <em>{o.note}</em>
              </div>
            ))}
          </section>

          <section
            className={`track ${phase === "racing" ? "is-racing" : ""}`}
            aria-label="Race lanes"
          >
            {laneOrder.map((id) => (
              <LaneColumn
                key={id}
                lane={fixture.lanes[id]}
                runtime={runtimes[id]}
                accent={ACCENTS[id]}
              />
            ))}
          </section>

          {phase === "done" && (
            <Scoreboard
              fixture={fixture}
              runtimes={runtimes}
              laneOrder={laneOrder}
              accents={ACCENTS}
            />
          )}
        </>
      )}

      <footer className="site-foot">
        <span>
          Inspired by{" "}
          <a href="https://arxiv.org/abs/2610.21412" target="_blank" rel="noreferrer">
            JevAgentHarness
          </a>
        </span>
        <span>Static Netlify demo · fixtures only</span>
      </footer>

      {fixture && (
        <PaperOverlay
          open={showPaper}
          onClose={() => setShowPaper(false)}
          numbers={fixture.paperNumbers}
        />
      )}
    </div>
  );
}

export default App;
