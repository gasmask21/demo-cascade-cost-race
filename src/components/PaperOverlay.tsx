import type { RaceFixture } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  numbers: RaceFixture["paperNumbers"];
}

export function PaperOverlay({ open, onClose, numbers }: Props) {
  if (!open) return null;
  return (
    <div className="paper-overlay" role="dialog" aria-modal="true">
      <div className="paper-overlay__card">
        <header>
          <h2>Paper numbers</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            Close
          </button>
        </header>
        <p className="paper-overlay__lede">
          Sourced from{" "}
          <a
            href="https://arxiv.org/abs/2610.21412"
            target="_blank"
            rel="noreferrer"
          >
            arXiv:2610.21412
          </a>{" "}
          and author / commentary threads — not invented for this demo.
        </p>
        <ul>
          {numbers.map((n) => (
            <li key={n.stat + n.label}>
              <strong>{n.stat}</strong>
              <span>{n.label}</span>
              <cite>{n.source}</cite>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        className="paper-overlay__backdrop"
        aria-label="Dismiss"
        onClick={onClose}
      />
    </div>
  );
}
