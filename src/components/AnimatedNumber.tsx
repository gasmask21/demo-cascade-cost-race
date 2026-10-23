import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({
  value,
  decimals = 0,
  suffix = "",
  className,
}: Props) {
  const [display, setDisplay] = useState(value);
  const frame = useRef<number>(0);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    const delta = value - start;
    if (delta === 0) return;
    const t0 = performance.now();
    const duration = 280;

    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(start + delta * eased);
      if (t < 1) frame.current = requestAnimationFrame(tick);
      else from.current = value;
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [value]);

  return (
    <span className={className}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
