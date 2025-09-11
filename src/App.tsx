import { useEffect, useState } from "react"
import { Link } from "react-router"
import axios from "axios"
import { SearchResult } from "./components/SearchResults"
import type { resultType } from "./interfacesAndTypes"
import GeocodedInfo from "./components/GeocodedInfo"

function App() {
  const [search_query, updateSearchQuery] = useState("")
  const [search_results, updateSearchResults] = useState<resultType[]>([])

  useEffect(()=>{
    async function searchFromServer(query: string) {
      if (query.includes('near me') || query.includes('nearby')){
        console.log("Using Nearby Search")
      }
      if(query.length > 1){
      const {data} : {data : resultType[]} = await axios.get(`http://localhost:8090/search/${query}}`)
      updateSearchResults(data)
    }
    else{}
  }
    searchFromServer(search_query)
  }, [search_query])

  return (
    <>
    <div className="grid justify-items-center p-2 md:p-1">
      <GeocodedInfo />
        <input type="text" name="search" id="location_query" required placeholder="Where do you wanna go?" className="rounded-4xl p-1 md:w-[80%] w-full block border-2 indent-4 h-[5rem] border-black outline-none peer invalid:border-2 invalid:border-red-500 autofocus" autoComplete="true" minLength={3}  onChange={(e) => {
          if(e.target.value.length %2 ==0){
            updateSearchQuery(e.target.value)
          }
        }}/>
        <p className="peer-invalid:block hidden peer-invalid:text-red-400 text-sm">
          Please enter a longer search term
        </p>

        <div className="search_results w-[90%] md:w-4/5">
          {search_query.length > 3 ? search_results?.slice(0,5).map((item)=> (
            <SearchResult item={item} key = {item.id}/>
          ))
        : null
        }
        <div className="w-full grid justify-center">
        <Link to={`/results?query=${
          search_query
        }`} 
        className={`${search_results.length > 0 && search_query.length > 0 ? 'opacity-100' : 'opacity-0'} grid text-center rounded-[2.5rem] text-xl md:text-2xl`
        }>See More ... &gt; </Link>
        </div>
    </div>
    </div>
    </>
  )
}

export default App
