import { useNavigate, useSearchParams } from "react-router";
import { StatusBar } from "../layout";
import { PlaceCard } from "../layout/PlaceCard";
import { SwipeHint } from "../layout/SwipeHint";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocationCoords } from "../../contexts/LocationContext";
import { transformOSMPlaceToPlace } from "../../utils/placeTransformer";
import LoaderComp from "../LoaderComp";

export function FeedScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moodQuery = searchParams.get("q");
  const { location } = useLocationCoords();

  useEffect(() => {
    console.log(moodQuery);
  }, [moodQuery]);

  const { data, isSuccess, isLoading, isError, error } = useQuery({
    queryKey: ["moodResults", moodQuery],
    staleTime: 1 * 60 * 60 * 1000,
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

  const handleSaveClick = (placeId: string) => {
    console.log("Save place:", placeId);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="w-full">
          <div className="mb-6">
            <h2 className="font-display font-bold text-2xl mb-2">Right now</h2>
            <p className="text-label-s text-slate-400">
              Solo-friendly {moodQuery} places near you
            </p>
          </div>

          {isLoading && <LoaderComp />}

          {isError && (
            <div className="text-center py-8 text-transit-500">
              Failed to load places:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </div>
          )}

          {/* {isSuccess && data.places.length === 0 && (
            <div className="text-center py-8 text-slate-400">
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
                  onSaveClick={() => handleSaveClick(place.osm_id)}
                />
              ))}
            </div>
          )}
          <SwipeHint />
        </div>
      </div>
    </div>
  );
}
