import { useNavigate } from "react-router";
import { HeroCTA, MoodChips, SearchField } from "../layout";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { moodLabels } from "../../data/moods";

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
    const randomMood =
      moodLabels[Math.floor(Math.random() * moodLabels.length)];

    navigate(`/explore?q=${encodeURIComponent(randomMood)}`);
  };

  const handleMoodSelect = (mood: string) => {
    navigate(`/explore?q=${encodeURIComponent(mood)}`);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="flex flex-col md:w-4/5 w-full mx-auto gap-y-2">
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
                <p className="text-label-s text-text-secondary mb-2">Searching...</p>
              </div>
            )
          }
            {
              resultsRetrieved && searchResults.length === 0 && (
                <p className="text-label-s text-text-secondary mb-2">No results found.</p>
              )
             }
          {
            resultsRetrieved && searchResults.length > 0 && (
              <div className="mt-4">
                <h3 className="text-text-secondary mb-2">Search Results:</h3>   
              {
                resultsRetrieved && searchResults.length > 0 && searchResults.map((result: any) => (
                  <Link key={result.osm_id} to={`/place/${result.osm_id}?q=${result.name}`} className="mb-2 md:p-4 p-2 block bg-surface-raised rounded-md cursor-pointer hover:bg-surface-sunken transition-standard">
                    <p className="text-text-primary font-bold">{result.name}</p>
                    <span className="text-sm font-light" >{result.display_name}</span> {
                    result.type !== "yes" ? <span className="text-sm font-light"> || {result.type}</span>: null}
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
