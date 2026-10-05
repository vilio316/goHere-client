export function StatusBar(props: { time?: string } = {}) {
  const { time = "9:41" } = props;
  return (
    <div className="h-11 bg-dusk-950 flex items-center justify-between px-4 border-b border-dusk-700 font-data text-xs text-fog-050">
      <span className="font-semibold">{time}</span>
      <div className="flex items-center gap-3">
        <div className="w-3.5 h-3.5 bg-signal-500 rounded-[2px]" aria-hidden="true" />
        <div className="w-3.5 h-3.5 bg-signal-500 rounded-[2px]" aria-hidden="true" />
        <div className="w-3.5 h-3.5 bg-signal-500 rounded-[2px]" aria-hidden="true" />
      </div>
    </div>
  );
}