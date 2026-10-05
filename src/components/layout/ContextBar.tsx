export interface ContextBarProps {
  temperature?: string;
  time?: string;
  walkRadius?: string;
}

export function ContextBar({ temperature = "26°C", time = "20:34", walkRadius = "1 km" }: ContextBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 bg-dusk-600/40 border border-dusk-600 rounded-md p-3">
      <div className="flex items-center gap-1 text-sm">
        <span aria-hidden="true">🌙</span>
        <span className="font-data text-fog-050">{temperature}</span>
      </div>
      <div className="flex items-center gap-1 text-sm">
        <span aria-hidden="true">⏰</span>
        <span className="font-data text-fog-050">{time}</span>
      </div>
      <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500 rounded-pill">
        <span aria-hidden="true">📍</span>
        <span className="font-body font-semibold text-xs text-amber-500">{walkRadius}</span>
      </div>
    </div>
  );
}