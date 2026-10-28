import { useEffect, useId, useState } from "react";

const DEFAULT_MESSAGES = [
  "Thinking…",
  "Plotting…",
  "Scouting…",
  "Getting our bearings…",
  "Wandering…",
  "Checking the map…",
  "Following a hunch…",
  "Finding your spot…",
];

export interface GlobeLoaderProps {
  messages?: string[];
  className?: string;
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

export function GlobeLoader({
  messages = DEFAULT_MESSAGES,
  className = "",
}: GlobeLoaderProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const phrases = messages.length > 0 ? messages : DEFAULT_MESSAGES;
  const phraseCount = phrases.length;
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion || phraseCount < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % phraseCount);
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, [phraseCount, prefersReducedMotion]);

  const message = phrases[messageIndex % phraseCount];

  return (
    <div
      role="status"
      className={`flex h-[90vh] w-full flex-col items-center justify-center gap-6 px-4 py-10 text-center ${className}`}
    >
      <span className="sr-only">Loading</span>

      <div
        aria-hidden="true"
        className="relative h-32 w-32 shrink-0 sm:h-36 sm:w-36"
      >
        <div className="absolute inset-5 rounded-full bg-accent-tint blur-2xl" />

        <div className="animate-globe-orbit absolute inset-0 rounded-full border border-dashed border-accent-fill/30">
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-fill" />
        </div>

        <GlobeArt reducedMotion={prefersReducedMotion} />
      </div>

      <div
        aria-hidden="true"
        className="flex min-h-[4.5rem] flex-col items-center gap-1"
      >
        <p
          key={messageIndex}
          className="animate-phrase-in font-display text-lg font-semibold leading-tight text-text-primary sm:text-xl"
        >
          {message}
        </p>
        <p className="text-label-s text-text-secondary">
          Finding your next spot
        </p>
      </div>
    </div>
  );
}

export default GlobeLoader;

function GlobeArt({ reducedMotion }: { reducedMotion: boolean }) {
  const uid = useId().replace(/:/g, "");
  const clipId = `globe-clip-${uid}`;
  const depthId = `globe-depth-${uid}`;

  return (
    <svg
      viewBox="0 0 128 128"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="64" cy="64" r="46" />
        </clipPath>

        <radialGradient id={depthId} cx="34%" cy="28%" r="78%">
          <stop
            offset="0%"
            stopColor="var(--accent-fill)"
            stopOpacity="0.24"
          />
          <stop
            offset="52%"
            stopColor="var(--accent-fill)"
            stopOpacity="0"
          />
          <stop offset="100%" stopColor="#12162a" stopOpacity="0.45" />
        </radialGradient>
      </defs>

      <circle
        cx="64"
        cy="64"
        r="46"
        fill="var(--surface-raised)"
        stroke="var(--border-strong)"
        strokeWidth="1.5"
      />

      <g clipPath={`url(#${clipId})`}>
        <g>
          {!reducedMotion && (
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-128 0"
              dur="9s"
              repeatCount="indefinite"
            />
          )}

          {[0, 128, 256].map((offset) => (
            <g key={offset} transform={`translate(${offset} 0)`}>
              <Landmass />
            </g>
          ))}
        </g>

        {/* Latitude and longitude grid */}
        <g
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.5"
        >
          <ellipse cx="64" cy="64" rx="34" ry="46" />
          <ellipse cx="64" cy="64" rx="17" ry="46" />
          <line x1="64" y1="18" x2="64" y2="110" />
          <line x1="18" y1="64" x2="110" y2="64" />
          <ellipse cx="64" cy="43" rx="40" ry="15.5" />
          <ellipse cx="64" cy="85" rx="40" ry="15.5" />
          <ellipse cx="64" cy="27" rx="23" ry="8.5" />
          <ellipse cx="64" cy="101" rx="23" ry="8.5" />
        </g>

        <circle cx="64" cy="64" r="46" fill={`url(#${depthId})`} />
      </g>

      <circle
        cx="64"
        cy="64"
        r="46"
        fill="none"
        stroke="var(--accent-fill)"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function Landmass() {
  return (
    <g
      fill="var(--accent-fill)"
      fillOpacity="0.55"
      stroke="var(--accent-fill)"
      strokeOpacity="0.35"
      strokeWidth="0.8"
      strokeLinejoin="round"
    >
      <path d="M28 36c7-8 19-10 26-4 5 4 6 11 2 16-3 4-8 5-10 10-2 5-7 8-12 6-6-2-9-8-9-14 0-5 1-10 3-14Z" />
      <path d="M73 38c4-4 11-5 16-1 5 4 6 10 3 15-2 3-6 4-7 8-1 5-4 9-9 9-6 0-10-5-10-11 0-7 3-15 7-20Z" />
      <path d="M56 80c5-5 13-6 19-2 4 3 5 8 2 12-2 3-6 4-8 8-2 4-6 6-10 4-4-2-6-7-5-12 0-4 1-7 2-10Z" />
      <path d="M94 26c3-2 7-2 9 1 2 3 1 7-2 9-3 2-7 1-9-2-2-3-1-6 2-8Z" />
      <path d="M36 84c3-2 7-1 8 2 1 3-1 6-4 7-3 1-6-1-6-4 0-2 1-4 2-5Z" />
      <path d="M0 56c4-3 9-1 10 3 1 4-1 7-5 7-3 0-5-2-5-5v-5Z" />
      <path d="M116 78c4-1 8 1 9 5 1 4-2 7-5 7-4 0-6-3-6-6 0-2 1-4 2-6Z" />
      <circle cx="68" cy="26" r="2.2" />
      <circle cx="104" cy="66" r="2" />
      <circle cx="46" cy="106" r="1.8" />
      <circle cx="86" cy="96" r="1.5" />
    </g>
  );
}
