import { Badge } from "../ui/Badge";

import {
  RecommendationCard,
} from "../layout/RecommendationCard";

import { useQuery } from "@tanstack/react-query";
import { GuestSavedState } from "./SavedScreen";
import { authClient } from "../../lib/authClient";
import GlobeLoader from "../GlobeLoader";
import type { OSMPlace } from "../../types/osm";
import { useNavigate } from "react-router";

export function RecommendationsScreen() {
  const {data} = authClient.useSession()
  const navigate = useNavigate()
  const {data: recommendations, isFetching: isLoadingRecommendations, isSuccess: loadedRecommendations} = useQuery({
  queryFn: async() => {
    try{
    const userData = await authClient.getSession()
    if(!userData){
      throw new Error("User not found!")
    }
    const getSaved = await fetch(`${import.meta.env.VITE_API_URL}/locations/${userData.data?.user.id}`, {
      credentials: 'include'
    })
    const savedResults: any[] = await getSaved.json()
    if(!savedResults){
      throw new Error("Cannot get saved results")
    }
    const request = await fetch(`${import.meta.env.VITE_API_URL}/recommendations`, {
      method: "POST", 
      credentials: "include",
       headers: {
              "Content-Type": "application/json",
            },
      body:  JSON.stringify({
        radiusMeters: 10000, 
        limit: 10, 
        anchors: savedResults.map((result) => {
          const newObj = {
            id: result.name, 
            latitude: result.lat, 
            longitude: result.lon, 
            osm_id: result.osm_id, 
            osm_type: result.osm_type
          }
          return newObj
        })
      })
    })
    const response = await request.json()
    if(!request.ok){throw new Error("request issues")}
    return response
  }
    catch(error){
      error instanceof Error ? error.message : "Unknown error"
    }
  },
  queryKey: ['user-recs'],   
  staleTime: 1 * 60 * 60 * 1000, 
  gcTime: 45 * 60 * 1000, 
  enabled: !!data?.user
})

  return (
    <div className="flex flex-col h-screen overflow-hidden">
    {loadedRecommendations &&<div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="mx-auto w-full max-w-6xl py-4 md:py-10">
          <header className="animate-phrase-in">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="solo">For you</Badge>
              <span className="font-data text-xs text-text-secondary">
                {recommendations.results.length} major picks
              </span>
            </div>

            <h1 className="mt-3 font-display text-2xl font-bold text-text-primary md:text-3xl">
              Recommendations for you
            </h1>
            <span>Based on your Saved Places -- save more to get better recs</span>
          </header>

          <section
            aria-labelledby="recommendations-heading"
            className="mt-6 md:mt-8"
          >
            {/* <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2
                  id="recommendations-heading"
                  className="font-display text-lg font-bold text-text-primary"
                >
                  Top picks near you
                </h2>
                <p className="mt-1 text-label-s uppercase text-text-secondary">
                  Curated for solo exploring
                </p>
              </div> */}

              {/* <Button
                variant="ghost"
                onClick={() => navigate("/explore")}
                className="gap-2"
              >
                <span>Browse all</span>
                <FaArrowRight aria-hidden="true" size={12} />
              </Button> 
            </div> */}

            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {loadedRecommendations && recommendations && recommendations.results.map((recommendation: OSMPlace) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  
                />
              ))}
            </div>
          </section>
        </div>
      </div>}
      {
        isLoadingRecommendations && <GlobeLoader />
      }
      {
        !data?.user &&   
        <div className="h-screen md:h-[80vh] w-screen grid items-center md:justify-items-center p-3 md:p-6">
        <GuestSavedState
          onSignUp={() => navigate("/profile")}
          onExplore={() => navigate("/explore")}
          text="Get Recommendations"
        />
  </div>
      }
    </div>
  );
}
