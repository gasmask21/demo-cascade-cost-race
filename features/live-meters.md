# Live cost / time meters

Per-lane animated counters for wall ms, relative cost units, LLM calls, and small-model calls.

Timing ratios follow the paper-adjacent framing used in the brief: decision-model steps ≈ **31 ms / 0.03 cost units**; LLM (and deferred→LLM) steps ≈ **809 ms / 1.0 cost unit**. Playback is sped up (`playbackSpeed: 4`) so the race finishes in under 15s while meters still show paper-ish totals.
