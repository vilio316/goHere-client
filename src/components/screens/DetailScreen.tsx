import { useParams, useNavigate, useSearchParams } from "react-router";
import { StatusBar } from "../layout";
import { Card, CardPhoto, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { useQuery } from "@tanstack/react-query";
import type { OSMPlace } from "../../types/osm";
import LoaderComp from "../LoaderComp";

export function DetailScreen() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const navigate = useNavigate();

  const searchProcessor = (q: string) => {
    if (q.includes("Medix")) return "medix";
    else {
      return q;
    }
  };

  const {
    data: place,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["details", id],
    staleTime: 1 * 60 * 60 * 1000,
    queryFn: async () => {
      if (!q) {
        return;
      }
      const request = await fetch(
        `${import.meta.env.VITE_API_URL}/search/${searchProcessor(q)}`,
      );
      const response = await request.json();
      const [data] = response.filter((item: OSMPlace) => item.osm_id == id);
      console.log(data);

      return data;
    },
  });

  if (isSuccess && !place) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <StatusBar />
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

  // const badges = [];
  // if (place.isOpenNow)
  //   badges.push(
  //     <Badge key="live" variant="live">
  //       Open now
  //     </Badge>,
  //   );
  // if (place.isSoloFriendly)
  //   badges.push(
  //     <Badge key="solo" variant="solo">
  //       🎯 Solo-friendly
  //     </Badge>,
  //   );
  // if (!place.isOpenNow)
  //   badges.push(
  //     <Badge key="closed" variant="closed">
  //       Closed
  //     </Badge>,
  //   );

  const handleDirections = () => {
    navigate(`/directions/${place.osm_id}`);
  };

  {
    isSuccess && <p>Successful</p>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <StatusBar />
      {isLoading && <LoaderComp />}
      {isSuccess && (
        <div className="flex-1 overflow-y-auto px-4 pb-20">
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
                <h3 className="font-display font-bold text-xl text-fog-050 mb-4">
                  {place.name}
                </h3>
                <p className="underline">Detailed Address</p>
                <p className="text-fog-100 text-body-m mb-6">
                  {place.display_name}
                </p>

                <div className="space-y-4 mb-6">
                  <div className="pb-4 border-b border-dusk-600">
                    {/* <p className="text-label-s text-slate-400 mb-1">Site</p>
                    <p className="font-semibold text-signal-500">
                      {place.website}
                    </p> */}
                  </div>
                  {/* <div className="pb-4 border-b border-dusk-600">
                    <p className="text-label-s text-slate-400 mb-1">Distance</p>
                    <p className="font-semibold text-fog-050">
                      {place.walkTime} walk · {place.distance}
                    </p>
                  </div> */}
                  <div className="pb-4 border-b border-dusk-600">
                    <p className="text-label-s text-slate-400 mb-1">
                      Place Type
                    </p>
                    <p className="font-semibold text-fog-050">
                      {String(place.type).charAt(0).toUpperCase() +
                        String(place.type).slice(1)}
                    </p>
                  </div>
                  <div></div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleDirections}
                  >
                    🗺️ Get Directions
                  </Button>
                  <Button variant="secondary" fullWidth>
                    💾 Save
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
