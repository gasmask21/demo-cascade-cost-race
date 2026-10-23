# Scripted trajectories

Deterministic JSON fixtures under `public/fixtures/race.json` drive all three modes from one task seed (`21412`).

Each lane shares the Lena Wang cancel task but differs in **who-decides** tags per step (`llm`, `decision-model`, `deferred→LLM`). Replace’s wrong cancel is irreversible; Cascade defers that ambiguous step; LLM-only always pays for the LLM.
