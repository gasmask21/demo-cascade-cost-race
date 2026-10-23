import type { LaneId, RaceFixture, RaceTotals } from "../types";
import { computeLaneTotals } from "../types";

export interface RaceExportPayload {
  taskId: string;
  seed: number;
  task: string;
  fittedTau: number;
  lanes: Record<
    LaneId,
    RaceTotals & { label: string; failureReason?: string }
  >;
  exportedAt: string;
}

export function buildExportPayload(fixture: RaceFixture): RaceExportPayload {
  const lanes = {} as RaceExportPayload["lanes"];
  for (const id of Object.keys(fixture.lanes) as LaneId[]) {
    const lane = fixture.lanes[id];
    lanes[id] = {
      label: lane.label,
      failureReason: lane.failureReason,
      ...computeLaneTotals(lane, fixture.timing),
    };
  }
  return {
    taskId: fixture.taskId,
    seed: fixture.seed,
    task: fixture.task.title,
    fittedTau: fixture.fittedTau,
    lanes,
    exportedAt: new Date().toISOString(),
  };
}

export function downloadJson(payload: RaceExportPayload): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cascade-cost-race-${payload.taskId}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadScoreboardPng(
  fixture: RaceFixture,
  payload: RaceExportPayload,
): void {
  const w = 960;
  const h = 540;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#0B3D3A");
  bg.addColorStop(0.55, "#124E4A");
  bg.addColorStop(1, "#1A2F3A");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(232,244,242,0.06)";
  for (let i = 0; i < 12; i++) {
    ctx.fillRect(0, 40 + i * 42, w, 1);
  }

  ctx.fillStyle = "#E8F4F2";
  ctx.font = "700 36px Sora, sans-serif";
  ctx.fillText("Cascade Cost Race", 48, 64);
  ctx.font = "400 16px Sora, sans-serif";
  ctx.fillStyle = "rgba(232,244,242,0.75)";
  ctx.fillText(fixture.task.title, 48, 96);

  const order: LaneId[] = ["llm-only", "replace", "cascade"];
  const accents: Record<LaneId, string> = {
    "llm-only": "#7EB8C9",
    replace: "#E07A5F",
    cascade: "#F0A202",
  };

  order.forEach((id, i) => {
    const lane = payload.lanes[id];
    const x = 48 + i * 300;
    const y = 140;
    ctx.fillStyle = "rgba(8,28,26,0.45)";
    ctx.beginPath();
    roundRect(ctx, x, y, 276, 300, 16);
    ctx.fill();

    ctx.fillStyle = accents[id];
    ctx.font = "700 22px Sora, sans-serif";
    ctx.fillText(lane.label, x + 20, y + 40);

    ctx.fillStyle = lane.success ? "#6FCF97" : "#E07A5F";
    ctx.font = "600 18px IBM Plex Mono, monospace";
    ctx.fillText(lane.success ? "SUCCESS ✓" : "FAILED ✗", x + 20, y + 78);

    ctx.fillStyle = "#E8F4F2";
    ctx.font = "500 15px IBM Plex Mono, monospace";
    const lines = [
      `cost  ${lane.cost.toFixed(2)} u`,
      `wall  ${lane.wallMs} ms`,
      `LLM   ${lane.llmCalls} calls`,
      `small ${lane.decisionCalls} calls`,
    ];
    lines.forEach((line, li) => {
      ctx.fillText(line, x + 20, y + 130 + li * 32);
    });
  });

  ctx.fillStyle = "rgba(232,244,242,0.5)";
  ctx.font = "400 12px Sora, sans-serif";
  ctx.fillText(
    `τ=${fixture.fittedTau} · seed ${fixture.seed} · fixtures only · arXiv:2610.21412`,
    48,
    h - 28,
  );

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cascade-cost-race-${fixture.taskId}.png`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
