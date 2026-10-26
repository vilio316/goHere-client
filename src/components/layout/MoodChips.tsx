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
      <p className="text-label-s text-text-secondary mb-3">I'm looking for: </p>
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
              bg-surface-raised border-1.5 rounded-pill
              text-text-primary text-sm font-medium
              transition-standard
              ${activeMood === mood ? "border-chip-active-border bg-chip-active-bg text-chip-active-text" : "border-border-strong"}
              active:border-chip-active-border active:bg-chip-active-bg active:text-chip-active-text
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
