import { useState } from "react";

export interface MoodChipsProps {
  moods?: string[];
  onMoodSelect?: (mood: string) => void;
}

export function MoodChips({
  moods = [
    "Food & Drinks",
    "Parks/Gardens",
    "Healthcare & Wellness",
    "Spas & Relaxation",
    "Shopping",
    "Nightlife",
  ],
  onMoodSelect,
}: MoodChipsProps) {
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const handleClick = (mood: string) => {
    setActiveMood(activeMood === mood ? null : mood);
    onMoodSelect?.(mood);
  };

  return (
    <div>
      <p className="text-label-s text-slate-400 mb-3">I'm looking for: </p>
      <div
        className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4"
        style={{ scrollbarWidth: "none" }}
      >
        {moods.map((mood) => (
          <button
            key={mood}
            onClick={() => handleClick(mood)}
            className={`
              flex-shrink-0 px-4 py-2.5
              bg-dusk-800 border-1.5 rounded-pill
              text-fog-050 text-sm font-medium
              transition-standard
              ${activeMood === mood ? "border-amber-500 bg-amber-500/10 text-amber-500" : "border-dusk-600"}
              active:border-amber-500 active:bg-amber-500/10 active:text-amber-500
              focus-visible-ring
            `}
            aria-pressed={activeMood === mood}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
}
