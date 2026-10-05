import { useNavigate } from "react-router";
import { StatusBar } from "../layout";
import { PlaceCard } from "../layout/PlaceCard";
import { SwipeHint } from "../layout/SwipeHint";
import { dummyPlaces } from "../../data/places";

export function FeedScreen() {
  const navigate = useNavigate();

  const handleDetailClick = (placeId: string) => {
    navigate(`/place/${placeId}`);
  };

  const handleSaveClick = (placeId: string) => {
    console.log("Save place:", placeId);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <StatusBar time="9:41" />
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="max-w-xl mx-auto w-full">
          <div className="mb-6">
            <h2 className="font-display font-bold text-2xl mb-2">Right now</h2>
            <p className="text-label-s text-slate-400">Solo-friendly places near you</p>
          </div>

          {dummyPlaces.map((place) => (
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