import { useNavigate, useSearchParams } from "react-router";
import { useCallback, useState } from "react";
import { PlaceCard } from "../layout/PlaceCard";
import { SwipeHint } from "../layout/SwipeHint";
import { SaveLocationModal } from "../ui";
import { useQuery } from "@tanstack/react-query";
import { useLocationCoords } from "../../contexts/LocationContext";
import { authClient } from "../../lib/authClient";
import { transformOSMPlaceToPlace } from "../../utils/placeTransformer";
import { moods } from "../../data/moods";
import GlobeLoader from "../GlobeLoader";

export function FeedScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moodQuery = searchParams.get("q");
  const { location } = useLocationCoords();
  const { data: session } = authClient.useSession();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveTargetName, setSaveTargetName] = useState<string | undefined>(
    undefined,
  );

  const closeSaveModal = useCallback(() => {
    setIsSaveModalOpen(false);
    setSaveTargetName(undefined);
  }, []);

  const { data, isSuccess, isLoading, isError, error } = useQuery({
    queryKey: ["moodResults", moodQuery],
    staleTime: 1 * 60 * 60 * 1000,
    enabled: Boolean(moodQuery),
    queryFn: async () => {
      try {
        const request = await fetch(
          `${import.meta.env.VITE_API_URL}/poi/search`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: `give me a few places with good ${moodQuery?.toLowerCase()} nearby`,
              latitude: Number(location.lat.toFixed(4)),
              longitude: Number(location.long.toFixed(4)),
            }),
          },
        );
        const response = await request.json();
        return response;
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Unknown error",
        );
      }
    },
  });

  const handleDetailClick = (placeId: string, placeName: string) => {
    navigate(`/place/${placeId}?q=${placeName}`);
  };

  const handleSaveClick = (placeId: string, placeName?: string) => {
    if (!session?.user) {
      setSaveTargetName(placeName);
      setIsSaveModalOpen(true);
      return;
    }
  };
    
  if (!moodQuery) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto w-full py-8 md:py-12">
            <div className="mb-6 md:mb-8">
              <p className="text-label-s text-text-secondary uppercase mb-2">
                Explore
              </p>
              <h2 className="font-display font-bold text-2xl md:text-3xl">
                What are you in the mood for?
              </h2>
              <p className="text-body-m text-text-secondary mt-2 max-w-xl">
                Pick a mood and we'll find solo-friendly places near you.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
              {moods.map(({ label, description, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    navigate(`/explore?q=${encodeURIComponent(label)}`)
                  }
                  className="group flex min-h-[150px] sm:min-h-[180px] flex-col justify-between rounded-lg border border-border-subtle bg-surface-raised p-4 sm:p-5 text-left shadow-card transition-standard hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-hover focus-visible-ring active:translate-y-0"
                >
                  <span className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-accent-tint text-accent-text transition-standard group-hover:bg-accent-fill group-hover:text-on-accent">
                    <Icon size={22} aria-hidden="true" />
                  </span>

                  <span className="mt-4 block">
                    <span className="block font-display text-base sm:text-lg font-bold leading-tight text-text-primary">
                      {label}
                    </span>
                    <span className="mt-1 block text-xs sm:text-sm leading-snug text-text-secondary line-clamp-2">
                      {description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
    return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="w-full my-2 md:my-4">
          <div className="mb-6">
            <h2 className="font-display font-bold text-2xl mb-2">Right Now</h2>
            <p className="text-label-s text-text-secondary">
              Solo-friendly {moodQuery} places near you
            </p>
          </div>

          {isLoading && <GlobeLoader />}

          {isError && (
            <div className="text-center py-8 text-alert-text">
              Failed to load places:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </div>
          )}

          {/* {isSuccess && data.places.length === 0 && (
            <div className="text-center py-8 text-text-secondary">
              No places found for this mood
            </div>
          )} */}

          {isSuccess && (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 md:gap-2 lg:gap-3">
              {data.data.places.map((place: any) => (
                <PlaceCard
                  key={place.osm_id}
                  place={transformOSMPlaceToPlace(place)}
                  onDetailClick={() =>
                    handleDetailClick(place.osm_id, place.name)
                  }
                  onSaveClick={() =>
                    handleSaveClick(place.osm_id, place.name)
                  }
                />
              ))}
            </div>
          )}
          <SwipeHint />
        </div>
      </div>
      <SaveLocationModal
        open={isSaveModalOpen}
        onClose={closeSaveModal}
        placeName={saveTargetName}
      />
    </div>
  );
}
