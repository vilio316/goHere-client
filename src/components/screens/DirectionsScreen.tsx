import { useParams, useNavigate } from "react-router";
import { StatusBar } from "../layout";
import { Button } from "../ui/Button";
import { getPlaceById } from "../../data/places";

export function DirectionsScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const place = getPlaceById(id || "");

  if (!place) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <StatusBar time="9:41" />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="font-display font-bold text-xl mb-2">Place not found</h2>
            <Button variant="secondary" onClick={() => navigate("/explore")}>
              Back to Explore
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <StatusBar time="9:41" />
      <div className="flex-1 flex flex-col">
        <div
          className="flex-1 bg-gradient-to-br from-dusk-800 to-dusk-700 border-b border-dusk-600 flex items-center justify-center"
          style={{ minHeight: "400px" }}
        >
          <div className="text-center text-slate-400">
            <p className="text-lg mb-2">🗺️ Map Rendering (MapLibre GL JS)</p>
            <p className="text-sm">Navigation to {place.name}</p>
          </div>
        </div>

        <div className="p-4 space-y-4 bg-dusk-950">
          <div className="bg-amber-500 text-ink-900 p-4 rounded-md">
            <p className="font-semibold text-sm mb-1">🎯 Next: Turn left on Lagos St</p>
            <p className="text-xs opacity-80">In 80 meters · ETA 3 min</p>
          </div>

          <div className="bg-dusk-800 border border-dusk-600 p-4 rounded-md space-y-3">
            <div className="flex justify-between">
              <span className="text-label-s text-slate-400">Total distance</span>
              <span className="font-data font-semibold text-fog-050">{place.distance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-label-s text-slate-400">Est. time</span>
              <span className="font-data font-semibold text-fog-050">{place.walkTime} walk</span>
            </div>
          </div>

          <Button variant="primary" fullWidth onClick={() => navigate("/explore")}>
            ← Back to Explore
          </Button>
        </div>
      </div>
    </div>
  );
}