/** Motorcycle-themed loader. Only rendered as a Suspense fallback while a preview chunk genuinely loads. */
export function MotoLoader({ label = "Getting your ride ready…" }: { label?: string }) {
  return (
    <div className="moto-loader" role="status" aria-live="polite">
      <svg viewBox="0 0 120 64" width="120" height="64" aria-hidden="true">
        <g className="moto-speed"><path d="M4 30h18M0 38h14M6 46h16" /></g>
        <g className="moto-body">
          <path className="moto-frame" d="M30 44 L50 26 H70 L80 36 H92 L86 26 H96" />
          <path className="moto-tank" d="M50 26 Q60 16 74 22 L70 26Z" />
          <path className="moto-frame" d="M58 44 L66 32" />
        </g>
        <g className="moto-wheel" style={{ transformOrigin: "30px 44px" }}><circle cx="30" cy="44" r="13" /><path d="M30 31v26M17 44h26" /></g>
        <g className="moto-wheel" style={{ transformOrigin: "92px 44px" }}><circle cx="92" cy="44" r="13" /><path d="M92 31v26M79 44h26" /></g>
      </svg>
      <span>{label}</span>
    </div>
  );
}
