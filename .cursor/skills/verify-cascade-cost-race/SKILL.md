---
name: verify-cascade-cost-race
description: Launch, doctor, drive, evidence, and cleanup for the Cascade Cost Race Netlify demo.
---

# Verify Cascade Cost Race

Static Vite + React demo. No API keys. Fixtures in `public/fixtures/race.json`.

## Launch

```bash
npm install
npm run dev
# open http://localhost:5173
# optional autorun: http://localhost:5173/?autorun=1
```

Production check:

```bash
npm run build
npm run preview
```

## Doctor

| Symptom | Check |
| --- | --- |
| Blank page / load error | `public/fixtures/race.json` must be served; Network tab → `/fixtures/race.json` 200 |
| Race never finishes | Confirm `playbackSpeed` in fixture; total simulated wall / speed should be ≪ 15s |
| Wrong pass/fail story | Replace must cancel `ORD-991` with `irreversibleFailure`; Cascade must defer then cancel `ORD-2088`; LLM-only success |
| Cascade not cheaper | Compare scoreboard: cascade `cost` and `llmCalls` < llm-only |
| `npm run build` fails | Run `npx tsc -b --pretty false` and fix reported files |

## Drive (manual script)

1. Load `/` — brand **Cascade Cost Race** + task headline visible.
2. Click **Race**.
3. Watch three columns reveal steps; Replace ends FAILED; Cascade and LLM-only SUCCESS.
4. Confirm scoreboard: Cascade lower cost and fewer LLM calls than LLM-only.
5. Toggle **Show paper numbers**; dismiss.
6. **Export JSON** / **Export PNG**.
7. Optional: `/?autorun=1` completes without a click.

## Evidence

Capture after phase `done`:

- Screenshot of scoreboard → `artifacts/scoreboard.png` (and optional full-page race view).
- Confirm wall-clock race duration &lt; 15s (browser Performance or stopwatch).
- `npm run build` exit 0; `dist/` contains `index.html` + assets.

Acceptance mapping:

| Criterion | Evidence |
| --- | --- |
| Build passes | `npm run build` |
| Race &lt; 15s | stopwatch / autorun |
| Replace fails wrong cancel | `data-testid="result-replace"` FAILED + ORD-991 |
| Cascade + LLM-only succeed | matching result footers |
| Cascade cheaper / fewer LLM | scoreboard cards |
| Screenshot saved | `artifacts/scoreboard.png` |

## Cleanup

```bash
# stop dev/preview servers (Ctrl+C)
rm -rf dist node_modules/.vite
# do not commit secrets — none required for this demo
```
