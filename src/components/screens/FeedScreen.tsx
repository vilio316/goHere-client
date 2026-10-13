import { useNavigate, useSearchParams } from "react-router";
import { StatusBar } from "../layout";
import { PlaceCard } from "../layout/PlaceCard";
import { SwipeHint } from "../layout/SwipeHint";
import { dummyPlaces } from "../../data/places";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocationCoords } from "../../contexts/LocationContext";

export function FeedScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moodQuery = searchParams.get("q");
  const { location } = useLocationCoords();

  useEffect(() => {
    console.log(moodQuery);
  }, []);

  const { isSuccess, isLoading } = useQuery({
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
      } catch (error: any) {
        throw new Error(error);
      }
    },
  });

  const handleDetailClick = (placeId: string) => {
    navigate(`/place/${placeId}`);
  };

  const handleSaveClick = (placeId: string) => {
    console.log("Save place:", placeId);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="max-w-xl mx-auto w-full">
          <div className="mb-6">
            <h2 className="font-display font-bold text-2xl mb-2">Right now</h2>
            <p className="text-label-s text-slate-400">
              Solo-friendly places near you
            </p>
          </div>
          {isLoading && "Loading query results"}

          {isSuccess &&
            dummyPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onDetailClick={() => handleDetailClick(place.id)}
                onSaveClick={() => handleSaveClick(place.id)}
              />
            ))}

          <SwipeHint />
        </div>
      </div>
    </div>
  );
}
