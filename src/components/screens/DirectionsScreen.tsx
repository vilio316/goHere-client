import { useMemo } from "react";
import {
  FaArrowUp,
  FaArrowLeft,
  FaArrowRight,
  FaArrowRotateLeft,
  FaLocationDot,
  FaFlagCheckered,
  FaRoad,
  FaCircleNodes,
  FaArrowTrendUp,
  FaArrowTrendDown,
} from "react-icons/fa6";

/* =========================================================
   Types
   ========================================================= */

export interface OSRMManeuver {
  type: string;
  modifier?: string;
  bearing_before?: number;
  bearing_after?: number;
  location: [number, number];
  exit?: number;
}

export interface OSRMStep {
  distance: number;
  duration: number;
  name?: string;
  ref?: string;
  destinations?: string;
  exits?: string;
  mode?: string;

  maneuver: OSRMManeuver;
}

export interface OSRMRouteLeg {
  distance: number;
  duration: number;
  summary?: string;
  weight?: number;
  steps?: OSRMStep[];
}

interface RouteDirectionsProps {
  leg?: OSRMRouteLeg | null;
  className?: string;
}

/* =========================================================
   Formatting helpers
   ========================================================= */

function formatDistance(distance?: number): string {
  if (
    typeof distance !== "number" ||
    !Number.isFinite(distance) ||
    distance < 0
  ) {
    return "";
  }

  if (distance < 100) {
    return `${Math.max(10, Math.round(distance / 10) * 10)} m`;
  }

  if (distance < 1000) {
    return `${Math.round(distance / 50) * 50} m`;
  }

  if (distance < 10_000) {
    return `${(distance / 1000).toFixed(1)} km`;
  }

  return `${Math.round(distance / 1000)} km`;
}

function formatDuration(duration?: number): string {
  if (
    typeof duration !== "number" ||
    !Number.isFinite(duration) ||
    duration < 0
  ) {
    return "";
  }

  const totalMinutes = Math.round(duration / 60);

  if (totalMinutes < 1) {
    return "< 1 min";
  }

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

function getRoadName(step: OSRMStep): string {
  const name = step.name?.trim();
  const ref = step.ref?.trim();

  if (name && ref && name !== ref) {
    return `${name} (${ref})`;
  }

  if (name) {
    return name;
  }

  if (ref) {
    return ref;
  }

  return "the road";
}

function getDirectionText(modifier?: string): string {
  switch (modifier) {
    case "uturn":
      return "around";

    case "sharp right":
      return "sharp right";

    case "right":
      return "right";

    case "slight right":
      return "slightly right";

    case "straight":
      return "straight";

    case "slight left":
      return "slightly left";

    case "left":
      return "left";

    case "sharp left":
      return "sharp left";

    default:
      return "";
  }
}

/* =========================================================
   Instruction generator
   ========================================================= */

function getInstruction(step: OSRMStep): string {
  const type = step.maneuver?.type ?? "";
  const modifier = step.maneuver?.modifier;
  const exit = step.maneuver?.exit;

  const direction = getDirectionText(modifier);
  const road = getRoadName(step);

  switch (type) {
    case "depart":
      if (modifier && modifier !== "straight") {
        return `Head ${direction} on ${road}`;
      }

      return `Start on ${road}`;

    case "arrive":
      if (modifier === "left") {
        return "Your destination is on the left";
      }

      if (modifier === "right") {
        return "Your destination is on the right";
      }

      return "You have arrived at your destination";

    case "turn":
      return direction
        ? `Turn ${direction} onto ${road}`
        : `Turn onto ${road}`;

    case "continue":
      return direction && direction !== "straight"
        ? `Continue ${direction} on ${road}`
        : `Continue on ${road}`;

    case "new name":
      return `Continue onto ${road}`;

    case "merge":
      return direction
        ? `Merge ${direction} onto ${road}`
        : `Merge onto ${road}`;

    case "on ramp":
      return direction
        ? `Take the ramp ${direction} onto ${road}`
        : `Take the ramp onto ${road}`;

    case "off ramp":
      return direction
        ? `Take the exit ${direction} toward ${road}`
        : `Take the exit toward ${road}`;

    case "fork":
      return direction
        ? `Keep ${direction} to continue on ${road}`
        : `Continue on ${road}`;

    case "end of road":
      return direction
        ? `At the end of the road, turn ${direction} onto ${road}`
        : `At the end of the road, continue onto ${road}`;

    case "roundabout":
    case "rotary":
      if (exit) {
        return `At the roundabout, take exit ${exit} onto ${road}`;
      }

      return `Enter the roundabout and continue onto ${road}`;

    case "roundabout turn":
      if (exit) {
        return `At the roundabout, take exit ${exit} onto ${road}`;
      }

      return direction
        ? `At the roundabout, turn ${direction} onto ${road}`
        : `Continue through the roundabout onto ${road}`;

    case "notification":
      return road === "the road"
        ? "Continue along the route"
        : `Continue on ${road}`;

    default:
      return road === "the road"
        ? "Continue along the route"
        : `Continue on ${road}`;
  }
}

/* =========================================================
   Maneuver icon
   ========================================================= */

function ManeuverIcon({ step }: { step: OSRMStep }) {
  const type = step.maneuver?.type;
  const modifier = step.maneuver?.modifier;

  const iconClass = "h-5 w-5";

  if (type === "depart") {
    return <FaLocationDot className={iconClass} />;
  }

  if (type === "arrive") {
    return <FaFlagCheckered className={iconClass} />;
  }

  if (
    type === "roundabout" ||
    type === "rotary" ||
    type === "roundabout turn"
  ) {
    return <FaCircleNodes className={iconClass} />;
  }

  if (type === "merge" || type === "on ramp") {
    if (modifier?.includes("left")) {
      return <FaArrowTrendDown className={iconClass} />;
    }

    return <FaArrowTrendUp className={iconClass} />;
  }

  if (modifier === "uturn") {
    return <FaArrowRotateLeft className={iconClass} />;
  }

  if (
    modifier === "left" ||
    modifier === "slight left" ||
    modifier === "sharp left"
  ) {
    return <FaArrowLeft className={iconClass} />;
  }

  if (
    modifier === "right" ||
    modifier === "slight right" ||
    modifier === "sharp right"
  ) {
    return <FaArrowRight className={iconClass} />;
  }

  if (modifier === "straight") {
    return <FaArrowUp className={iconClass} />;
  }

  return <FaRoad className={iconClass} />;
}

/* =========================================================
   Component
   ========================================================= */

export default function RouteDirections({
  leg,
  className = "",
}: RouteDirectionsProps) {
  const steps = useMemo(() => {
    if (!Array.isArray(leg?.steps)) {
      return [];
    }

    return leg.steps.filter(
      (step): step is OSRMStep =>
        Boolean(step) &&
        Boolean(step.maneuver) &&
        Array.isArray(step.maneuver.location) &&
        step.maneuver.location.length === 2,
    );
  }, [leg]);

  if (!leg) {
    return (
      <div
        className={[
          "flex w-full items-center justify-center gap-3",
          "rounded-2xl border border-gray-200 bg-white p-6",
          "text-sm text-gray-500 shadow-sm",
          className,
        ].join(" ")}
      >
        <FaRoad className="h-5 w-5" />
        <p>No route selected.</p>
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div
        className={[
          "flex min-h-28 w-full max-w-md items-center justify-center gap-3",
          "rounded-2xl border border-gray-200 bg-white p-6",
          "text-sm text-gray-500 shadow-sm",
          className,
        ].join(" ")}
      >
        <FaRoad className="h-5 w-5 shrink-0" />

        <p>
          No turn-by-turn directions are available for this route.
        </p>
      </div>
    );
  }

  return (
    <section
      className={[
        "w-full overflow-hidden rounded-2xl",
        "border border-gray-200 bg-white text-gray-900",
        "shadow-[0_8px_24px_rgba(0,0,0,0.06)]",
        className,
      ].join(" ")}
    >
      {/* Route summary */}
      <header className="flex items-center justify-between gap-6 border-b border-gray-100 px-5 py-5">
        <div className="min-w-0">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Route
          </span>

          <h2 className="truncate text-lg font-bold text-gray-900">
            {leg.summary?.trim() || "Directions"}
          </h2>
        </div>

        <div className="shrink-0 text-right">
          <strong className="block text-[15px] font-semibold text-gray-900">
            {formatDuration(leg.duration)}
          </strong>

          <span className="mt-0.5 block text-sm text-gray-500">
            {formatDistance(leg.distance)}
          </span>
        </div>
      </header>

      {/* Steps */}
      <div className="py-2">
        {steps.map((step, index) => {
          const instruction = getInstruction(step);
          const distance = formatDistance(step.distance);
          const duration = formatDuration(step.duration);

          const isLast = index === steps.length - 1;

          return (
            <div
              key={`${step.maneuver.location.join("-")}-${index}`}
              className="grid min-h-[76px] grid-cols-[48px_1fr] px-4 sm:px-5"
            >
              {/* Icon / timeline */}
              <div className="relative flex justify-center">
                <div
                  className={[
                    "relative z-10 mt-4 flex h-10 w-10",
                    "items-center justify-center rounded-xl",
                    "bg-gray-100 text-gray-900",
                  ].join(" ")}
                >
                  <ManeuverIcon step={step} />
                </div>

                {!isLast && (
                  <div
                    aria-hidden="true"
                    className="absolute bottom-[-16px] left-1/2 top-14 w-0.5 -translate-x-1/2 bg-gray-200"
                  />
                )}
              </div>

              {/* Direction text */}
              <div
                className={[
                  "min-w-0 py-4 pl-2",
                  !isLast ? "border-b border-gray-100" : "",
                ].join(" ")}
              >
                <p className="text-[15px] font-semibold leading-6 text-gray-900">
                  {instruction}
                </p>

                {(distance || duration) && (
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                    {distance && <span>{distance}</span>}

                    {distance && duration && (
                      <span
                        aria-hidden="true"
                        className="text-gray-300"
                      >
                        •
                      </span>
                    )}

                    {duration && <span>{duration}</span>}
                  </div>
                )}

                {step.destinations && (
                  <p className="mt-1.5 truncate text-xs text-gray-500">
                    Toward {step.destinations}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}