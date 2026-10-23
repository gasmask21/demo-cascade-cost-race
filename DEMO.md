# Cascade Cost Race — 30-second talk track

**Open the preview. Point at the brand, then the task.**

> “Cascade Cost Race. Same DecisionGym-style job: cancel Lena Wang’s pending order — but which one?”

**Hit Race. Narrate the three lanes as steps appear.**

> “LLM-only asks the customer, cancels the right order, and burns every call at full price.  
> Replace always trusts the small model — it confidently cancels ORD-991, the wrong order, irreversible fail.  
> Cascade is Jev-style: accept only when confidence ≥ fitted τ. Ambiguous cancel at 0.41 gets deferred to the LLM, then a high-confidence cancel of ORD-2088 succeeds.”

**Land on the scoreboard.**

> “Success on Cascade and LLM-only. Replace fails. Cascade wins on dollars and LLM calls — that’s why the harness needs a *fitted* threshold, not ‘always use the small model.’ Paper: 81–89% cheaper, up to 2.5× faster; without a threshold you drop ~19 points.”

**Optional:** toggle **Show paper numbers**, then **Export PNG/JSON**.

## Pass checklist

- One click finishes all three lanes in under 15s
- Replace fails with wrong cancel; Cascade + LLM-only succeed
- Cascade cost and LLM calls lower than LLM-only
- No API keys required
