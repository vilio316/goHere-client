import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaCirclePlus,
  FaLocationDot,
  FaMagnifyingGlassArrowRight,
  FaSpinner,
  FaXmark,
} from "react-icons/fa6";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardBody } from "../ui/Card";
import { Input } from "../ui/Input";

export interface JourneyWaypoint {
  id: string;
  name: string;
  address?: string;
  lat: number;
  lon: number;
}

export interface JourneyStopsProps {
  waypoints: JourneyWaypoint[];
  onAdd: (waypoint: JourneyWaypoint) => void;
  onRemove: (id: string) => void;
  className?: string;
}

type Feedback = {
  tone: "success" | "error";
  message: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function readResults(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  for (const key of ["data", "places", "results"]) {
    const value = payload[key];

    if (Array.isArray(value)) {
      return value;
    }

    if (isRecord(value) && Array.isArray(value.places)) {
      return value.places;
    }
  }

  return [];
}

function toWaypoint(result: unknown): JourneyWaypoint | null {
  if (!isRecord(result)) {
    return null;
  }

  const lat = readNumber(result.lat ?? result.latitude);
  const lon = readNumber(result.lon ?? result.lng ?? result.longitude);

  if (lat === null || lon === null) {
    return null;
  }

  const displayName =
    typeof result.display_name === "string" ? result.display_name : undefined;
  const name =
    (typeof result.name === "string" && result.name.trim()) ||
    displayName?.split(",")[0]?.trim() ||
    "Selected stop";

  const rawId = result.osm_id ?? result.place_id ?? result.id;
  const id =
    rawId !== undefined && rawId !== null
      ? String(rawId)
      : `${lat.toFixed(5)},${lon.toFixed(5)}`;

  return { id, name, address: displayName, lat, lon };
}

function isSamePlace(a: JourneyWaypoint, b: JourneyWaypoint): boolean {
  return (
    a.id === b.id ||
    (Math.abs(a.lat - b.lat) < 0.00001 &&
      Math.abs(a.lon - b.lon) < 0.00001)
  );
}

async function lookupPlaces(searchTerm: string): Promise<unknown[]> {
  const request = await fetch(
    `${import.meta.env.VITE_API_URL}/search/${encodeURIComponent(searchTerm)}`,
  );

  if (!request.ok) {
    throw new Error("We couldn't look up that place. Please try again.");
  }

  return readResults(await request.json());
}

/**
 * Optional stop planner for the detail screen. It only changes the journey
 * when a place is explicitly added, so two-point trips keep their original
 * route and directions.
 */
export function JourneyStops({
  waypoints,
  onAdd,
  onRemove,
  className = "",
}: JourneyStopsProps) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [submissionCount, setSubmissionCount] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const handledSubmission = useRef(0);

  // Search results are keyed by the submitted place name and cached for an
  // hour. Re-submitting the same place reuses the same coordinates instead of
  // repeatedly hitting the lookup endpoint.
  const stopSearch = useQuery({
    queryKey: ["journey-stop-search", submittedQuery],
    queryFn: async () => {
      const waypoint = (await lookupPlaces(submittedQuery))
        .map(toWaypoint)
        .find((result): result is JourneyWaypoint => result !== null);

      if (!waypoint) {
        throw new Error(
          `No places found for "${submittedQuery}". Try a more specific address.`,
        );
      }

      return waypoint;
    },
    enabled: submittedQuery.length > 0,
    staleTime: 60 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (
      submissionCount === 0 ||
      handledSubmission.current === submissionCount
    ) {
      return;
    }

    if (stopSearch.isFetching) {
      return;
    }

    if (stopSearch.isError) {
      handledSubmission.current = submissionCount;
      setFeedback({
        tone: "error",
        message:
          stopSearch.error instanceof Error
            ? stopSearch.error.message
            : "We couldn't add that stop. Please try again.",
      });
      return;
    }

    const waypoint = stopSearch.data;

    if (!waypoint) {
      return;
    }

    handledSubmission.current = submissionCount;

    if (waypoints.some((existing) => isSamePlace(existing, waypoint))) {
      setFeedback({
        tone: "error",
        message: `${waypoint.name} is already a stop on this journey.`,
      });
      return;
    }

    onAdd(waypoint);
    setQuery("");
    setFeedback({
      tone: "success",
      message: `Added ${waypoint.name}. Your route and directions are updating.`,
    });
  }, [
    onAdd,
    stopSearch.data,
    stopSearch.error,
    stopSearch.isError,
    stopSearch.isFetching,
    submissionCount,
    waypoints,
  ]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const searchTerm = query.trim();

    if (!searchTerm || stopSearch.isFetching) {
      return;
    }

    setFeedback(null);
    setSubmittedQuery(searchTerm);
    setSubmissionCount((count) => count + 1);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);

    if (feedback?.tone === "error") {
      setFeedback(null);
    }
  };

  const handleRemove = (waypointId: string) => {
    setFeedback(null);
    onRemove(waypointId);
  };

  return (
    <Card className={className}>
      <CardBody>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent-text">
              <FaCirclePlus aria-hidden="true" size={18} />
            </span>

            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold leading-tight text-text-primary">
                Extra places on your journey
              </h3>
              <p className="mt-1 text-body-m text-text-secondary">
                Add a stop between here and your destination, or leave this
                empty for a direct trip.
              </p>
            </div>
          </div>

          <Badge variant="solo" className="shrink-0">
            Optional
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="mt-5" noValidate>
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-label-s text-text-secondary"
          >
            Place name or address
          </label>

          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <Input
                id={inputId}
                type="search"
                value={query}
                onChange={(event) => handleQueryChange(event.target.value)}
                placeholder="e.g. Lekki Conservation Centre"
                autoComplete="off"
                aria-describedby={feedback ? `${inputId}-feedback` : undefined}
              />
            </div>

            <Button
              type="submit"
              aria-label="Look up and add this stop"
              disabled={stopSearch.isFetching || query.trim() === ""}
              className="shrink-0 gap-2 px-4 py-3.5 disabled:pointer-events-none disabled:opacity-50"
            >
              {stopSearch.isFetching ? (
                <FaSpinner aria-hidden="true" className="animate-spin" />
              ) : (
                <FaMagnifyingGlassArrowRight aria-hidden="true" size={18} />
              )}
              <span className="hidden sm:inline">Add stop</span>
            </Button>
          </div>
        </form>

        {feedback && (
          <p
            id={`${inputId}-feedback`}
            role={feedback.tone === "error" ? "alert" : "status"}
            className={`mt-3 break-words text-body-m ${
              feedback.tone === "error"
                ? "text-alert-text"
                : "text-live-text"
            }`}
          >
            {feedback.message}
          </p>
        )}

        {waypoints.length > 0 && (
          <div className="mt-5">
            <p className="text-label-s text-text-secondary">
              Stops on this journey
            </p>

            <ol className="mt-2 space-y-2" aria-label="Stops added to this journey">
              {waypoints.map((waypoint, index) => (
                <li
                  key={waypoint.id}
                  className="flex items-start gap-3 rounded-md border border-border-subtle bg-surface-sunken px-3 py-2.5"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-tint font-data text-xs font-medium text-accent-text">
                    {index + 1}
                  </span>

                  <div className="w-0 min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-primary">
                      {waypoint.name}
                    </p>
                    {waypoint.address && waypoint.address !== waypoint.name && (
                      <p className="mt-0.5 truncate text-xs text-text-secondary">
                        {waypoint.address}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(waypoint.id)}
                    aria-label={`Remove ${waypoint.name} from this journey`}
                    className="focus-visible-ring -mr-1 mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-text-secondary transition-standard hover:bg-surface-hover hover:text-text-primary"
                  >
                    <FaXmark aria-hidden="true" size={16} />
                  </button>
                </li>
              ))}
            </ol>

            <p className="mt-3 flex items-center gap-2 font-data text-xs text-text-secondary">
              <FaLocationDot aria-hidden="true" size={12} />
              Stops are visited in the order shown.
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
