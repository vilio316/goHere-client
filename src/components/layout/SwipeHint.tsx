export function SwipeHint() {
  return (
    <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-400">
      <span>Swipe right to save, left to skip</span>
      <span className="inline-block w-5 h-0.5 bg-amber-500 rounded animate-swipe" aria-hidden="true" />
    </div>
  );
}