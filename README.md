# Cascade Cost Race

Netlify-ready static demo: three lanes race the same customer-service agent task — **LLM-only** vs **Replace** (always small model) vs **Cascade** (Jev-style: accept only when confidence ≥ fitted τ).

Inspired by [JevAgentHarness](https://arxiv.org/abs/2610.21412). No API keys; scripted JSON fixtures.

## Quick start

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Netlify

`netlify.toml` sets `build = npm run build` and `publish = dist`. Static only — no Functions required.

## Docs

- [DEMO.md](./DEMO.md) — 30-second talk track
- [features/](./features/) — feature map
- [.cursor/skills/verify-cascade-cost-race/SKILL.md](./.cursor/skills/verify-cascade-cost-race/SKILL.md) — Launch / Doctor / Drive / Evidence / Cleanup
