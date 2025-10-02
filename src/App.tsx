import { useEffect, useState } from "react"
import { Link } from "react-router"
import axios from "axios"
import { SearchResult } from "./components/SearchResults"
import type { resultType } from "./interfacesAndTypes"
import GeocodedInfo from "./components/GeocodedInfo"
import LoaderComp from "./components/LoaderComp"
import FromAI from "./components/FromAI"
import { FaHandSparkles } from "react-icons/fa6"

function App() {
  const [intermediateState, updateIntermediateState] = useState('')
  const [search_query, updateSearchQuery] = useState("")
  const [search_results, updateSearchResults] = useState<resultType[]>([])
  const [loaded, setLoaded] = useState(false)
  const [AIResults, updateAIResults] = useState<string[]>([])
  const [isUsingAI, setAIUseState ] = useState(true)

  useEffect(()=>{
    async function searchFromServer(query: string) {
      if(isUsingAI && query.length > 3){
        try{
      const {data} : {data: any[]} = await axios.get(`http://localhost:8090/ai/${query}`)
      if(data.length > 0){
      console.log(data, typeof data, data[0])
      updateAIResults(data)
      }
     
  } catch(error){
        console.log(error)
      }
}
    else{
      if(query.length > 1){
      const {data} : {data : resultType[]} = await axios.get(`http://localhost:8090/search/${query}`)
      updateSearchResults(data)
      setLoaded(true)
    }
    else{
      setLoaded(false)
    }
    }
  }
    searchFromServer(search_query)
  }, [search_query, isUsingAI])

  return (
    <>
    <div className="grid justify-items-center p-2 md:p-1">
      <GeocodedInfo />
      <div className="grid gap-x-2 w-[90vw] grid-cols-12 items-center">
        <button className="grid col-span-1" onClick={()=> setAIUseState(!isUsingAI)}>
        <FaHandSparkles fill="pink" size={24}/>
        </button>
        <input type="text" name="search" id="location_query" required placeholder="Where do you wanna go?" className="rounded-4xl p-1 md:w-full col-span-9 w-full border-2 indent-4 h-[5rem] border-black outline-none peer invalid:border-2 invalid:border-red-500 autofocus" autoComplete="true" minLength={3}  onChange={(e) => {
         if(!isUsingAI){
         if(e.target.value.length %2 ==0){
            updateSearchQuery(e.target.value)
          }
        }
        else{
            updateIntermediateState(e.target.value)
        }

        }}/>
        <button className={`ai_submit grid col-span-2 ${isUsingAI ? 'opacity-100': "opacity-0"}`} onClick={()=> {
          updateSearchQuery(intermediateState)
        }}>
        Submit
        </button>
        </div>
        <p className="peer-invalid:block hidden peer-invalid:text-red-400 text-sm">
          Please enter a longer search term
        </p>
        {isUsingAI ? 
        <div className="search_results w-[90%]">
              {AIResults.length > 0 && search_query.length > 5 ? AIResults.map((result) => <FromAI query={result} />): search_query.length > 5 ? <LoaderComp/>: null}
        </div> :
        <div className="search_results w-[90%] ">
          {search_query.length > 3 && loaded ? search_results?.slice(0,5).map((item)=> (
            <SearchResult item={item} key = {item.id}/>
          ))
        : search_query.length > 2 ? <LoaderComp /> : null
        }
        <div className="w-full grid justify-center">
        <Link to={`/results?query=${
          search_query
        }`} 
        className={`${search_results.length > 0 && search_query.length > 4 ? 'opacity-100' : 'opacity-0'} bg-yellow-300 grid text-center rounded-[1.5rem] text-xl md:text-2xl p-1 md:p-2`
        }>See More ... &gt; </Link>
        </div>
    </div>}
    </div>
    </>
  )
}

export default App
