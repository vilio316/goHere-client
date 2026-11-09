import { useParams, useNavigate } from "react-router";
import { useCallback, useState } from "react";
import { Card, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { SaveLocationModal } from "../ui";
import { useQuery } from "@tanstack/react-query";
import GlobeLoader from "../GlobeLoader";
import { FaSave } from "react-icons/fa";
import { MapRender } from "../maps/RenderMap";
import { useLocationCoords } from "../../contexts/LocationContext";
import { authClient } from "../../lib/authClient";
import RouteDirections from "./DirectionsScreen";

export function DetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocationCoords();
  const { data: session } = authClient.useSession();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const closeSaveModal = useCallback(() => setIsSaveModalOpen(false), []);

  const {
    data: place,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["details", id],
    staleTime: 1 * 60 * 60 * 1000,
    queryFn: async () => {
      try{
      const request = await fetch(
        `${import.meta.env.VITE_API_URL}/search/lookup/${id}`,
      );
      const response = await request.json();
      const [data] = response;
      return data;
    }catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Unknown error",
      );
    }} 
  });

  const {data: routeData, isLoading: isRouteLoading} = useQuery({
    queryKey: ["geometry", id],
    staleTime: 1 * 60 * 60 * 1000,  
    queryFn: async () => {
      const request = await fetch(
        `${import.meta.env.VITE_API_URL}/osrm/route/${`${location.location.long},${location.location.lat};${place?.lon},${place?.lat}`}`,
      );
      const response = await request.json();
      return response;
    }, 
    enabled: !!place
  });

  if (isSuccess && !place) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="font-display font-bold text-xl mb-2">
              Place not found
            </h2>
            <Button variant="secondary" onClick={() => navigate("/explore")}>
              Back to Explore
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveClick = () => {
    if (!session?.user) {
      setIsSaveModalOpen(true);
      return;
    }

    console.log("Save place:", place?.osm_id ?? id);
  };

  return (
    <>
    <div className="flex flex-col overflow-hidden place-items-center gap-x-2 md:gap-x-4 p-3 md:p-6">
      {isLoading && <GlobeLoader />}
      {isSuccess && (
        <div className="grid flex-col-reverse md:grid-cols-2 gap-x-2 md:gap-x-8 overflow-y-auto px-4 md:pt-6 pt-3 pb-20">
          <div className="max-w-xl mx-auto w-full">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(-1)}
                className="px-3 py-2"
              >
                ← Back
              </Button>
              <h3 className="font-display font-bold text-lg">Details</h3>
              <div className="w-10" />
            </div>

            <Card className="mb-6">
              {/* <CardPhoto style={{ height: "200px" }}>
              <div className="flex gap-2">{badges}</div>
            </CardPhoto> */}

              <CardBody>
                <h3 className="font-display font-bold text-xl text-text-primary mb-4">
                  {place.name}
                </h3>
                <p className="underline">Detailed Address</p>
                <p className="text-text-meta text-body-m mb-6">
                  {place.display_name}
                </p>

                <div className="space-y-4 mb-6">
                  <div className="pb-4 border-b border-border-subtle">
                    {/* <p className="text-label-s text-text-secondary mb-1">Site</p>
                    <p className="font-semibold text-live-text">
                      {place.website}
                    </p> */}
                  </div>
                  {/* <div className="pb-4 border-b border-dusk-600">
                    <p className="text-label-s text-slate-400 mb-1">Distance</p>
                    <p className="font-semibold text-fog-050">
                      {place.walkTime} walk · {place.distance}
                    </p>
                  </div> */}
                  <div className="pb-4 border-b border-border-subtle">
                    <p className="text-label-s text-text-secondary mb-1">
                      Place Type
                    </p>
                    <p className="font-semibold text-text-primary">
                      {String(place.type).charAt(0).toUpperCase() +
                        String(place.type).slice(1)}
                    </p>
                  </div>
                  <div></div>
                </div>

                <div className="flex gap-3">
                  {/* <Button
                    variant="primary"
                    fullWidth
                    onClick={handleDirections}
                    className="gap-x-3 p-2"
                  >
                    <FaMap />
                    <span>Get Directions</span>
                  </Button> */}
                  <Button variant="secondary" fullWidth className="flex gap-x-2 px-2 py-1 group hover:text-accent-text hover:text-[15px] hover:bg-surface-hover rounded-pill transition-standard"
                    onClick={handleSaveClick}
                  >
                    <span><FaSave /></span>
                    <span>Save</span>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
          {routeData && <MapRender geometry={routeData.routes[0].geometry} />}
         
        </div>
      )}
    </div>
    <div className="p-4">
      {isRouteLoading && <p>Loading map...</p>}
     {routeData && <RouteDirections leg={routeData.routes[0].legs[0]} className="min-h-[600px]"/>}
    </div>
    <SaveLocationModal
      open={isSaveModalOpen}
      onClose={closeSaveModal}
      placeName={place?.name}
    />
  </>
  );
}
