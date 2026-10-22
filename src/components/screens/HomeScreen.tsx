import { useNavigate } from "react-router";
import { HeroCTA, MoodChips, SearchField, StatusBar } from "../layout";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

export function HomeScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const {data: searchResults, isSuccess: resultsRetrieved, refetch, isLoading: isSearching} = useQuery({
    queryKey: ["search_result", searchQuery],
    enabled: false, 
    queryFn: async () => {
      try{
      const request = await fetch(`${import.meta.env.VITE_API_URL}/search/${searchQuery}`);
      const response = await request.json();
      return response;
    }
    catch (error) {
      `Error fetching search results: ${error instanceof Error ? error.message : "Unknown error"}`;
  }}, 
    staleTime: 1 * 60 * 60 * 1000,
  })

  const handleExplore = () => {
    const moods = [
    "Food & Drinks",
    "Parks/Gardens",
    "Healthcare & Wellness",
    "Spas & Relaxation",
    "Shopping",
    "Nightlife",
  ];

  const randomMood = moods[Math.floor(Math.random() * moods.length)];
    navigate(`/explore?q=${randomMood}`);
  };

  const handleMoodSelect = (mood: string) => {
    navigate(`/explore?q=${mood}`);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="flex flex-col max-w-xl mx-auto w-full">
          <HeroCTA onClick={handleExplore} />
          <MoodChips onMoodSelect={handleMoodSelect} />
          <div className="flex-1" />
          <SearchField placeholder="Search or explore…" submit={()=> {
            if(searchQuery.trim() !== '') {
              refetch();
            }
          }} onChange={(e)=> {
            setSearchQuery(e.target.value);
            }}  />
          {
            isSearching && (
              <div className="mt-4">
                <p className="text-label-s text-slate-400 mb-2">Searching...</p>
              </div>
            )
          }
          
          {
            resultsRetrieved && searchResults.length > 0 && (
              <div className="mt-4">
                <h3 className="text-label-s text-slate-400 mb-2">Search Results:</h3> 
             {
              resultsRetrieved && searchResults.length === 0 && (
                <p className="text-label-s text-slate-400 mb-2">No results found.</p>
              )
             }
            
             
              {
                resultsRetrieved && searchResults.length > 0 && searchResults.map((result: any) => (
                  <Link key={result.osm_id} to={`/place/${result.osm_id}?q=${result.name}`} className="mb-2 p-2 block bg-dusk-800 rounded-md cursor-pointer hover:bg-dusk-700 transition-standard">
                    <p className="text-fog-050 font-bold">{result.name}</p>
                    <span className="text-sm font-light" >{result.display_name}</span> || <span className="text-sm font-light">{result.type}</span>
                  </Link>
                ))
              }
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
